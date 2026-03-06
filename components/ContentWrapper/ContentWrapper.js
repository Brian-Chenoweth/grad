import { useEffect, useRef } from 'react';
import className from 'classnames/bind';

import styles from './ContentWrapper.module.scss';

const cx = className.bind(styles);

function hasVisibleContent(value = '') {
  const html = String(value ?? '');

  const hasRenderableElements = /<(img|svg|video|audio|iframe|embed|object|table|ul|ol|dl|blockquote|pre|hr|form)\b/i.test(
    html
  );

  if (hasRenderableElements) {
    return true;
  }

  const textOnly = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;|&#xfeff;|&ZeroWidthSpace;/gi, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

  return Boolean(textOnly);
}

/**
 * A basic Container Wrapper component
 * @param {Props} props The props object.
 * @param {string} props.content The content as string.
 * @param {string} props.className An optional className to be added to the container.
 * @param {React.ReactElement} props.children The children to be rendered.
 * @return {React.ReactElement} The ContentWrapper component.
 */
export default function ContentWrapper({ content, className, children }) {
  const contentRef = useRef(null);
  const shouldRender = hasVisibleContent(content) || Boolean(children);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const root = contentRef.current;
    if (!root) return undefined;

    const setItemState = (item, button, panel, isOpen) => {
      button.setAttribute('aria-expanded', String(isOpen));
      item.classList.toggle('is-open', isOpen);
      panel.hidden = !isOpen;
      if (isOpen) {
        panel.removeAttribute('inert');
      } else {
        panel.setAttribute('inert', '');
      }
    };

    const getPanelForButton = (button, item) => {
      const panelId = button.getAttribute('aria-controls');
      if (panelId) {
        const panelFromId = root.ownerDocument.getElementById(panelId);
        if (panelFromId) return panelFromId;
      }
      return item.querySelector('.wp-block-accordion-panel');
    };

    const buttons = Array.from(
      root.querySelectorAll(
        '.wp-block-accordion-heading__toggle, .wp-block-accordion-heading-toggle'
      )
    );

    buttons.forEach((button, index) => {
      const item = button.closest('.wp-block-accordion-item');
      if (!item) return;

      const panel = getPanelForButton(button, item);
      if (!panel) return;

      if (!button.id) {
        button.id = `accordion-btn-${index}`;
      }
      if (!panel.id) {
        panel.id = `accordion-panel-${index}`;
      }

      button.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', button.id);

      // Default all accordions to closed on initial render.
      setItemState(item, button, panel, false);
    });

    const handleClick = (event) => {
      const button = event.target.closest(
        '.wp-block-accordion-heading__toggle, .wp-block-accordion-heading-toggle'
      );
      if (!button || !root.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();

      const item = button.closest('.wp-block-accordion-item');
      if (!item) return;

      const panel = getPanelForButton(button, item);
      if (!panel) return;

      const accordion = item.closest('.wp-block-accordion');
      const contextRaw = accordion?.getAttribute('data-wp-context') || '';
      const autoClose = /"autoclose"\s*:\s*true/i.test(contextRaw);
      const nextIsOpen = button.getAttribute('aria-expanded') !== 'true';

      if (nextIsOpen && autoClose && accordion) {
        const siblings = Array.from(
          accordion.querySelectorAll('.wp-block-accordion-item.is-open')
        );
        siblings.forEach((sibling) => {
          if (sibling === item) return;
          const siblingButton = sibling.querySelector(
            '.wp-block-accordion-heading__toggle, .wp-block-accordion-heading-toggle'
          );
          const siblingPanel = sibling.querySelector('.wp-block-accordion-panel');
          if (!siblingButton || !siblingPanel) return;
          setItemState(sibling, siblingButton, siblingPanel, false);
        });
      }

      setItemState(item, button, panel, nextIsOpen);
    };

    root.addEventListener('click', handleClick);
    return () => root.removeEventListener('click', handleClick);
  }, [content, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <article className={cx('content', className)}>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content ?? '' }} />
      {children}
    </article>
  );
}
