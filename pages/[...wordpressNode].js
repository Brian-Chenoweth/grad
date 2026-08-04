import { getWordPressProps, WordPressTemplate } from '@faustwp/core';

const BLOCKED_EXACT_SEGMENTS = new Set([
  'wp-admin',
  'wp-login.php',
  'xmlrpc.php',
  'cgi-bin',
  'phpmyadmin',
  'vendor',
  '_session',
  'cdgserver3',
  'systemconfig',
]);

const BLOCKED_FILE_EXTENSIONS = [
  '.php',
  '.asp',
  '.aspx',
  '.cgi',
  '.env',
  '.ini',
  '.sql',
  '.bak',
  '.zip',
  '.tar',
  '.gz',
];

function shouldShortCircuitPath(ctx) {
  const segments = Array.isArray(ctx?.params?.wordpressNode)
    ? ctx.params.wordpressNode
    : [];

  if (segments.length > 8) {
    return true;
  }

  return segments.some((segment) => {
    const value = String(segment || '').trim();
    const normalized = value.toLowerCase();

    if (!value) {
      return false;
    }

    if (value.length > 120) {
      return true;
    }

    // Hidden files and obvious probing patterns should never map to WP pages.
    if (/^[._]/.test(value) || /[%\\]/.test(value)) {
      return true;
    }

    if (BLOCKED_EXACT_SEGMENTS.has(normalized)) {
      return true;
    }

    return BLOCKED_FILE_EXTENSIONS.some((ext) => normalized.endsWith(ext));
  });
}

export default function Page(props) {
  return <WordPressTemplate {...props} />;
}

export function getStaticProps(ctx) {
  if (shouldShortCircuitPath(ctx)) {
    return { notFound: true };
  }

  return getWordPressProps({ ctx });
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
