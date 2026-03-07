import Link from 'next/link';

import styles from './SearchRecommendations.module.scss';

/**
 * Render the SearchRecommendations component.
 *
 * @param {Props} props The props object.
 * @param {Array} props.programTypes Program type links to show
 *
 * @returns {React.ReactElement} The SearchRecommendations component.
 */
export default function SearchRecommendations({ programTypes }) {
  return (
    <div className={styles.recommendations}>
    </div>
  );
}
