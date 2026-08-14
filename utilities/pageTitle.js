/**
 * Returns a title for the current page using a standard "Page | Site Name" format
 * @param {GeneralSettings} generalSettings The general settings node.
 * @param {string} titleOverride An optional title for the current page.
 * @param {string} siteNameOverride An optional site name override.
 * @returns {string} The page title.
 */
function pageTitle(generalSettings, titleOverride = null, siteNameOverride = null) {
  const siteName =
    siteNameOverride ||
    generalSettings?.title ||
    'Cal Poly Graduate Education';
  const title = titleOverride || siteName;

  if (!title) {
    return '';
  }

  if (title === siteName) {
    return title;
  }

  const normalizedTitle = title.trim();
  const normalizedSiteName = siteName.trim();

  if (
    normalizedTitle.toLowerCase() === normalizedSiteName.toLowerCase() ||
    normalizedTitle.toLowerCase().endsWith(`| ${normalizedSiteName.toLowerCase()}`) ||
    normalizedTitle.toLowerCase().endsWith(`- ${normalizedSiteName.toLowerCase()}`) ||
    normalizedTitle.toLowerCase().includes(`${normalizedSiteName.toLowerCase()} |`) ||
    normalizedTitle.toLowerCase().includes(`${normalizedSiteName.toLowerCase()} -`)
  ) {
    return normalizedTitle;
  }

  return `${normalizedTitle} | ${normalizedSiteName}`;
}

export default pageTitle;
