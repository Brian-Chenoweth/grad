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
import {
  buildKeywordString,
  buildMetaDescription,
  formatProgramDisplayTitle,
  pageTitle,
} from 'utilities';
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

function formatCollegeDisplay(value = '') {
  const normalized = toTitleCase(cleanFieldValue(value));

  return normalized.replace(/\(([^)]+)\)\s*$/, (_, suffix) => {
    return `(${suffix.trim().toUpperCase()})`;
  });
}

function getProgramTypeDetails(value = '') {
  const normalized = toTitleCase(cleanFieldValue(value));
  const compact = normalized.toLowerCase();

  if (!compact) {
    return {
      filterValue: '',
      displayValue: '',
    };
  }

  if (compact.includes('blended')) {
    return {
      filterValue: 'Blended Graduate',
      displayValue: 'Graduate Program with Blended Format',
    };
  }

  if (compact.includes('graduate')) {
    return {
      filterValue: 'Graduate',
      displayValue: 'Graduate Program',
    };
  }

  return {
    filterValue: normalized,
    displayValue: normalized,
  };
}

function matchesProgramTypeFilter(programType, selectedFilter) {
  if (selectedFilter === 'all') return true;

  // Blended Graduate is a subset of Graduate programs.
  if (selectedFilter === 'Graduate') {
    return (
      programType === 'Graduate' ||
      programType === 'Blended Graduate'
    );
  }

  return programType === selectedFilter;
}

function getProgramTypeFilterLabel(programType) {
  if (programType === 'Graduate') {
    return 'Graduate (includes Blended Graduate)';
  }

  return programType;
}

function sortProgramTypeOptions(a, b) {
  const aIsCertificate = String(a).toLowerCase() === 'certificate';
  const bIsCertificate = String(b).toLowerCase() === 'certificate';

  if (aIsCertificate && !bIsCertificate) return 1;
  if (!aIsCertificate && bIsCertificate) return -1;

  return a.localeCompare(b);
}

