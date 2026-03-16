import * as MENUS from 'constants/menus';

import { gql } from '@apollo/client';
import {
  Header,
  EntryHeader,
  Footer,
  ProjectHeader,
  ContentWrapper,
  NavigationMenu,
  FeaturedImage,
  Main,
  SEO,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import { buildKeywordString, buildMetaDescription } from 'utilities';

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }
  const { title: siteTitle } = props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const footerNavOne = props?.data?.footerSecondaryMenuItems?.nodes ?? [];
  const footerNavTwo = props?.data?.footerTertiaryMenuItems?.nodes ?? [];
  const { featuredImage } = props.data.project;
  const { title, summary, contentArea } = props.data.project.projectFields;
  const description = buildMetaDescription({
    title,
    content: `${summary ?? ''} ${contentArea ?? ''}`,
    fallback: `Explore the ${title} project from ${siteTitle}.`,
  });
  const keywords = buildKeywordString({
    title,
    content: `${summary ?? ''} ${contentArea ?? ''}`,
    seedKeywords: ['project', 'graduate education', 'cal poly'],
  });

  return (
    <>
      <SEO
        title={`${title} - ${props?.data?.generalSettings?.title}`}
        description={description}
        keywords={keywords}
        imageUrl={featuredImage?.node?.sourceUrl}
      />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title={title} />
        <ProjectHeader
          image={featuredImage?.node}
          summary={summary}
          title={title}
        />
        <div className="container">
          <ContentWrapper content={contentArea} />
        </div>
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
  query GetPost(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $footerSecondaryLocation: MenuLocationEnum
    $footerTertiaryLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    project(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      projectFields {
        title: projectTitle
        summary
        contentArea
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
