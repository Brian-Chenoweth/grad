// Header.jsx
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { FaBars, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  const router = useRouter();
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

  useEffect(() => {
    if (!(isMobile && isNavShown)) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, isNavShown]);

  useEffect(() => {
    if (!isNavShown) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsNavShown(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isNavShown]);

  useEffect(() => {
    const closeNav = () => setIsNavShown(false);
    router.events.on('routeChangeStart', closeNav);
    return () => router.events.off('routeChangeStart', closeNav);
  }, [router.events]);

  useEffect(() => {
    if (!isMobile) {
      setIsNavShown(false);
    }
  }, [isMobile]);

  return (
    <header className={headerClasses}>
      <div className={logoWrapClasses}>
        <div className={cx('container', 'top-bar')}>
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
          <div className={cx('top-actions')}>
            <a
              href="https://www.calpoly.edu/admissions/graduate-student/how-to-apply"
              className={cx('apply-link')}
              target="_blank"
              rel="noopener noreferrer"
            >
              How to Apply
            </a>
            <Link href="/search" title="Search" className={cx('search-link')}>
              <FaSearch title="Search" role="img" />
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
            aria-label={isNavShown ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isNavShown}
          >
            <FaBars />
          </button>

          {isMobile ? (
            <MobileNav
              className={cx('mobile-nav', { open: isNavShown })}
              menuItems={menuItems}
              onNavigate={() => setIsNavShown(false)}
              onClose={() => setIsNavShown(false)}
              isOpen={isNavShown}
            />
          ) : (
            <NavigationMenu
              id={cx('primary-navigation')}
              className={navClasses}
              menuItems={menuItems}
              ref={menuRef}
            >
              {isScrolled && (
                <li className={cx('scrolled-nav-search')}>
                  <Link href="/search" title="Search" className={cx('search-link', 'search-link-scrolled')}>
                    <FaSearch title="Search" role="img" />
                  </Link>
                </li>
              )}
            </NavigationMenu>
          )}
        </div>
      </div>
    </header>
  );
}
