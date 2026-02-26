// Footer.js
import classNames from 'classnames/bind';
import {
  FaFacebookF,
  FaXTwitter,
} from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import appConfig from 'app.config.js';

import NavigationMenu from '../NavigationMenu';

import styles from './Footer.module.scss';
const cx = classNames.bind(styles);

export default function Footer({
  siteTitle,
  title,
  menuItems,
  navOneMenuItems,
  navTwoMenuItems,
}) {
  return (
    <>
      <footer className={cx('footer')}>
        <div className={cx('footer-inner')}>
          <div className={cx('container', styles.footerWrap)}>
            <div className={cx('footer-nav-contact-info')}>

              <div className={cx('about')}>
                <h3>Resources</h3>
                <NavigationMenu className={cx('quick')} menuItems={menuItems} />
              </div>

              <div className={cx('resources')}>
                <h3>Connect with Us</h3>
                <a href="https://maps.calpoly.edu/place/bldg-052-0/@35.3006123,-120.6608836,16.6z" target="_blank" rel="noopener noreferrer" className={cx('address')}>Office: Building 52, Room D-27</a>
              </div>
              
              

              <div className={cx('contact-info')}>
                <Link href="/" className={cx('cppText')}>
                  {title ?? 'Graduate Education'}
                </Link>

                <a href="mailto:grad@calpoly.edu" className={cx('phone')}>
                  grad@calpoly.edu
                </a>

                <a href="tel:8057562328" className={cx('phone')}>
                  805-756-2328
                </a>
              </div>
            </div>

            <div className={cx('logo-address')}>
              <div className={cx('logo')}>
                <Link href="https://www.calpoly.edu/" title="Home" target='_blank' rel='noopener noreferrer'>
                  <Image
                    src="/logo.png"
                    width={400}
                    height={80}
                    alt="Cal Poly University logo"
                    layout="responsive"
                  />
                </Link>
              </div>

              <p>1 Grand Avenue, San Luis Obispo, CA 93407</p>
              <a href="tel:8057561111" className={cx('phone')}>(805) 756-1111</a>

            </div>

            <div className={cx('nav-one')}>
              <NavigationMenu className={cx('nav')} menuItems={navOneMenuItems} />
            </div>

            <div className={cx('nav-two')}>
              <NavigationMenu className={cx('nav')} menuItems={navTwoMenuItems} />
            </div>

            <div className={cx('copyright')}>
              &copy; {new Date().getFullYear()} {siteTitle ?? 'California Polytechnic State University'}
            </div>
          </div>

          <div className={cx('footer-mountains')}></div>
        </div>
      </footer>
    </>
  );
}
