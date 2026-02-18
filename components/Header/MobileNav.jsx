// MobileNav.jsx
import Link from 'next/link';
import { useState, useMemo } from 'react';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

export default function MobileNav({ menuItems, className, children, onNavigate }) {
  const [openIds, setOpenIds] = useState(new Set());

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const tree = useMemo(() => {
    const map = {}; const roots = [];
    (menuItems || []).forEach(i => (map[i.id] = { ...i, children: [] }));
    (menuItems || []).forEach(i => {
      if (i.parentId && map[i.parentId]) map[i.parentId].children.push(map[i.id]);
      else roots.push(map[i.id]);
    });
    return roots;
  }, [menuItems]);

  const renderNodes = (items, depth = 0) =>
    items.map((item) => {
      const hasKids = item.children?.length > 0;
      const open = openIds.has(item.id);
      const indentVar = { '--indent': `${depth}` };

      if (hasKids) {
        return (
          <li key={item.id} className={cx('mnav__li', { open })} style={indentVar}>
            <button
              type="button"
              className={cx('mnav__row')}
              aria-expanded={open}
              onClick={() => toggle(item.id)}
            >
              <span className={cx('mnav__label')}>{item.label}</span>
              <i className={cx('fa-solid', 'fa-chevron-down', 'mnav__caret')} aria-hidden="true" />
            </button>

            <div className={cx('mnav__panel', { open })}>
              {/* <Link href={item.path ?? '#'} className={cx('mnav__overview')} onClick={onNavigate}>
                Overview
              </Link> */}
              <ul className={cx('mnav__ul')}>{renderNodes(item.children, depth + 1)}</ul>
            </div>
          </li>
        );
      }

      return (
        <li key={item.id} className={cx('mnav__li')} style={indentVar}>
          <Link href={item.path ?? '#'} className={cx('mnav__row', 'mnav__link')} onClick={onNavigate}>
            <span className={cx('mnav__label')}>{item.label}</span>
          </Link>
        </li>
      );
    });

  return (
    <nav className={className} aria-label="Mobile menu">
      <div className={cx('mnav__wrap')}>
        <ul className={cx('mnav__ul')}>
          {renderNodes(tree)}
          {children}
        </ul>
      </div>
    </nav>
  );
}
