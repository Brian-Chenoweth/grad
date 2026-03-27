import * as MENUS from 'constants/menus';

import { gql, useQuery } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';
import Link from 'next/link';
import {
  Footer,
  Header,
  Main,
  NavigationMenu,
  SEO,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import styles from 'styles/pages/_404.module.scss';

const QUICK_LINKS = [
  {
    href: '/programs',
    title: 'Explore Programs',
    description: 'Compare graduate programs, certificates, and academic options.',
  },
  {
    href: '/current-students',
    title: 'Current Students',
    description: 'Jump to student resources, support information, and key next steps.',
  },
  {
    href: '/contact-us',
    title: 'Contact Us',
    description: 'Find the best path to reach the Graduate Education team directly.',
  },
];

export default function Custom404Page() {
  const { data, loading } = useQuery(Custom404Page.query, {
    variables: Custom404Page.variables(),
  });

  if (loading) {
    return <></>;
  }

  const siteTitle = data?.generalSettings?.title ?? 'Graduate Education';
  const siteDescription =
    data?.generalSettings?.description ??
    'Official site for Cal Poly Graduate Education.';
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const footerNavOne = data?.footerSecondaryMenuItems?.nodes ?? [];
  const footerNavTwo = data?.footerTertiaryMenuItems?.nodes ?? [];

  return (
    <>
      <SEO
        title={`Page Not Found | ${siteTitle}`}
        description="The page you requested could not be found. Browse graduate programs, news, and resources from the main site."
        keywords="404, page not found, graduate education, cal poly"
        noindex
      />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />

      <Main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.copy}>
                <p className={styles.kicker}>404 Error</p>
                <h1 className={styles.title}>This page is off the map.</h1>
                <p className={styles.description}>
                  The link may be outdated, the page may have moved, or the URL
                  may have been entered incorrectly. Use one of the paths below
                  to get back into the main Graduate Education site.
                </p>

                <div className={styles.actions}>
                  <Link href="/" passHref legacyBehavior>
                    <a className={styles.primaryAction}>Return Home</a>
                  </Link>
                  <Link href="/search" passHref legacyBehavior>
                    <a className={styles.secondaryAction}>Search the Site</a>
                  </Link>
                </div>
              </div>


            </div>
          </div>
        </section>

        <section className={styles.linksSection}>
          <div className="container">
            <div className={styles.linksHeader}>
              <p className={styles.sectionLabel}>Popular destinations</p>
              <h2 className={styles.sectionTitle}>Pick up from a known path.</h2>
            </div>

            <div className={styles.cardGrid}>
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} passHref legacyBehavior>
                  <a className={styles.card}>
                    <span className={styles.cardTitle}>{link.title}</span>
                    <span className={styles.cardDescription}>{link.description}</span>
                    <span className={styles.cardCta}>Open section</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
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

Custom404Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    footerSecondaryLocation: MENUS.FOOTER_SECONDARY_LOCATION,
    footerTertiaryLocation: MENUS.FOOTER_TERTIARY_LOCATION,
  };
};

Custom404Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query Get404PageData(
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

export function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: Custom404Page,
  });
}
