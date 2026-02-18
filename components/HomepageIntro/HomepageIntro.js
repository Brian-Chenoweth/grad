// import CountUp from 'react-countup';

import styles from './HomepageIntro.module.scss';

export default function HomepageIntro() {
  return (
    <div className={styles.homeIntroWrapper}>
    <section className={`bg-blue ${styles.homeIntro}`}>
      <div>
        <div className={styles.box}>

          <div className={styles.content}>
            <p>
              The strategic business partner to Cal Poly Solano Campus and Cal Poly Maritime Academy, the Cal Maritime Corporation provides the campus and the local community with innovative services through strategic business partnerships that continuously improve value and enhance the overall experience of our cadets.
            </p>
          </div>

        <div className={styles.numbers}>
          
          <div className={styles.numberItem}>
            <h2><CountUp end={5} duration={1.5} useEasing={false}/><span  className='blue'>+</span></h2>
            <p>Years Supporting Cal Poly Maritime Academy</p>
          </div>

          <div className={styles.numberItem}>
            <h2><CountUp end={750}  duration={2.5} useEasing={false}/><span  className='blue'>+</span></h2>
            <p>Number of Cadets Supported</p>
          </div>

          <div className={styles.numberItem}>
            <h2>$<CountUp end={6.5}  duration={2} useEasing={false} decimals={1}/> million<span  className='blue'>+</span></h2>
            <p>Generated Revenue in Support of Cal Poly Maritime Academy</p>
          </div>

        </div>

      </div>
      </div>
    </section>
    </div>
  );
}
