import Image from 'next/image';
import Link from 'next/link';

import styles from './HomepageCampusLife.module.scss';

export default function HomepageCampusLife() {
  return (
    <div className={styles.cta}>
          <div className="wp-block-media-text has-media-on-the-right is-stacked-on-mobile white-image-right">
            <div className="wp-block-media-text__content">
              <h2 className="wp-block-heading">  <span className='gold'>Improving</span> Campus Life</h2>
              <p>Our work directly impacts the lives and campus experience of all students, cadets, faculty and staff member. Whether it’s through our support of research projects, student enterprises, delicious dining options, affordable textbooks or spirited memorabilia our work helps to enhance the academy and drive the university forward.</p>
              <p>
                <Link href="https://maritime-archive.calpoly.edu/corporation/" title="Commercial Services" target="_blank" rel="noopener noreferrer">
                    Commercial Services
                </Link>
              </p>
            </div>
            <figure className="wp-block-media-text__media">
              <Image
                src="/home/cal-maritime-marketplace-building-campus-life-support.jpg"
                width={980}
                height={630}
                alt="Exterior of Cal Maritime Marketplace building with palm trees and clear blue sky, representing campus life improvements and student support services featured on Cal Maritime Corporation’s website."
                layout="responsive"
              />
            </figure>
          </div>
    </div>
  );
}