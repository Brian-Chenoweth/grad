// Footer.js
import classNames from 'classnames/bind';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa';
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
  resourcesMenuItems,
  aboutMenuItems,
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
                <NavigationMenu className={cx('quick')} menuItems={resourcesMenuItems} />
              </div>
              
              {/* <div className={cx('footer-nav')}>
                <h3>Integration</h3>
                <NavigationMenu className={cx('quick')} menuItems={menuItems} />
              </div> */}

              <div className={cx('contact-info')}>
                {/* modern Link */}
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
                {/* modern Link wrapping Image */}
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

              {appConfig?.socialLinks && (
                <div className={cx('social-links')}>
                  <ul aria-label="Social media">
                    {appConfig.socialLinks?.instagramUrl && (
                      <li>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cx('social-icon-link')}
                          href={appConfig.socialLinks.instagramUrl}
                        >
                          <FaInstagram title="Instagram" className={cx('social-icon')} />
                        </a>
                      </li>
                    )}

                    {appConfig.socialLinks?.twitterUrl && (
                      <li>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cx('social-icon-link')}
                          href={appConfig.socialLinks.twitterUrl}
                        >
                          <FaTwitter title="Twitter" className={cx('social-icon')} />
                        </a>
                      </li>
                    )}

                    {appConfig.socialLinks?.facebookUrl && (
                      <li>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cx('social-icon-link')}
                          href={appConfig.socialLinks.facebookUrl}
                        >
                          <FaFacebookF title="Facebook" className={cx('social-icon')} />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
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
