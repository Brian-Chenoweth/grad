import * as MENUS from 'constants/menus';

import { gql, useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import {
  Header,
  Footer,
  Main,
  EntryHeader,
  NavigationMenu,
  SEO,
  Button,
} from 'components';
import { buildKeywordString, buildMetaDescription, pageTitle } from 'utilities';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import styles from 'styles/pages/_ProgramsArchive.module.scss';

const EMPTY_PROGRAMS = [];

function toTitleCase(value) {
  if (!value) return '';
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

function cleanFieldValue(value = '') {
  const normalized = String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .trim();

  if (!normalized) return '';
  if (/^(null|undefined|n\/a|na)$/i.test(normalized)) return '';
  if (/^[:;,-]+$/.test(normalized)) return '';

  return normalized;
}

export default function ProgramsArchive(props) {
  const { uri = '/programs/' } = props?.data?.nodeByUri ?? {};
  const { data, loading } = useQuery(ProgramsArchive.query, {
    variables: ProgramsArchive.variables({ uri }),
  });

  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [programTypeFilter, setProgramTypeFilter] = useState('all');

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const footerNavOne = data?.footerSecondaryMenuItems?.nodes ?? [];
  const footerNavTwo = data?.footerTertiaryMenuItems?.nodes ?? [];
  const archiveLabel =
    data?.nodeByUri?.title ?? data?.nodeByUri?.label ?? 'Programs';
  const programs = useMemo(() => {
    const nodes = data?.programs?.nodes ?? EMPTY_PROGRAMS;
    return [...nodes].sort((a, b) =>
      (a?.title ?? '').localeCompare(b?.title ?? '', undefined, {
        sensitivity: 'base',
      })
    );
  }, [data?.programs?.nodes]);

  const collegeOptions = useMemo(() => {
    const uniques = new Set(
      programs
        .map((program) => program?.programFields?.college)
        .filter(Boolean)
        .map((value) => toTitleCase(cleanFieldValue(value)))
        .filter(Boolean)
    );
    return Array.from(uniques).sort((a, b) => a.localeCompare(b));
  }, [programs]);

  const programTypeOptions = useMemo(() => {
    const uniques = new Set(
      programs
        .map((program) => program?.programFields?.programType)
        .filter(Boolean)
        .map((value) => toTitleCase(cleanFieldValue(value)))
        .filter(Boolean)
    );
    return Array.from(uniques).sort((a, b) => a.localeCompare(b));
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return programs.filter((program) => {
      const title = program?.title ?? '';
      const collegeRaw = cleanFieldValue(program?.programFields?.college);
      const college = toTitleCase(collegeRaw);
      const programType = toTitleCase(
        cleanFieldValue(program?.programFields?.programType)
      );

      const matchesSearch =
        !normalizedSearch ||
        title.toLowerCase().includes(normalizedSearch) ||
        college.toLowerCase().includes(normalizedSearch);
      const matchesCollege =
        collegeFilter === 'all' || college === collegeFilter;
      const matchesProgramType =
        programTypeFilter === 'all' || programType === programTypeFilter;

      return matchesSearch && matchesCollege && matchesProgramType;
    });
  }, [programs, search, collegeFilter, programTypeFilter]);

  if (loading) {
    return null;
  }

  const programText = programs
    .map((program) =>
      [
        program?.title,
        toTitleCase(cleanFieldValue(program?.programFields?.college)),
        toTitleCase(cleanFieldValue(program?.programFields?.programType)),
      ]
        .filter(Boolean)
        .join(' ')
    )
    .join(' ');
  const description = buildMetaDescription({
    title: archiveLabel,
    content: `${archiveLabel} ${programText}`,
    fallback:
      siteDescription ||
      'Explore Cal Poly graduate programs by college and program type.',
  });
  const keywords = buildKeywordString({
    title: archiveLabel,
    content: `${description} ${programText}`,
    seedKeywords: ['graduate programs', 'graduate education', 'cal poly'],
  });

  return (
    <>
      <SEO
        title={pageTitle(
          data?.generalSettings,
          archiveLabel,
          data?.generalSettings?.title
        )}
        description={description}
        keywords={keywords}
        schemaType="CollectionPage"
      />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <>
          <EntryHeader title={archiveLabel} />
          <div className={`container ${styles.archiveContainer}`}>
            {/* <h1 className={styles.pageTitle}>Programs</h1> */}
            <section className={styles.filters}>
              <h2 className={styles.filtersTitle}>Find a Program</h2>
              <div className={styles.filterGrid}>
                <label className={styles.filterField}>
                  <span>Search</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Program name or college"
                  />
                </label>
                <label className={styles.filterField}>
                  <span>College</span>
                  <select
                    value={collegeFilter}
                    onChange={(event) => setCollegeFilter(event.target.value)}
                  >
                    <option value="all">All colleges</option>
                    {collegeOptions.map((college) => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.filterField}>
                  <span>Program Type</span>
                  <select
                    value={programTypeFilter}
                    onChange={(event) => setProgramTypeFilter(event.target.value)}
                  >
                    <option value="all">All program types</option>
                    {programTypeOptions.map((programType) => (
                      <option key={programType} value={programType}>
                        {programType}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className={styles.resultCount}>
                Showing {filteredPrograms.length} of {programs.length} programs
              </p>
            </section>

            <section className={styles.listSection}>
              {filteredPrograms.length === 0 && (
                <p className={styles.noResults}>
                  No programs matched your filters.
                </p>
              )}
              <ul className={styles.programList}>
                {filteredPrograms.map((program) => {
                  const college = toTitleCase(
                    cleanFieldValue(program?.programFields?.college)
                  );
                  const programType = toTitleCase(
                    cleanFieldValue(program?.programFields?.programType)
                  );
                  return (
                    <li key={program?.id} className={styles.programCard}>
                      <h3 className={styles.programTitle}>{program?.title}</h3>
                      {college && (
                        <p className={styles.programMeta}>{college}</p>
                      )}
                      {programType && (
                        <p className={styles.programMeta}>
                          Program Type: {programType}
                        </p>
                      )}
                      {program?.uri && (
                        <Button href={program.uri} className={styles.viewButton}>
                          View Program
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
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

ProgramsArchive.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetProgramsArchive(
    $uri: String!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $footerSecondaryLocation: MenuLocationEnum
    $footerTertiaryLocation: MenuLocationEnum
  ) {
    nodeByUri(uri: $uri) {
      __typename
      ... on NodeWithTitle {
        title
      }
      ... on ContentType {
        id
        uri
        name
        label
      }
    }
    programs(first: 500) {
      nodes {
        id
        uri
        title
        programFields {
          college
          programType
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

ProgramsArchive.variables = ({ uri }) => {
  return {
    uri,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    footerSecondaryLocation: MENUS.FOOTER_SECONDARY_LOCATION,
    footerTertiaryLocation: MENUS.FOOTER_TERTIARY_LOCATION,
  };
};
