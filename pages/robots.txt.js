import { getSiteUrl } from 'utilities';

function buildRobotsTxt(siteUrl) {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /preview',
    'Disallow: /search',
  ];

  if (siteUrl) {
    lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
  }

  return `${lines.join('\n')}\n`;
}

export async function getServerSideProps({ res }) {
  const siteUrl = getSiteUrl();

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write(buildRobotsTxt(siteUrl));
  res.end();

  return {
    props: {},
  };
}

export default function RobotsTxt() {
  return null;
}
