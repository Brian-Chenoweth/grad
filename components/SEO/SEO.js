import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * SEO component for Faust/Next.js
 *
 * Props:
 * - title?: string
 * - description?: string
 * - imageUrl?: string (absolute or relative)
 * - url?: string (absolute canonical URL; else auto-built from NEXT_PUBLIC_SITE_URL + asPath)
 * - noindex?: boolean (default false)
 * - type?: 'website' | 'article' | string (default 'website')
 * - siteName?: string (default 'Graduate Education')
 * - twitterHandle?: string (default '@CalPolyPartners')
 * - themeColor?: string (default brand green)
 * - locale?: string (default 'en_US')
 * - schema?: object (extra JSON-LD to merge/override)
 * - article?: {
 *     publishedTime?: string (ISO)
 *     modifiedTime?: string (ISO)
 *     authors?: string[] (absolute profile URLs or names)
 *     section?: string
 *     tags?: string[]
 *   }
 */

const DEFAULTS = {
  siteName: 'Graduate Education',
  twitterHandle: '@CalPolyPartners',
  themeColor: '#003831',
  locale: 'en_US',
  type: 'website',
  defaultTitle: 'Graduate Education',
  defaultDescription: 'Official site for Graduate Education.',
  defaultImage: '/images/og-default.jpg',
};

function toAbsoluteUrl(urlOrPath, base) {
  if (!urlOrPath) return undefined;
  try {
    return new URL(urlOrPath, base).toString();
  } catch {
    return urlOrPath; // fall back
  }
}

export default function SEO({
  title,
  description,
  imageUrl,
  url,
  noindex = false,
  type = DEFAULTS.type,
  siteName = DEFAULTS.siteName,
  twitterHandle = DEFAULTS.twitterHandle,
  themeColor = DEFAULTS.themeColor,
  locale = DEFAULTS.locale,
  schema,
  article,
}) {
  const router = useRouter();

  const baseUrl =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_URL : undefined;

  const canonical =
    url ||
    (baseUrl && router?.asPath ? toAbsoluteUrl(router.asPath, baseUrl) : undefined);

  const resolvedTitle = title || DEFAULTS.defaultTitle;
  const resolvedDescription = description || DEFAULTS.defaultDescription;
  const resolvedImageAbs = toAbsoluteUrl(
    imageUrl || DEFAULTS.defaultImage,
    baseUrl
  );

  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  // Base Organization schema (safe default)
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: baseUrl || canonical,
    logo: toAbsoluteUrl('/images/logo.png', baseUrl),
  };

  // Optional WebSite schema for Sitelinks Search
  const webSiteSchema = baseUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: baseUrl,
        name: siteName,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?s={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
    : null;

  // Optional Article schema when type is article or article props exist
  const articleSchema =
    type === 'article' || article
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: resolvedTitle,
          description: resolvedDescription,
          mainEntityOfPage: canonical,
          image: resolvedImageAbs ? [resolvedImageAbs] : undefined,
          datePublished: article?.publishedTime,
          dateModified: article?.modifiedTime || article?.publishedTime,
          articleSection: article?.section,
          author:
            article?.authors?.length
              ? article.authors.map((a) => (typeof a === 'string' ? { '@type': 'Person', name: a } : a))
              : undefined,
          keywords: article?.tags?.join(', '),
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: toAbsoluteUrl('/images/logo.png', baseUrl),
            },
          },
        }
      : null;

  // Merge in any custom schema (last wins)
  const jsonLd = [orgSchema, webSiteSchema, articleSchema, schema]
    .filter(Boolean)
    .map((obj) => JSON.stringify(obj));

  return (
    <>
      <Head>
        {/* Fonts & Icons (kept from your original; consider moving to _document.tsx for perf) */}
        <link rel="stylesheet" href="https://use.typekit.net/umi1lem.css" />
        <link rel="stylesheet" href="https://use.typekit.net/mfv5sni.css" />
        <link rel="stylesheet" href="https://use.typekit.net/qnm1phw.css" />
        <link rel="stylesheet" href="https://use.typekit.net/ato6pec.css" />
        <link rel="stylesheet" href="https://use.typekit.net/qbn5svr.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          rel="stylesheet"
        />

        {/* Core HTML/meta */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {themeColor && <meta name="theme-color" content={themeColor} />}
        <meta name="robots" content={robots} />

        {/* Titles */}
        {resolvedTitle && (
          <>
            <title>{resolvedTitle}</title>
            <meta name="title" content={resolvedTitle} />
            <meta property="og:title" content={resolvedTitle} />
            <meta property="twitter:title" content={resolvedTitle} />
          </>
        )}

        {/* Descriptions */}
        {resolvedDescription && (
          <>
            <meta name="description" content={resolvedDescription} />
            <meta property="og:description" content={resolvedDescription} />
            <meta property="twitter:description" content={resolvedDescription} />
          </>
        )}

        {/* Canonical */}
        {canonical && <link rel="canonical" href={canonical} />}

        {/* Open Graph */}
        <meta property="og:type" content={type || 'website'} />
        {siteName && <meta property="og:site_name" content={siteName} />}
        {locale && <meta property="og:locale" content={locale} />}
        {canonical && <meta property="og:url" content={canonical} />}
        {resolvedImageAbs && (
          <>
            <meta property="og:image" content={resolvedImageAbs} />
            <meta property="og:image:alt" content={resolvedTitle} />
          </>
        )}
        {article?.modifiedTime && (
          <meta property="og:updated_time" content={article.modifiedTime} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        {twitterHandle && (
          <meta name="twitter:site" content={twitterHandle} />
        )}
        {canonical && <meta name="twitter:url" content={canonical} />}
        {resolvedImageAbs && (
          <meta name="twitter:image" content={resolvedImageAbs} />
        )}

        {/* Article-specific meta for OG (optional) */}
        {(type === 'article' || article) && (
          <>
            {article?.publishedTime && (
              <meta
                property="article:published_time"
                content={article.publishedTime}
              />
            )}
            {article?.modifiedTime && (
              <meta
                property="article:modified_time"
                content={article.modifiedTime}
              />
            )}
            {article?.section && (
              <meta property="article:section" content={article.section} />
            )}
            {article?.tags?.map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* JSON-LD */}
        {jsonLd.map((block, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: block }}
          />
        ))}
      </Head>
    </>
  );
}
