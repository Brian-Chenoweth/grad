import * as MENUS from 'constants/menus';

import { gql } from '@apollo/client';
import React from 'react';
import {
  Footer,
  Header,
  EntryHeader,
  Main,
  SEO,
  NavigationMenu,
} from 'components';
import { getNextStaticProps } from '@faustwp/core';
import { buildKeywordString, pageTitle } from 'utilities';
import { BlogInfoFragment } from 'fragments/GeneralSettings';

export default function Page(props) {
  const data = props?.data;
  const { title: siteTitle } = data?.generalSettings ?? {};
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const footerNavOne = data?.footerSecondaryMenuItems?.nodes ?? [];
  const footerNavTwo = data?.footerTertiaryMenuItems?.nodes ?? [];
  const description =
    'Project listings are currently unavailable on this site.';
  const keywords = buildKeywordString({
    title: 'Projects',
    content: description,
    seedKeywords: ['graduate projects', 'cal poly', 'graduate education'],
  });

  return (
    <>
      <SEO
        title={pageTitle(data?.generalSettings, 'Projects')}
        description={description}
        keywords={keywords}
        schemaType="CollectionPage"
      />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title="Projects" />
        <div className="container">
          <p>
            Project listings are not currently available from the connected
            WordPress source.
          </p>
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

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetProjectsPage(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $footerSecondaryLocation: MenuLocationEnum
    $footerTertiaryLocation: MenuLocationEnum
  ) {
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

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    footerSecondaryLocation: MENUS.FOOTER_SECONDARY_LOCATION,
    footerTertiaryLocation: MENUS.FOOTER_TERTIARY_LOCATION,
  };
};

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
  });
}
