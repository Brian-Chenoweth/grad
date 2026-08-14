import { gql } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/router'; // 👈 import useRouter

import styles from './FeaturedImage.module.scss';

const BLUR_PLACEHOLDER_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23d9dfda'/%3E%3Cstop offset='100%25' stop-color='%23eef2ef'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='16' height='9' fill='url(%23g)'/%3E%3C/svg%3E";

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
  const isSvgSource = typeof src === 'string' && src.toLowerCase().endsWith('.svg');

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
        placeholder={isSvgSource ? 'empty' : 'blur'}
        blurDataURL={isSvgSource ? undefined : BLUR_PLACEHOLDER_DATA_URL}
        sizes={props?.sizes ?? '100vw'}
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
