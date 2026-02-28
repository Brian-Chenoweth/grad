import * as MENUS from 'constants/menus';

import { useQuery, gql } from '@apollo/client';
import { FaArrowRight, FaClipboardList, FaUserFriends, FaUsers } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/pages/_Home.module.scss';
import {
  EntryHeader,
  Main,
  Button,
  Heading,
  CTA,
  NavigationMenu,
  SEO,
  Header,
  Footer,
  Posts,
  Programs,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';

const postsPerPage = 3;
const homeQuickLinks = [
  { label: 'How to Apply', href: '/how-to-apply', icon: FaClipboardList },
  { label: 'Coordinators', href: '/coordinators', icon: FaUsers },
  { label: 'Staff', href: '/staff', icon: FaUserFriends },
];

export default function Component() {
  const { data, loading } = useQuery(Component.query, {
    variables: Component.variables(),
  });
  if (loading) {
    return null;
  }

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const footerNavOne = data?.footerSecondaryMenuItems?.nodes ?? [];
  const footerNavTwo = data?.footerTertiaryMenuItems?.nodes ?? [];

  const mainBanner = {
    sourceUrl: '/static/banner.jpeg',
    mediaDetails: { width: 1200, height: 600 },
    altText: 'Portfolio Banner',
  };
  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />

      <Main className={styles.home}>
        <EntryHeader image={mainBanner} />
        <div className="container">
          <section className="hero text-center">
            <Heading className={styles.heading} level="h1">
              Welcome to your Blueprint
            </Heading>
            <p className={styles.description}>
              Achieve unprecedented performance with modern frameworks and the
              world&apos;s #1 open source CMS in one powerful headless platform.{' '}
            </p>
            <div className={styles.actions}>
              <Button styleType="secondary" href="/contact-us">
                GET STARTED
              </Button>
              <Button styleType="primary" href="/about">
                LEARN MORE
              </Button>
            </div>
          </section>
          <section className="cta">
            <CTA
              Button={() => (
                <Button href="/posts">
                  Get Started <FaArrowRight style={{ marginLeft: `1rem` }} />
                </Button>
              )}
            >
              <span>
                Learn about Core Web Vitals and how Headless Platform can help
                you reach your most demanding speed and user experience
                requirements.
              </span>
            </CTA>
          </section>
          <section className={styles.posts}>
            <Heading className={styles.heading} level="h2">
              Latest Posts
            </Heading>
            <Posts posts={data.posts?.nodes} id="posts-list" />
          </section>
          <section className="cta">
            <CTA
              Button={() => (
                <Button href="/posts">
                  Get Started <FaArrowRight style={{ marginLeft: `1rem` }} />
                </Button>
              )}
            >
              <span>
                Learn about Core Web Vitals and how Headless Platform can help
                you reach your most demanding speed and user experience
                requirements.
              </span>
            </CTA>
          </section>
          <section className={styles.programs}>
            <Heading className={styles.heading} level="h2">
              Programs
            </Heading>
            <p className={styles.description}>
              Here are just a few of the nice things our customers have to say.
            </p>
            <Programs programs={data?.programs?.nodes} />
          </section>
        </div>
        <section className={styles.currentStudents}>
          <div className={`container ${styles.currentStudentsInner}`}>
            <div className={styles.currentStudentsContent}>
              <Heading className={styles.currentStudentsTitle} level="h2">
                Current Graduate Students
              </Heading>
              <Link href="/resources" className={styles.currentStudentsLink}>
                Learn about orientation, forms, and other resources
              </Link>
            </div>
            <div className={styles.currentStudentsImage}>
              <Image
                src="/home/cadets-smiling-in-uniform-cal-maritime.jpg"
                alt="Graduate students studying together"
                width={920}
                height={520}
              />
            </div>
          </div>
        </section>
        <section className={styles.homeQuickLinks} aria-label="Quick links">
          <div className="container">
            <ul className={styles.quickLinksList}>
              {homeQuickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a href={item.href} className={styles.quickLinkItem}>
                      <span className={styles.quickLinkIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span className={styles.quickLinkLabel}>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </Main>
      <Footer
        menuItems={footerMenu}
        navOneMenuItems={footerNavOne}
        navTwoMenuItems={footerNavTwo}
      />
    </>
  );
}

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    footerSecondaryLocation: MENUS.FOOTER_SECONDARY_LOCATION,
    footerTertiaryLocation: MENUS.FOOTER_TERTIARY_LOCATION,
    first: postsPerPage,
  };
};

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${Posts.fragments.entry}
  ${Programs.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $footerSecondaryLocation: MenuLocationEnum
    $footerTertiaryLocation: MenuLocationEnum
    $first: Int
  ) {
    posts(first: $first) {
      nodes {
        ...PostsItemFragment
      }
    }
    programs {
      nodes {
        ...ProgramsFragment
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
