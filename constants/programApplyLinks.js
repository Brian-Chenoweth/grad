/**
 * Default apply URL used by nearly all programs.
 */
export const DEFAULT_PROGRAM_APPLY_LINK = 'https://www2.calstate.edu/apply';

/**
 * Program-specific one-off overrides keyed by Program URI.
 * Example key format: '/programs/ms-taxation/'
 */
export const PROGRAM_APPLY_LINK_OVERRIDES = {
  // '/program/example-program/': 'https://www.calpoly.edu/apply-example',
  '/program/business-analytics': 'https://calstate2026.cas.myliaison.com/applicant-ux/#/login',
  '/program/quantitative-economics': 'https://calstate2026.cas.myliaison.com/applicant-ux/#/login',
};

function normalizeProgramUri(value) {
  if (!value) return '';

  const raw = String(value).trim().toLowerCase();
  const withoutDomain = raw.replace(/^https?:\/\/[^/]+/i, '');
  const withoutQueryOrHash = withoutDomain.split('#')[0].split('?')[0];
  const ensuredLeadingSlash = withoutQueryOrHash.startsWith('/')
    ? withoutQueryOrHash
    : `/${withoutQueryOrHash}`;
  const collapsedSlashes = ensuredLeadingSlash.replace(/\/{2,}/g, '/');

  return collapsedSlashes.replace(/\/+$/, '');
}

export function getProgramApplyLink(program) {
  const normalizedUri = normalizeProgramUri(program?.uri);
  if (normalizedUri) {
    const overrides = Object.fromEntries(
      Object.entries(PROGRAM_APPLY_LINK_OVERRIDES).map(([key, value]) => [
        normalizeProgramUri(key),
        value,
      ])
    );

    if (overrides[normalizedUri]) {
      return overrides[normalizedUri];
    }
  }

  return DEFAULT_PROGRAM_APPLY_LINK;
}
