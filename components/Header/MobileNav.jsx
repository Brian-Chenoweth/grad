import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { FaChevronDown, FaXmark } from 'react-icons/fa6';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

export default function MobileNav({
  menuItems,
  className,
  children,
  onNavigate,
  onClose,
  isOpen,
}) {
  const [openIds, setOpenIds] = useState(new Set());

  useEffect(() => {
    if (!isOpen) {
      setOpenIds(new Set());
    }
  }, [isOpen]);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const tree = useMemo(() => {
    const map = {};
    const roots = [];

    (menuItems || []).forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    (menuItems || []).forEach((item) => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  }, [menuItems]);

  const renderNodes = (items, depth = 0) =>
    items.map((item) => {
      const hasKids = item.children?.length > 0;
      const open = openIds.has(item.id);
      const depthVar = { '--depth': depth };

      if (hasKids) {
        return (
          <li key={item.id} className={cx('mnav__li', { open })} style={depthVar}>
            <div className={cx('mnav__itemRow')}>
              <Link
                href={item.path ?? '#'}
                className={cx('mnav__link', 'mnav__linkParent')}
                onClick={onNavigate}
              >
                {item.label}
              </Link>
              <button
                type="button"
                className={cx('mnav__expand')}
                aria-label={`Toggle ${item.label} submenu`}
                aria-expanded={open}
                onClick={() => toggle(item.id)}
              >
                <FaChevronDown className={cx('mnav__caret')} aria-hidden="true" />
              </button>
            </div>

            <div className={cx('mnav__panel', { open })}>
              <ul className={cx('mnav__ul')}>{renderNodes(item.children, depth + 1)}</ul>
            </div>
          </li>
        );
      }

      return (
        <li key={item.id} className={cx('mnav__li')} style={depthVar}>
          <Link href={item.path ?? '#'} className={cx('mnav__link')} onClick={onNavigate}>
            {item.label}
          </Link>
        </li>
      );
    });

  return (
    <nav className={className} aria-label="Mobile menu" aria-hidden={!isOpen}>
      <button
        type="button"
        className={cx('mnav__backdrop')}
        aria-label="Close menu"
        onClick={onClose}
      />

      <aside className={cx('mnav__drawer')}>
        <div className={cx('mnav__header')}>
          <span className={cx('mnav__title')}>Menu</span>
          <button type="button" className={cx('mnav__close')} aria-label="Close menu" onClick={onClose}>
            <FaXmark aria-hidden="true" />
          </button>
        </div>

        <div className={cx('mnav__content')}>
          <ul className={cx('mnav__ul')}>
            {renderNodes(tree)}
            {children}
          </ul>
        </div>

        <div className={cx('mnav__footer')}>
          <a
            href="https://www.calpoly.edu/admissions/graduate-student/how-to-apply"
            className={cx('mnav__apply')}
            target="_blank"
            rel="noopener noreferrer"
          >
            How to Apply
          </a>
          <Link href="/search" className={cx('mnav__search')} onClick={onNavigate}>
            Search Site
          </Link>
        </div>
      </aside>
    </nav>
  );
}
