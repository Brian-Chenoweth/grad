import className from 'classnames/bind';

import styles from './ProgramItem.module.scss';
const cx = className.bind(styles);

/**
 * Render the program item component
 *
 * @param {Props} props The props object.
 * @param {string} props.author The author of the program.
 * @param {React.ReactElement} props.children The content of the program.
 * @returns {React.ReactElement} The program item component.
 */
export default function ProgramItem({ author, children }) {
  return (
    <div className={cx('container')}>
      <div className={cx('content')}>{children}</div>

      {author && <div className={cx('author')}>{author}</div>}
    </div>
  );
}
