import * as MENUS from 'constants/menus';

import { gql, useQuery } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';
import {
  Button,
  Header,
  Footer,
  Main,
  NavigationMenu,
  SearchInput,
  SearchResults,
  SEO,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import { useState } from 'react';
import { GetSearchResults } from 'queries/GetSearchResults';
import styles from 'styles/pages/_Search.module.scss';
import appConfig from 'app.config';
import { buildKeywordString } from 'utilities';

// const PROGRAM_TYPES = [
//   { name: 'All Graduate Programs', uri: '/programs' },
//   { name: 'Blended Programs', uri: '/blended-programs' },
// ];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: pageData } = useQuery(Page.query, {
    variables: Page.variables(),
  });

  const { title: siteTitle, description: siteDescription } =
    pageData.generalSettings;
  const primaryMenu = pageData.headerMenuItems.nodes ?? [];
  const footerMenu = pageData.footerMenuItems.nodes ?? [];
  const footerNavOne = pageData.footerSecondaryMenuItems.nodes ?? [];
  const footerNavTwo = pageData.footerTertiaryMenuItems.nodes ?? [];
  const searchDescription = searchQuery
    ? `Search results for "${searchQuery}" across Cal Poly Graduate Education content.`
    : 'Search the site for graduate programs, admissions information, news, and resources.';
  const searchKeywords = buildKeywordString({
    title: 'Search',
    content: `${searchDescription} ${searchQuery}`,
    seedKeywords: ['site search', 'graduate education', 'cal poly'],
  });

  const {
    data: searchResultsData,
    loading: searchResultsLoading,
    error: searchResultsError,
    fetchMore: fetchMoreSearchResults,
  } = useQuery(GetSearchResults, {
    variables: {
      first: appConfig.postsPerPage,
      after: '',
      search: searchQuery,
    },
    skip: searchQuery === '',
    fetchPolicy: 'network-only',
  });

  return (
    <>
      <SEO
        title={searchQuery ? `${searchQuery} Search | ${siteTitle}` : `Search | ${siteTitle}`}
        description={searchDescription || siteDescription}
        keywords={searchKeywords}
        noindex
        schemaType="SearchResultsPage"
      />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />

      <Main>
        <div className={styles['search-header-pane']}>
          <div className="container small">
            <h1 className={styles['search-page-title']}>Search</h1>
            {searchQuery && !searchResultsLoading && (
              <h2 className={styles['search-header-text']}>
                Showing results for &quot;{searchQuery}&quot;
              </h2>
            )}
            <SearchInput
              value={searchQuery}
              onChange={(newValue) => setSearchQuery(newValue)}
            />
          </div>
        </div>

        <div className="container small">
          {searchResultsError && (
            <div className="alert-error">
              An error has occurred. Please refresh and try again.
            </div>
          )}

          <SearchResults
            searchResults={searchResultsData?.contentNodes?.edges?.map(
              ({ node }) => node
            )}
            isLoading={searchResultsLoading}
          />

          {searchResultsData?.contentNodes?.pageInfo?.hasNextPage && (
            <div className={styles['load-more']}>
              <Button
                onClick={() => {
                  fetchMoreSearchResults({
                    variables: {
                      after:
                        searchResultsData?.contentNodes?.pageInfo?.endCursor,
                    },
                  });
                }}
              >
                Load more
              </Button>
            </div>
          )}

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

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    footerSecondaryLocation: MENUS.FOOTER_SECONDARY_LOCATION,
    footerTertiaryLocation: MENUS.FOOTER_TERTIARY_LOCATION,
  };
};

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
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

export function getStaticProps(ctx) {
  return getNextStaticProps(ctx, { Page });
}
