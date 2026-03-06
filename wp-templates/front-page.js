import * as MENUS from 'constants/menus';

import { useQuery, gql } from '@apollo/client';
import {
  FaClipboardList,
  FaUserFriends,
  FaUsers,
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from 'styles/pages/_Home.module.scss';
import {
  EntryHeader,
  Main,
  Button,
  Heading,
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

function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function truncate(value = '', max = 220) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

export default function Component() {
  const { data, loading } = useQuery(Component.query, {
    variables: Component.variables(),
  });
  const highlightedProgram = useMemo(() => {
    const nodes = data?.programs?.nodes ?? [];
    const eligible = nodes.filter((node) => {
      const title = (node?.title ?? '').toLowerCase();
      return title && !title.includes('suspended');
    });
    if (!eligible.length) return null;

    // Deterministic daily rotation to avoid hydration mismatch.
    const dayKey = new Date().toISOString().slice(0, 10);
    const seed = dayKey.split('-').join('').split('').reduce((acc, n) => acc + Number(n), 0);
    return eligible[seed % eligible.length];
  }, [data?.programs?.nodes]);

  if (loading) {
    return null;
  }

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const footerNavOne = data?.footerSecondaryMenuItems?.nodes ?? [];
  const footerNavTwo = data?.footerTertiaryMenuItems?.nodes ?? [];
  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />

      <Main className={styles.home}>
        <EntryHeader videoSrc="/static/GraduateEd_WebLoop.mp4" />
        <section className={styles.graduateIntroBand}>
          <div className={`container ${styles.graduateIntroWrap}`}>
            <article className={styles.graduateIntroCard}>
              <Heading className={styles.graduateIntroTitle} level="h1">
                Graduate Education
              </Heading>
              <p className={styles.graduateIntroSubTitle}>
                Welcome to Cal Poly Graduate Education
              </p>
              <div className={styles.graduateIntroRule} />
              <p className={styles.graduateIntroText}>
                We support students to achieve excellence in both
                practice-oriented and research-based professional graduate
                programs that develop the advanced knowledge and leadership
                skills necessary to contribute to and prosper in an increasingly
                competitive global context. We work to inspire students to
                innovate and excel in their educational and professional career
                objectives.
              </p>
              <p className={styles.graduateIntroText}>
                Cal Poly Graduate Education strives to create an inclusive and
                welcoming environment that values, respects, and empowers all of
                our graduate students, faculty, and staff. We commit to our
                collective and individual responsibility to create communities
                that are just, equitable, and promote human dignity. It is
                through embracing and celebrating our diverse communities,
                backgrounds, and goals that we can build a campus, region,
                California, and world where everyone can thrive.
              </p>
            </article>
          </div>
        </section>
        <section className={styles.prospectiveStudents}>
          <div className={`container ${styles.prospectiveStudentsInner}`}>
            <div className={styles.prospectiveStudentsContent}>
              <Heading className={styles.prospectiveStudentsTitle} level="h2">
                Prospective Graduate Students
              </Heading>
              <Link href="/programs" className={styles.prospectiveStudentsLink}>
                Learn about our graduate programs, application process and more
              </Link>
            </div>
            <div className={styles.prospectiveStudentsImage}>
              <Image
                src="/home/prospective-students.jpg"
                alt="Prospective graduate students talking on campus"
                width={1100}
                height={760}
              />
            </div>
          </div>
        </section>

        <section className={styles.requestInfo}>
          <div className={`container ${styles.requestInfoInner}`}>
            <div className={styles.requestInfoImage}>
              <Image
                src="/home/request-information.jpg"
                alt="Student requesting program information"
                width={1100}
                height={760}
              />
            </div>
            <div className={styles.requestInfoContent}>
              <Heading className={styles.requestInfoTitle} level="h2">
                Request Information
              </Heading>
              <ul className={styles.requestInfoLinks}>
                <li>
                  <Link href="/request-information">Fill Out a Request Form</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact Us</Link>
                </li>
                <li>
                  <Link href="/faqs">FAQs</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {highlightedProgram && (
          <section className={styles.highlightedProgram}>
            <div className={`container ${styles.highlightedProgramInner}`}>
              <div className={styles.highlightedProgramImage}>
                {highlightedProgram?.featuredImage?.node?.sourceUrl ? (
                  <Image
                    src={highlightedProgram.featuredImage.node.sourceUrl}
                    alt={highlightedProgram?.featuredImage?.node?.altText || highlightedProgram.title}
                    width={980}
                    height={620}
                  />
                ) : (
                  <Image
                    src="/home/current-students.jpg"
                    alt={highlightedProgram.title}
                    width={980}
                    height={620}
                  />
                )}
              </div>
              <div className={styles.highlightedProgramContent}>
                <Heading className={styles.highlightedProgramEyebrow} level="h2">
                  Highlighted Program
                </Heading>
                <h3 className={styles.highlightedProgramTitle}>
                  {highlightedProgram.title}
                </h3>
                <p className={styles.highlightedProgramBlurb}>
                  {truncate(
                    decodeHtmlEntities(stripHtml(highlightedProgram?.content || '')),
                    240
                  )}
                </p>
                {highlightedProgram?.uri && (
                  <Link
                    href={highlightedProgram.uri}
                    className={styles.highlightedProgramLink}
                  >
                    Learn More
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}
        <section className={styles.importantDates}>
          <div className={`container ${styles.importantDatesInner}`}>
            <Heading className={styles.importantDatesTitle} level="h2">
              Important Dates, Deadlines and Events
            </Heading>
            <p className={styles.importantDatesSubTitle}>
              Orfalea College of Business Events
            </p>
            <Link href="/events" className={styles.importantDatesLink}>
              View OCOB Info Session Schedule
            </Link>
          </div>
        </section>

        <section className={styles.graduateRecognition}>
          <div className={`container ${styles.graduateRecognitionInner}`}>
            <div className={styles.graduateRecognitionImage}>
              <Image
                src="/home/grad-recognition.jpg"
                alt="Graduates celebrating recognition"
                width={1100}
                height={760}
              />
            </div>
            <div className={styles.graduateRecognitionContent}>
              <Heading className={styles.graduateRecognitionTitle} level="h2">
                Graduate Recognition
              </Heading>
              <p className={styles.graduateRecognitionDescription}>
                Graduate Education acknowledges and congratulates our award
                winning graduate students, outstanding graduates, their
                achievements and academic excellence.
              </p>
              <Link
                href="/graduate-recognition"
                className={styles.graduateRecognitionLink}
              >
                Graduate Recognition
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.degreeProgramsCta}>
          <div className={`container ${styles.degreeProgramsInner}`}>
            <Heading className={styles.degreeProgramsTitle} level="h2">
              All Graduate Degree Programs
            </Heading>
            <div className={styles.degreeProgramsActions}>
              <Button href="/programs" className={styles.degreeProgramsButton}>
                View Degree Programs
              </Button>
              <Button
                href="https://www.calpoly.edu/admissions/graduate-student/how-to-apply"
                className={styles.degreeProgramsButton}
              >
                How to Apply
              </Button>
            </div>
          </div>
        </section>
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
                src="/home/current-students.jpg"
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
    programs(first: 200) {
      nodes {
        ...ProgramsFragment
        uri
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
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
