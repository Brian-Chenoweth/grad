import * as MENUS from 'constants/menus';

import { gql } from '@apollo/client';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import { pageTitle } from 'utilities';

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

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';


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
  const aboutLinks   = props?.data?.aboutFooterMenuItems?.nodes ?? [];
  const navOne       = props?.data?.footerSecondaryMenuItems?.nodes ?? [];
  const navTwo       = props?.data?.footerTertiaryMenuItems?.nodes ?? [];
  const resources    = props?.data?.resourcesFooterMenuItems?.nodes ?? [];

  const page = props?.data?.page ?? { title: '' };
  const { title, content, featuredImage, seo: s } = page;

  const htmlWithSlot = (content ?? '').split(TOKEN).join(SLOT_HTML);

  // ---- Yoast → SEO props with smart fallbacks ----
  const computedTitle =
    s?.title ||
    pageTitle(props?.data?.generalSettings, title, props?.data?.generalSettings?.title);

  const computedDescription =
    s?.metaDesc || siteDescription || 'Official site for Cal Poly Partners.';

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
            <ContentWrapper content={htmlWithSlot} />
            <ContactFormIntoSlot />
          </div>
        </>
      </Main>
      <Footer
        title={siteTitle}
        menuItems={quickLinks}                // left column: Quick Footer
        navOneMenuItems={navOne}              // middle: Footer Secondary
        navTwoMenuItems={navTwo}              // right: Footer Tertiary
        resourcesMenuItems={resources}        // new Resources block
        aboutMenuItems={aboutLinks}
      />
    </>
  );
}

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    // was FOOTER_LOCATION — stop using it
    footerLocation: MENUS.FOOTER_LOCATION,
    quickFooterLocation: MENUS.QUICK_FOOTER_LOCATION,
    aboutFooterLocation: MENUS.ABOUT_FOOTER_LOCATION,
    footerSecondaryLocation: MENUS.FOOTER_SECONDARY_LOCATION,
    footerTertiaryLocation: MENUS.FOOTER_TERTIARY_LOCATION,
    resourcesFooterLocation: MENUS.RESOURCES_FOOTER_LOCATION,
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
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }, first: 100) {
      nodes {
        ...NavigationMenuItemFragment
      }
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
