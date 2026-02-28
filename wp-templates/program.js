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
  const applyNowUrl = getProgramApplyLink(college) ?? contactWeb;

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
            <ContentWrapper content={content}>
              {(college ||
                blended ||
                contactName ||
                contactPhone ||
                contactEmail ||
                contactWeb) && (
                <section>
                  <h2>Program Details</h2>
                  <ul>
                    {college && (
                      <li>
                        <strong>College:</strong> {college}
                      </li>
                    )}
                    {typeof blended === 'boolean' && (
                      <li>
                        <strong>Blended:</strong> {blended ? 'Yes' : 'No'}
                      </li>
                    )}
                  </ul>

                  {(contactName || contactPhone || contactEmail || contactWeb) && (
                    <>
                      <h3>Contact</h3>
                      <ul>
                        {contactName && (
                          <li>
                            <strong>Name:</strong> {contactName}
                          </li>
                        )}
                        {contactPhone && (
                          <li>
                            <strong>Phone:</strong>{' '}
                            <a href={`tel:${String(contactPhone).replace(/[^\d+]/g, '')}`}>
                              {contactPhone}
                            </a>
                          </li>
                        )}
                        {contactEmail && (
                          <li>
                            <strong>Email:</strong>{' '}
                            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                          </li>
                        )}
                        {contactWeb && (
                          <li>
                            <strong>Web:</strong>{' '}
                            <a href={contactWeb} target="_blank" rel="noopener noreferrer">
                              {contactWeb}
                            </a>
                          </li>
                        )}
                      </ul>
                    </>
                  )}

                  {applyNowUrl && (
                    <p>
                      <Button
                        href={applyNowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                      </Button>
                    </p>
                  )}
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
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerSecondaryMenuItems: menuItems(where: { location: $footerSecondaryLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerTertiaryMenuItems: menuItems(where: { location: $footerTertiaryLocation }) {
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
