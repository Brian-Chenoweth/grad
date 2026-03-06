import * as MENUS from 'constants/menus';

import { gql } from '@apollo/client';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { pageTitle } from 'utilities';
import styles from 'styles/pages/_CoordinatorDirectory.module.scss';

import {
  Header,
  Footer,
  Main,
  ContentWrapper,
  EntryHeader,
  NavigationMenu,
  FeaturedImage,
  SEO,
} from '../components';

// Client-only form to avoid SSR/client mismatch.
const ContactForm = dynamic(() => import('components/ContactForm'), { ssr: false });

const TOKEN = '<!-- FORMSPREE_CONTACT -->';
const SLOT_HTML = '<div id="contact-form-slot"></div>';

// Portals ContactForm into placeholder div after mount.
function ContactFormIntoSlot() {
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    setSlot(document.getElementById('contact-form-slot'));
  }, []);

  if (!slot) return null;
  return createPortal(<ContactForm />, slot);
}

function normalize(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function toTitleCase(value) {
  if (!value) return '';
  const minorWords = new Set(['and', 'or', 'of', 'the', 'in', 'for', 'to', 'a']);
  return String(value)
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (!word) return word;
      if (index > 0 && minorWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatPhoneForHref(value = '') {
  return String(value).replace(/[^\d+]/g, '');
}

function splitMulti(value = '') {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasRenderableContent(value = '') {
  const textOnly = String(value)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .trim();

  return Boolean(textOnly);
}

export default function Component(props) {
  const router = useRouter();

  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];

  const quickLinks   = props?.data?.quickFooterMenuItems?.nodes ?? [];
  const footerMenu   = props?.data?.footerMenuItems?.nodes ?? [];
  const aboutLinks   = props?.data?.aboutFooterMenuItems?.nodes ?? [];
  const navOne       = props?.data?.footerSecondaryMenuItems?.nodes ?? [];
  const navTwo       = props?.data?.footerTertiaryMenuItems?.nodes ?? [];
  const resources    = props?.data?.resourcesFooterMenuItems?.nodes ?? [];

  const page = props?.data?.page ?? { title: '' };
  const { title, content, featuredImage, seo: s, uri } = page;
  const isCoordinatorPage =
    String(uri ?? '').replace(/\/+$/, '') === '/graduate-program-coordinators';
  const programNodes = props?.data?.programs?.nodes ?? [];

  const groupedPrograms = programNodes
    .map((program) => {
      const fields = program?.programFields ?? {};
      return {
        title: normalize(program?.title),
        college: toTitleCase(normalize(fields.college)) || 'Other Programs',
        coordinator: normalize(fields.contactName),
        contact: normalize(fields.contactEmail),
        phone: normalize(fields.contactPhone),
      };
    })
    .filter((program) => program.title && (program.coordinator || program.contact || program.phone))
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce((acc, program) => {
      if (!acc[program.college]) acc[program.college] = [];
      acc[program.college].push(program);
      return acc;
    }, {});
  const groupedByCollege = Object.entries(groupedPrograms).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const htmlWithSlot = (content ?? '').split(TOKEN).join(SLOT_HTML);
  const showContentWrapper = htmlWithSlot.includes(SLOT_HTML) || hasRenderableContent(content);

  // ---- Yoast → SEO props with smart fallbacks ----
  const computedTitle =
    s?.title ||
    pageTitle(props?.data?.generalSettings, title, props?.data?.generalSettings?.title);

  const computedDescription =
    s?.metaDesc || siteDescription || 'Official site for Cal Poly Graduate Education.';

  const computedImageUrl =
    s?.opengraphImage?.mediaItemUrl ||
    featuredImage?.node?.sourceUrl ||
    '/images/og-default.jpg';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const computedCanonical =
    s?.canonical ||
    (baseUrl && router?.asPath ? `${baseUrl}${router.asPath}` : undefined);



  const ogType = s?.opengraphType || 'website';
  const ogSiteName = s?.opengraphSiteName || siteTitle;

  return (
    <>
      <SEO
        title={computedTitle}
        description={computedDescription}
        imageUrl={computedImageUrl}
        url={computedCanonical}
        type={ogType}
        siteName={ogSiteName}
      />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <>
          <EntryHeader title={title} image={featuredImage?.node} />
          <div className="container">
            {showContentWrapper && <ContentWrapper content={htmlWithSlot} />}
            <ContactFormIntoSlot />
            {isCoordinatorPage && (
              <section className={styles.directorySection}>
                {/* <h2 className={styles.directoryTitle}>Graduate Program Coordinators</h2> */}
                {groupedByCollege.map(([college, programs]) => (
                  <div key={college} className={styles.collegeBlock}>
                    <h3 className={styles.collegeTitle}>{college}</h3>
                    <div className={styles.tableWrap}>
                      <table className={styles.directoryTable}>
                        <thead>
                          <tr>
                            <th>Program</th>
                            <th>Coordinator</th>
                            <th>Contact</th>
                            <th>Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {programs.map((program) => (
                            <tr key={`${college}-${program.title}`}>
                              <td>{program.title}</td>
                              <td>
                                {splitMulti(program.coordinator).length ? (
                                  splitMulti(program.coordinator).map((name) => (
                                    <span key={`${program.title}-${name}`} className={styles.multiLineValue}>
                                      {name}
                                    </span>
                                  ))
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td>
                                {splitMulti(program.contact).length ? (
                                  splitMulti(program.contact).map((email) => (
                                    <span key={`${program.title}-${email}`} className={styles.multiLineValue}>
                                      <a href={`mailto:${email}`}>{email}</a>
                                    </span>
                                  ))
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td>
                                {splitMulti(program.phone).length ? (
                                  splitMulti(program.phone).map((phone) => (
                                    <span key={`${program.title}-${phone}`} className={styles.multiLineValue}>
                                      <a href={`tel:${formatPhoneForHref(phone)}`}>
                                        {phone}
                                      </a>
                                    </span>
                                  ))
                                ) : (
                                  '-'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </>
      </Main>
      <Footer
        title={siteTitle}
        menuItems={footerMenu}               // fallback resources source (FOOTER)
        navOneMenuItems={navOne}              // middle: Footer Secondary
        navTwoMenuItems={navTwo}              // right: Footer Tertiary
        resourcesMenuItems={resources}        // new Resources block
        aboutMenuItems={aboutLinks}
      />
    </>
  );
}

Component.variables = ({ databaseId }, ctx) => {
  const fallbackFooterLocation = MENUS.FOOTER_LOCATION ?? null;

  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    // was FOOTER_LOCATION — stop using it
    footerLocation: fallbackFooterLocation,
    quickFooterLocation: MENUS.QUICK_FOOTER_LOCATION ?? fallbackFooterLocation,
    aboutFooterLocation: MENUS.ABOUT_FOOTER_LOCATION ?? fallbackFooterLocation,
    footerSecondaryLocation:
      MENUS.FOOTER_SECONDARY_LOCATION ?? fallbackFooterLocation,
    footerTertiaryLocation:
      MENUS.FOOTER_TERTIARY_LOCATION ?? fallbackFooterLocation,
    resourcesFooterLocation:
      MENUS.RESOURCES_FOOTER_LOCATION ?? fallbackFooterLocation,
    asPreview: ctx?.asPreview,
  };
};

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  query GetPageData(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $quickFooterLocation: MenuLocationEnum
    $aboutFooterLocation: MenuLocationEnum
    $footerSecondaryLocation: MenuLocationEnum
    $footerTertiaryLocation: MenuLocationEnum
    $resourcesFooterLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      uri
      ...FeaturedImageFragment
      seo {
        title
        metaDesc
        canonical
        opengraphType
        opengraphSiteName
        opengraphImage {
          mediaItemUrl
        }
        metaRobotsNoindex
        metaRobotsNofollow
      }
    }
    programs(first: 500) {
      nodes {
        title
        programFields {
          college
          contactName
          contactEmail
          contactPhone
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }, first: 100) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }, first: 100) {
      nodes { ...NavigationMenuItemFragment }
    }
    quickFooterMenuItems: menuItems(where: { location: $quickFooterLocation }, first: 100) {
      nodes { ...NavigationMenuItemFragment }
    }
    aboutFooterMenuItems: menuItems(where: { location: $aboutFooterLocation }, first: 100) {
      nodes { ...NavigationMenuItemFragment }
    }
    footerSecondaryMenuItems: menuItems(where: { location: $footerSecondaryLocation }, first: 100) {
      nodes { ...NavigationMenuItemFragment }
    }
    footerTertiaryMenuItems: menuItems(where: { location: $footerTertiaryLocation }, first: 100) {
      nodes { ...NavigationMenuItemFragment }
    }
    resourcesFooterMenuItems: menuItems(where: { location: $resourcesFooterLocation }, first: 100) {
      nodes { ...NavigationMenuItemFragment }
    }
  }
`;