function buildProgramSearchText(program) {
  const displayTitle = formatProgramDisplayTitle(
    program?.title,
    program?.programFields?.specialization,
    program?.programFields?.specializationIn
  );

  return [
    displayTitle,
    program?.content,
    program?.programFields?.college,
    program?.programFields?.programType,
    program?.programFields?.contactName,
    program?.programFields?.contactPhone,
    program?.programFields?.contactEmail,
    program?.programFields?.contactWeb,
  ]
    .map((value) => cleanFieldValue(value))
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getProgramDisplayTitle(program) {
  return formatProgramDisplayTitle(
    program?.title,
    program?.programFields?.specialization,
    program?.programFields?.specializationIn
  );
}

function buildSectionsForPrograms(programsForSection) {
  const specializationMarker = ', Specialization in ';
  const sortLabel = (program) => getProgramDisplayTitle(program);

  const sortedPrograms = [...programsForSection].sort((a, b) =>
    sortLabel(a).localeCompare(sortLabel(b), undefined, {
      sensitivity: 'base',
    })
  );

  const specializationHeadings = new Set(
    sortedPrograms
      .map((program) => {
        const displayTitle = sortLabel(program);
        const markerIndex = displayTitle.indexOf(specializationMarker);
        if (markerIndex < 0) return '';
        return displayTitle.slice(0, markerIndex).trim();
      })
      .filter(Boolean)
  );

  const headingProgramsMap = new Map();
  const orderedTokens = [];
  const pushedHeadingTokens = new Set();

  sortedPrograms.forEach((program) => {
    const displayTitle = sortLabel(program);
    const markerIndex = displayTitle.indexOf(specializationMarker);
    const specializationParent =
      markerIndex > -1 ? displayTitle.slice(0, markerIndex).trim() : '';
    const programTitle = cleanFieldValue(program?.title);

    const headingForProgram = specializationParent
      ? specializationParent
      : specializationHeadings.has(programTitle)
        ? programTitle
        : '';

    if (headingForProgram) {
      if (!headingProgramsMap.has(headingForProgram)) {
        headingProgramsMap.set(headingForProgram, []);
      }
      headingProgramsMap.get(headingForProgram).push(program);

      if (!pushedHeadingTokens.has(headingForProgram)) {
        pushedHeadingTokens.add(headingForProgram);
        orderedTokens.push({ type: 'specialization', heading: headingForProgram });
      }
      return;
    }

    orderedTokens.push({ type: 'regular', program });
  });

  const sections = [];
  let regularBuffer = [];

  orderedTokens.forEach((token) => {
    if (token.type === 'regular') {
      regularBuffer.push(token.program);
      return;
    }

    if (regularBuffer.length > 0) {
      sections.push({ type: 'regular', heading: '', programs: regularBuffer });
      regularBuffer = [];
    }

    sections.push({
      type: 'specialization',
      heading: token.heading,
      programs: headingProgramsMap.get(token.heading) ?? [],
    });
  });

  if (regularBuffer.length > 0) {
    sections.push({ type: 'regular', heading: '', programs: regularBuffer });
  }

  return sections;
}

export default function ProgramsArchive(props) {
  const { uri = '/programs/' } = props?.data?.nodeByUri ?? {};
  const { data, loading } = useQuery(ProgramsArchive.query, {
    variables: ProgramsArchive.variables({ uri }),
  });

  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [programTypeFilter, setProgramTypeFilter] = useState('all');
  const [isCompactView, setIsCompactView] = useState(false);

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
        .map((value) => formatCollegeDisplay(value))
        .filter(Boolean)
    );
    return Array.from(uniques).sort((a, b) => a.localeCompare(b));
  }, [programs]);

  const programTypeOptions = useMemo(() => {
    const uniques = new Set(
      programs
        .map((program) =>
          getProgramTypeDetails(program?.programFields?.programType).filterValue
        )
        .filter(Boolean)
    );
    return Array.from(uniques).sort(sortProgramTypeOptions);
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return programs.filter((program) => {
      const collegeRaw = cleanFieldValue(program?.programFields?.college);
      const college = formatCollegeDisplay(collegeRaw);
      const searchableProgramText = buildProgramSearchText(program);
      const programType = getProgramTypeDetails(
        program?.programFields?.programType
      ).filterValue;

      const matchesSearch =
        !normalizedSearch || searchableProgramText.includes(normalizedSearch);
      const matchesCollege =
        collegeFilter === 'all' || college === collegeFilter;
      const matchesProgramType = matchesProgramTypeFilter(
        programType,
        programTypeFilter
      );

      return matchesSearch && matchesCollege && matchesProgramType;
    });
  }, [programs, search, collegeFilter, programTypeFilter]);

  const groupedCollegeSections = useMemo(() => {
    const collegeMap = new Map();

    filteredPrograms.forEach((program) => {
      const collegeName =
        formatCollegeDisplay(program?.programFields?.college) ||
        'Other Programs';

      if (!collegeMap.has(collegeName)) {
        collegeMap.set(collegeName, []);
      }

      collegeMap.get(collegeName).push(program);
    });

    return Array.from(collegeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([college, collegePrograms]) => ({
        college,
        sections: buildSectionsForPrograms(collegePrograms),
      }));
  }, [filteredPrograms]);

  if (loading) {
    return null;
  }

  const programText = programs
    .map((program) =>
      [
        formatProgramDisplayTitle(
          program?.title,
          program?.programFields?.specialization,
          program?.programFields?.specializationIn
        ),
        formatCollegeDisplay(program?.programFields?.college),
        getProgramTypeDetails(program?.programFields?.programType).displayValue,
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

  const renderProgramCard = (program, options = {}) => {
    const { titleOverride = '', keyPrefix = '' } = options;
    const displayTitle = titleOverride || getProgramDisplayTitle(program);
    const college = formatCollegeDisplay(program?.programFields?.college);
    const programType = getProgramTypeDetails(
      program?.programFields?.programType
    ).displayValue;
    const instructors = cleanFieldValue(program?.programFields?.contactName);
    const instructorCount = instructors ? instructors.split(',').length : 0;

    return (
      <li
        key={`${keyPrefix}${program?.id}`}
        className={`${styles.programCard} ${
          isCompactView ? styles.programCardCompact : ''
        }`}
      >
        {isCompactView ? (
          program?.uri ? (
            <a href={program.uri} className={styles.programCardCompactLink}>
              <h3 className={styles.programTitleCompact}>{displayTitle}</h3>
            </a>
          ) : (
            <h3 className={styles.programTitleCompact}>{displayTitle}</h3>
          )
        ) : (
          <>
            <h3 className={styles.programTitle}>{displayTitle}</h3>
            {college && (
              <p className={styles.programMeta}>
                <strong>College:</strong> {college}
              </p>
            )}
            {programType && (
              <p className={styles.programMeta}>
                <strong>Program Format:</strong> {programType}
              </p>
            )}
            {instructors && (
              <p className={styles.programMeta}>
                <strong>{instructorCount > 1 ? 'Instructors' : 'Instructor'}:</strong> {instructors}
              </p>
            )}
            {program?.uri && (
              <Button href={program.uri} className={styles.viewButton}>
                View Program
              </Button>
            )}
          </>
        )}
      </li>
    );
  };

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
                  <span>Search Programs</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Program name, college, instructor, contact, or keyword"
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
                  <span>Program Format</span>
                  <select
                    value={programTypeFilter}
                    onChange={(event) => setProgramTypeFilter(event.target.value)}
                  >
                    <option value="all">All program formats</option>
                    {programTypeOptions.map((programType) => (
                      <option key={programType} value={programType}>
                        {getProgramTypeFilterLabel(programType)}
                      </option>
                    ))}
                  </select>
                </label>
                <p className={styles.filterHint}>
                  Selecting Graduate includes Blended Graduate programs.
                </p>
              </div>
              <div className={styles.resultRow}>
                <p className={styles.resultCount}>
                  Showing {filteredPrograms.length} of {programs.length} programs
                </p>
                <button
                  type="button"
                  className={styles.viewToggle}
                  onClick={() => setIsCompactView((current) => !current)}
                >
                  {isCompactView ? 'Full view' : 'Compact view'}
                </button>
              </div>
            </section>

            <section className={styles.listSection}>
              {filteredPrograms.length === 0 && (
                <p className={styles.noResults}>
                  No programs matched your search or filters.
                </p>
              )}
              {groupedCollegeSections.map((collegeGroup) => (
                <section key={collegeGroup.college} className={styles.collegeGroup}>
                  <h2 className={styles.collegeHeading}>{collegeGroup.college}</h2>
                  <ul
                    className={`${styles.programList} ${
                      isCompactView ? styles.programListCompact : ''
                    }`}
                  >
                    {collegeGroup.sections
                      .flatMap((section) => section.programs)
                      .map((program) =>
                        renderProgramCard(program, {
                          keyPrefix: `${collegeGroup.college}-`,
                        })
                      )}
                  </ul>
                </section>
              ))}
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
        content
        programFields {
          college
          programType
          specialization
          specializationIn
          contactName
          contactPhone
          contactEmail
          contactWeb
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
