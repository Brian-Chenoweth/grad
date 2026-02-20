// EntryHeader.jsx
import className from 'classnames/bind';
import { useRouter } from 'next/router';
import { FeaturedImage, Heading } from 'components';

import styles from './EntryHeader.module.scss';

const cx = className.bind(styles);

export default function EntryHeader({ title, image, date, author, className }) {
  const hasText = title || date || author;
  const { pathname } = useRouter();
  const isHome = pathname === '/';

  return (
    <div className={cx(['entry-header', className])}>
      {image && (
        <div className={cx('image')}>


            <div className={cx('overlay')}>
              <div className="container">

                {hasText && (
                  <>
                    {!!title && <Heading className={cx('heading-home')}>{title}</Heading>}
                  </>
                )}

                {isHome && (
                  <Heading className={cx('heading-home')} level="h1">Graduate Education</Heading>
                )}
                                
              </div>
            </div>



          <FeaturedImage className={cx('featured-image')} image={image} priority />
        </div>
      )}
    </div>
  );
}
