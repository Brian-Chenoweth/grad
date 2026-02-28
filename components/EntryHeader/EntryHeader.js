// EntryHeader.jsx
import className from 'classnames/bind';
import { FeaturedImage, Heading } from 'components';

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
  const hasText = title || date || author;

  return (
    <div className={cx(['entry-header', className])}>
      {(image || videoSrc) && (
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
    </div>
  );
}
