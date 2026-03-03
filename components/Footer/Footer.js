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
  resourcesMenuItems,
  navOneMenuItems,
  navTwoMenuItems,
}) {
  const allFooterItems = Array.isArray(menuItems) ? menuItems : [];
  const resolvedResourcesMenuItems = resourcesMenuItems?.length
    ? resourcesMenuItems
    : allFooterItems;

  const deriveColumnMenus = (items) => {
    const topLevel = items.filter((item) => !item?.parentId);
    const leftRootIds = new Set(topLevel.filter((_, i) => i % 2 === 0).map((item) => item.id));
    const rightRootIds = new Set(topLevel.filter((_, i) => i % 2 === 1).map((item) => item.id));

    const rootById = new Map(topLevel.map((item) => [item.id, item.id]));
    let changed = true;

    // Resolve each item's top-level ancestor so child items stay with their parent column.
    while (changed) {
      changed = false;
      items.forEach((item) => {
        if (!item?.id || rootById.has(item.id)) return;
        const parentRootId = rootById.get(item.parentId);
        if (parentRootId) {
          rootById.set(item.id, parentRootId);
          changed = true;
        }
      });
    }

    const leftItems = items.filter((item) => leftRootIds.has(rootById.get(item.id)));
    const rightItems = items.filter((item) => rightRootIds.has(rootById.get(item.id)));

    return { leftItems, rightItems };
  };

  const { leftItems, rightItems } = deriveColumnMenus(allFooterItems);
  const resolvedNavOneMenuItems = navOneMenuItems?.length ? navOneMenuItems : leftItems;
  const resolvedNavTwoMenuItems = navTwoMenuItems?.length ? navTwoMenuItems : rightItems;

  return (
    <>
      <footer className={cx('footer')}>
        <div className={cx('footer-inner')}>
          <div className={cx('container', styles.footerWrap)}>
            <div className={cx('footer-nav-contact-info')}>

              <div className={cx('about')}>
                <h3>Resources</h3>
                <NavigationMenu
                  className={cx('quick')}
                  menuItems={resolvedResourcesMenuItems}
                />
              </div>

              <div className={cx('resources')}>
                <h3>Connect with Us</h3>
                {appConfig?.socialLinks && (
                  <div className={cx('social-links')}>
                    <ul aria-label="Social media">
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

                      {appConfig.socialLinks?.twitterUrl && (
                        <li>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx('social-icon-link')}
                            href={appConfig.socialLinks.twitterUrl}
                          >
                            <FaXTwitter title="Twitter" className={cx('social-icon')} />
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
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
              <NavigationMenu className={cx('nav')} menuItems={resolvedNavOneMenuItems} />
            </div>

            <div className={cx('nav-two')}>
              <NavigationMenu className={cx('nav')} menuItems={resolvedNavTwoMenuItems} />
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
