import { gql } from '@apollo/client';
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaQuoteRight,
} from 'react-icons/fa';
import className from 'classnames/bind';
import { Carousel } from 'react-responsive-carousel';

import ProgramItem from '../ProgramItem';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './Programs.module.scss';
const cx = className.bind(styles);

/**
 * Render the programs component
 *
 * @param {Props} props The props object.
 * @param {Program[]} props.programs The array of programs.
 * @returns {React.ReactElement} The programs component.
 */
export default function Programs({ programs }) {
  return (
    <>
      <div className={cx('container')}>
        <FaQuoteRight className={cx('quote-icon')} />

        <Carousel
          showIndicators={false}
          showThumbs={false}
          renderArrowPrev={(clickHandler) => (
            <FaChevronCircleLeft
              className={cx('arrow')}
              onClick={clickHandler}
            />
          )}
          renderArrowNext={(clickHandler) => (
            <FaChevronCircleRight
              className={cx('arrow')}
              onClick={clickHandler}
            />
          )}
          infiniteLoop={true}
          showStatus={false}
        >
          {programs.map((program, index) => (
            <ProgramItem
              author={program?.programFields?.programAuthor}
              key={index}
            >
              <div
                className={cx('slide-content')}
                dangerouslySetInnerHTML={{
                  __html: program?.programFields?.programContent,
                }}
              />
            </ProgramItem>
          ))}
        </Carousel>
      </div>
    </>
  );
}

Programs.fragments = {
  entry: gql`
    fragment ProgramsFragment on Program {
      programFields {
        programContent
        programAuthor
      }
    }
  `,
};
