// Header.jsx
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { FaBars, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

import NavigationMenu from '../NavigationMenu';
import SkipNavigationLink from '../SkipNavigationLink';

import MobileNav from './MobileNav';
import styles from './Header.module.scss';
let cx = classNames.bind(styles);

function useIsMobile(bp = 767) {
  const [isMobile, set] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${bp}px)`);
    const onChange = () => set(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [bp]);
  return isMobile;
}

export default function Header({ className, menuItems }) {
  const [isNavShown, setIsNavShown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile(767);
  const menuRef = useRef(null);

  const headerClasses = cx('header', className, { scrolled: isScrolled });
  const logoWrapClasses = cx('logo-wrap', { scrolled: isScrolled });
  const headerContentClasses = cx('container', 'header-content', { scrolled: isScrolled });
  const navClasses = cx('primary-navigation', isNavShown ? cx('show') : undefined);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={headerClasses}>
      <div className={logoWrapClasses}>
        <div className="container">
          <div className={cx('logo')}>
            <Link href="/" title="Home">
              <Image
                src="/logo.png"
                width={400}
                height={80}
                alt="Cal Poly University logo"
                layout="responsive"
              />
            </Link>
          </div>
        </div>
      </div>

      <SkipNavigationLink />

      <div className={headerContentClasses}>
        <div className={cx('bar')}>
          <a href="/" className={cx('titleName')}>Graduate Education</a>

          <button
            type="button"
            className={cx('nav-toggle')}
            onClick={() => setIsNavShown(!isNavShown)}
            aria-label="Toggle navigation"
            aria-expanded={isNavShown}
          >
            <FaBars />
          </button>

          {isMobile ? (
            <MobileNav
              className={cx('mobile-nav', { open: isNavShown })}
              menuItems={menuItems}
              onNavigate={() => setIsNavShown(false)}
            >
              <li>
                <Link href="/search" title="Search">
                  <FaSearch title="Search" role="img" />
                </Link>
              </li>
            </MobileNav>
          ) : (
            <NavigationMenu
              id={cx('primary-navigation')}
              className={navClasses}
              menuItems={menuItems}
              ref={menuRef}
            >
              <li>
                <Link href="/search" title="Search">
                  <FaSearch title="Search" role="img" />
                </Link>
              </li>
            </NavigationMenu>
          )}
        </div>
      </div>
    </header>
  );
}
