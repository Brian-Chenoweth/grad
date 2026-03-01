// EntryHeader.jsx
import className from 'classnames/bind';
import Link from 'next/link';
import { FeaturedImage, Heading } from 'components';
import { useRouter } from 'next/router';

import styles from './EntryHeader.module.scss';

const cx = className.bind(styles);

export default function EntryHeader({
  title,
  image,
  date,
  author,
  className,
  videoSrc,
}) {
  const { asPath } = useRouter();
  const hasText = title || date || author;
  const hasVisualHeader = Boolean(image || videoSrc);
  const pathParts = asPath
    ?.split('?')[0]
    ?.split('#')[0]
    ?.split('/')
    .filter(Boolean) ?? [];

  const breadcrumbs = pathParts.map((part, index) => {
    let href = `/${pathParts.slice(0, index + 1).join('/')}/`;
    if (part.toLowerCase() === 'program') {
      href = '/programs/';
    }
    const label = decodeURIComponent(part)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
    return { href, label };
  });

  return (
    <div className={cx(['entry-header', className])}>
      {hasVisualHeader && (
        <div className={cx('image')}>
          {videoSrc && (
            <video
              className={cx('video')}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}

            <div className={cx('overlay')}>
              <div className="container">

                {hasText && (
                  <>
                    {!!title && <Heading className={cx('heading-home')}>{title}</Heading>}
                  </>
                )}

              </div>
            </div>



          {!videoSrc && (
            <FeaturedImage className={cx('featured-image')} image={image} priority />
          )}
        </div>
      )}
      {!hasVisualHeader && hasText && (
        <div className={cx('no-image-header')}>
          <div className="container">
            {breadcrumbs.length > 0 && (
              <nav className={cx('breadcrumbs')} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.href}>
                    <span className={cx('separator')}>/</span>
                    {index === breadcrumbs.length - 1 ? (
                      <span aria-current="page">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href}>{crumb.label}</Link>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {!!title && <Heading className={cx('heading-no-image')}>{title}</Heading>}
          </div>
        </div>
      )}
      {hasVisualHeader && breadcrumbs.length > 0 && (
        <div className={cx('breadcrumb-wrap')}>
          <div className="container">
            <nav className={cx('breadcrumbs')} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href}>
                  <span className={cx('separator')}>/</span>
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
