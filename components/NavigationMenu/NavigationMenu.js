// NavigationMenu.jsx
import { gql } from '@apollo/client';
import Link from 'next/link';
import { useEffect, useRef, useState, forwardRef } from 'react';
import classNames from 'classnames/bind';

import styles from './NavigationMenu.module.scss';

const cx = classNames.bind(styles);

function useIsMobile(breakpoint = 767) {
  const [isMobile, set] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => set(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [breakpoint]);
  return isMobile;
}

const NavigationMenu = forwardRef(function NavigationMenu(
  { menuItems, className, children, ...rest },
  forwardedRef
) {
  const isMobile = useIsMobile(767);

  const navRef = useRef(null);
  const setRefs = (el) => {
    navRef.current = el;
    if (typeof forwardedRef === 'function') forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };

  const [openIds, setOpenIds] = useState(() => new Set());
  const hasMenu = Array.isArray(menuItems) && menuItems.length > 0;

  const isOpen = (id) => openIds.has(id);
  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleMobileExclusive = (id) =>
    setOpenIds((prev) => (prev.has(id) ? new Set() : new Set([id])));

  const closeAll = () => setOpenIds(new Set());

  useEffect(() => {
    const onDocClick = (e) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) closeAll();
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  if (!hasMenu) return null;

  // helper: build link props (honors WP "open in new tab")
  const mkLinkProps = (item, extraClass) => {
    const target = item?.target === '_blank' ? '_blank' : undefined;
    const rel = target ? 'noopener noreferrer' : undefined;
    return {
      href: item?.path ?? '',
      className: cx('item-link', extraClass),
      target,
      rel,
    };
  };

  // flat -> tree
  const buildMenuTree = (items) => {
    const map = {};
    const roots = [];
    items.forEach((item) => (map[item.id] = { ...item, children: [] }));
    items.forEach((item) => {
      if (item.parentId && map[item.parentId]) map[item.parentId].children.push(map[item.id]);
      else roots.push(map[item.id]);
    });
    return roots;
  };

  const renderMenuItems = (items) =>
    items.map((item) => {
      const hasChildren = item.children?.length > 0;
      const open = isOpen(item.id);
      const submenuId = `submenu-${item.id}`;

      if (isMobile && hasChildren) {
        return (
          <li key={item.id ?? ''} className={cx({ hasChildren, open })}>
            <button
              type="button"
              className={cx('item-row', 'row-button', { open })}
              aria-expanded={open}
              aria-controls={submenuId}
              onClick={() => toggleMobileExclusive(item.id)}
            >
              <span className={cx('row-label')}>{item.label ?? ''}</span>
              <i className={cx('fa-solid', 'fa-chevron-down')} aria-hidden="true" />
            </button>

            <ul id={submenuId} className={cx('mobile-submenu', { open })}>
              {/* parent link inside submenu */}
              <li>
                <Link {...mkLinkProps(item, 'overview')}>Overview</Link>
              </li>
              {renderMenuItems(item.children)}
            </ul>
          </li>
        );
      }

      return (
        <li key={item.id ?? ''} className={cx({ hasChildren, open })}>
          {hasChildren ? (
            <>
              <div className={cx('item-row')}>
                <Link {...mkLinkProps(item)}>{item.label ?? ''}</Link>
                <button
                  type="button"
                  className={cx('submenu-toggle', { open })}
                  aria-expanded={open}
                  aria-haspopup="true"
                  aria-controls={submenuId}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(item.id);
                  }}
                >
                  <span className={cx('visually-hidden')}>
                    {open ? 'Collapse' : 'Expand'} {item.label}
                  </span>
                  <i className={cx('fa-solid', 'fa-chevron-down')} aria-hidden="true" />
                </button>
              </div>
              <ul id={submenuId} className={cx('submenu', { visible: open })}>
                {renderMenuItems(item.children)}
              </ul>
            </>
          ) : (
            <Link {...mkLinkProps(item)}>{item.label ?? ''}</Link>
          )}
        </li>
      );
    });

  const menuTree = buildMenuTree(menuItems);

  return (
    <nav
      ref={setRefs}
      className={cx(className, { mobile: isMobile })}
      role="navigation"
      aria-label={`${menuItems[0]?.menu?.node?.name ?? 'Main'} menu`}
      {...rest}
    >
      <ul className={cx('menu', { 'menu-mobile': isMobile })}>
        {renderMenuItems(menuTree)}
        {children}
      </ul>
    </nav>
  );
});

NavigationMenu.fragments = {
  entry: gql`
    fragment NavigationMenuItemFragment on MenuItem {
      id
      path
      label
      parentId
      cssClasses
      target        # <-- pulls WP "Open link in a new tab" (_blank)
      menu {
        node {
          name
        }
      }
    }
  `,
};

export default NavigationMenu;
