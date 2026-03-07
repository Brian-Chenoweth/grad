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

function splitMulti(value = '') {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatPhoneForHref(value = '') {
  return String(value).replace(/[^\d+]/g, '');
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
    programType,
    contactName,
    contactPhone,
    contactEmail,
    contactWeb,
  } = programFields ?? {};
  const collegeDisplay = toTitleCase(college);
  const programTypeDisplay = toTitleCase(programType);
  const applyNowUrl = getProgramApplyLink(props.data.program) ?? contactWeb;
  const contactNames = splitMulti(contactName);
  const contactPhones = splitMulti(contactPhone);
  const contactEmails = splitMulti(contactEmail);
  const contactCount = Math.max(
    contactNames.length,
    contactPhones.length,
    contactEmails.length
  );
  const contacts = Array.from({ length: contactCount }, (_, index) => ({
    name: contactNames[index] ?? '',
    phone: contactPhones[index] ?? '',
    email: contactEmails[index] ?? '',
  })).filter((contact) => contact.name || contact.phone || contact.email);

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
                programType ||
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
                    {programTypeDisplay && (
                      <li className={styles.metaItem}>
                        <span className={styles.metaLabel}>Program Type</span>
                        <span className={styles.metaValue}>{programTypeDisplay}</span>
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

                  {contacts.length > 0 && (
                    <>
                      <h3 className={styles.contactTitle}>Contact</h3>
                      <ul className={styles.contactCards}>
                        {contacts.map((contact, index) => {
                          const isSingleContact = contacts.length === 1;
                          const showNameAsHeading = Boolean(contact.name);
                          const fallbackHeading = isSingleContact
                            ? 'Contact'
                            : `Contact ${index + 1}`;

                          return (
                            <li
                              className={`${styles.contactCard} ${
                                isSingleContact ? styles.contactCardSingle : ''
                              }`}
                              key={`${contact.name}-${contact.email}-${contact.phone}-${index}`}
                            >
                              <h4 className={styles.contactCardTitle}>
                                {showNameAsHeading ? contact.name : fallbackHeading}
                              </h4>
                              {!showNameAsHeading && contact.name && (
                                <div className={styles.contactItem}>
                                  <span className={styles.metaLabel}>Name</span>
                                  <span className={styles.metaValue}>{contact.name}</span>
                                </div>
                              )}
                              {contact.phone && (
                                <div className={styles.contactItem}>
                                  <span className={styles.metaLabel}>Phone</span>
                                  <a
                                    className={styles.contactLink}
                                    href={`tel:${formatPhoneForHref(contact.phone)}`}
                                  >
                                    {contact.phone}
                                  </a>
                                </div>
                              )}
                              {contact.email && (
                                <div className={styles.contactItem}>
                                  <span className={styles.metaLabel}>Email</span>
                                  <a
                                    className={styles.contactLink}
                                    href={`mailto:${contact.email}`}
                                  >
                                    {contact.email}
                                  </a>
                                </div>
                              )}
                            </li>
                          );
                        })}
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
        programType
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
