import Image from 'next/image';
import {
  Button,
} from 'components';

import styles from './HomepageStudentNeeds.module.scss';

export default function HomepageStudentNeeds() {
  return (
    <div className={styles.cta}>

          <div className="wp-block-media-text has-media-on-the-left is-stacked-on-mobile yellow-image-left dark-blue-image-left homepage-dark-blue">

            <div className="wp-block-media-text__content">

              <Image
                src="/home/nautical.png"
                width={385}
                height={385}
                alt="Two cadets in white naval uniforms smiling together during a ceremony at Cal Maritime."
                layout="responsive"
              />

              <h2 className="wp-block-heading">Supporting Student Needs</h2>
              <p>Through enterprise services like Maritime Shop and event coordination, Cal Maritime Corporation provides essential resources for students, cadets, faculty and visitors alike. From branded gear to facility rentals and conference planning, our Commercial Services operations generate revenue that directly benefits the university while keeping vital services running smoothly.</p>

              <Button styleType="primary" href="https://maritime-archive.calpoly.edu/keelhauler-shops/index.html" target="_blank" rel="noopener noreferrer">
                Maritime Shop
              </Button>

            </div>

            <figure className="wp-block-media-text__media">
              <Image
                src="/home/cadets-smiling-in-uniform-cal-maritime.jpg"
                width={980}
                height={630}
                alt="Two cadets in white naval uniforms smiling together during a ceremony at Cal Maritime."
                layout="responsive"
              />
            </figure>

          </div>

    </div>
  );
}