import Link from 'next/link';
import { LoadingSearchResult } from 'components';
import { FaSearch } from 'react-icons/fa';

import styles from './SearchResults.module.scss';

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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
    .replace(/&gt;/g, '>');
}

function buildSnippet(node) {
  const excerptText = decodeHtmlEntities(stripHtml(node?.excerpt ?? ''));
  const contentText = decodeHtmlEntities(stripHtml(node?.content ?? ''));
  const fallback =
    excerptText || contentText || decodeHtmlEntities(stripHtml(node?.title ?? ''));
  if (!fallback) return '';
  return fallback.length > 220 ? `${fallback.slice(0, 220).trim()}...` : fallback;
}

/**
 * Renders the search results list.
 *
 * @param {Props} props The props object.
 * @param {object[]} props.searchResults The search results list.
 * @param {boolean} props.isLoading Whether the search results are loading.
 * @returns {React.ReactElement} The SearchResults component.
 */
export default function SearchResults({ searchResults, isLoading }) {
  if (!isLoading && searchResults === undefined) {
    return null;
  }

  if (!isLoading && !searchResults?.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    );
  }

  return (
    <>
      {searchResults?.map((node) => (
        <div key={node.databaseId} className={styles.result}>
          <Link href={node.uri}>
            <h2 className={styles.title}>{node.title}</h2>
          </Link>

          <p className={styles.excerpt}>{buildSnippet(node)}</p>
        </div>
      ))}

      {isLoading === true && (
        <>
          <LoadingSearchResult />
          <LoadingSearchResult />
          <LoadingSearchResult />
        </>
      )}
    </>
  );
}
