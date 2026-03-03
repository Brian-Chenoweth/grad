import * as MENUS from 'constants/menus';
import { getProgramApplyLink } from 'constants/programApplyLinks';

import { gql } from '@apollo/client';
import {
  Header,
  Footer,
  Main,
  Button,
  EntryHeader,
  NavigationMenu,
  ContentWrapper,
  FeaturedImage,
  SEO,
} from 'components';
import { pageTitle } from 'utilities';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import styles from 'styles/pages/_Program.module.scss';

function toTitleCase(value) {
  if (!value) return value;
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

export default function Component(props) {
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const footerNavOne = props?.data?.footerSecondaryMenuItems?.nodes ?? [];
  const footerNavTwo = props?.data?.footerTertiaryMenuItems?.nodes ?? [];
  const { title, content, featuredImage, programFields } = props.data.program;
  const {
    college,
    blended,
    contactName,
    contactPhone,
    contactEmail,
    contactWeb,
  } = programFields ?? {};
  const collegeDisplay = toTitleCase(college);
  const applyNowUrl = getProgramApplyLink(props.data.program) ?? contactWeb;

  return (
    <>
      <SEO
        title={pageTitle(
          props?.data?.generalSettings,
          title,
          props?.data?.generalSettings?.title
        )}
        description={siteDescription}
        imageUrl={featuredImage?.node?.sourceUrl}
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
            <ContentWrapper className={styles.programContent} content={content}>
              {(college ||
                blended ||
                contactName ||
                contactPhone ||
                contactEmail ||
                contactWeb) && (
                <section className={styles.metaPanel}>
                  <h2 className={styles.metaPanelTitle}>Program Details</h2>
                  <ul className={styles.metaList}>
                    {college && (
                      <li className={styles.metaItem}>
                        <span className={styles.metaLabel}>College</span>
                        <span className={styles.metaValue}>{collegeDisplay}</span>
                      </li>
                    )}
                    {typeof blended === 'boolean' && (
                      <li className={styles.metaItem}>
                        <span className={styles.metaLabel}>Blended Program</span>
                        <span className={styles.metaValue}>
                          {blended ? 'Yes' : 'No'}
                        </span>
                      </li>
                    )}
                    {contactWeb && (
                      <li className={styles.metaItem}>
                        <span className={styles.metaLabel}>Program Website</span>
                        <a
                          className={styles.contactLink}
                          href={contactWeb}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Program Website
                        </a>
                      </li>
                    )}
                  </ul>

                  {(contactName || contactPhone || contactEmail) && (
                    <>
                      <h3 className={styles.contactTitle}>Contact</h3>
                      <ul className={styles.contactList}>
                        {contactName && (
                          <li className={styles.contactItem}>
                            <span className={styles.metaLabel}>Name</span>
                            <span className={styles.metaValue}>{contactName}</span>
                          </li>
                        )}
                        {contactPhone && (
                          <li className={styles.contactItem}>
                            <span className={styles.metaLabel}>Phone</span>
                            <a
                              className={styles.contactLink}
                              href={`tel:${String(contactPhone).replace(/[^\d+]/g, '')}`}
                            >
                              {contactPhone}
                            </a>
                          </li>
                        )}
                        {contactEmail && (
                          <li className={styles.contactItem}>
                            <span className={styles.metaLabel}>Email</span>
                            <a className={styles.contactLink} href={`mailto:${contactEmail}`}>
                              {contactEmail}
                            </a>
                          </li>
                        )}
                      </ul>
                    </>
                  )}

                  <div className={styles.actionRow}>
                    {applyNowUrl && (
                      <Button
                        className={styles.applyButton}
                        href={applyNowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                      </Button>
                    )}

                    <Button className={styles.backButton} href="/programs">
                      Back to Programs
                    </Button>
                  </div>
                </section>
              )}
            </ContentWrapper>
          </div>
        </>
      </Main>
      <Footer
        title={siteTitle}
        menuItems={footerMenu}
        navOneMenuItems={footerNavOne}
        navTwoMenuItems={footerNavTwo}
      />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  query GetProgram(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $footerSecondaryLocation: MenuLocationEnum
    $footerTertiaryLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    program(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      uri
      title
      content
      programFields {
        college
        blended
        contactName
        contactPhone
        contactEmail
        contactWeb
      }
      ...FeaturedImageFragment
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
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerSecondaryMenuItems: menuItems(where: { location: $footerSecondaryLocation }, first: 100) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerTertiaryMenuItems: menuItems(where: { location: $footerTertiaryLocation }, first: 100) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    footerSecondaryLocation: MENUS.FOOTER_SECONDARY_LOCATION,
    footerTertiaryLocation: MENUS.FOOTER_TERTIARY_LOCATION,
    asPreview: ctx?.asPreview,
  };
};
