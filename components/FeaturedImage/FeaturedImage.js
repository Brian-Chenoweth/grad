import { gql } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/router'; // 👈 import useRouter

import styles from './FeaturedImage.module.scss';

/**
 * A page/post Featured Image component
 * @param {Props} props The props object.
 * @param {string} props.title The post/page title.
 * @param {MediaItem} props.image The post/page image.
 * @param {string|number} props.width The image width.
 * @param {string|number} props.height The image height.
 * @return {React.ReactElement} The FeaturedImage component.
 */
export default function FeaturedImage({
  className,
  image,
  width,
  height,
  ...props
}) {
  const router = useRouter(); // 👈 use the router
  const isHome = router.pathname === '/'; // 👈 check if it's the home page

  let src;
  if (image?.sourceUrl instanceof Function) {
    src = image?.sourceUrl();
  } else {
    src = image?.sourceUrl;
  }
  const { altText } = image || '';

  width = width ? width : image?.mediaDetails?.width;
  height = height ? height : image?.mediaDetails?.height;

  const combinedClassName = [
    styles['featured-image'],
    className,
    isHome ? styles['home-image'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return src && width && height ? (
    <figure className={combinedClassName}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={altText}
        objectFit="cover"
        layout="responsive"
        {...props}
      />
    </figure>
  ) : null;
}

FeaturedImage.fragments = {
  entry: gql`
    fragment FeaturedImageFragment on NodeWithFeaturedImage {
      featuredImage {
        node {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  `,
};
