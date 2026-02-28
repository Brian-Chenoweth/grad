/**
 * Shared application links by Program college.
 * Add/update keys to match the exact `programFields.college` value in WP.
 */
export const PROGRAM_APPLY_LINKS = {
  'School of Education': 'https://www.calpoly.edu/apply-now',
  'Orfalea College of Business': 'https://www.calpoly.edu/apply-now',
  'College of Engineering': 'https://www.calpoly.edu/apply-now',
  'College of Liberal Arts': 'https://www.calpoly.edu/apply-now',
  'College of Science and Mathematics': 'https://www.calpoly.edu/apply-now',
  'College of Agriculture, Food and Environmental Sciences':
    'https://www.calpoly.edu/apply-now',
  'College of Architecture and Environmental Design':
    'https://www.calpoly.edu/apply-now',
};

export function getProgramApplyLink(college) {
  if (!college) return undefined;
  return PROGRAM_APPLY_LINKS[college];
}
