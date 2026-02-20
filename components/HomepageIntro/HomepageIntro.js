import styles from './HomepageIntro.module.scss';

export default function HomepageIntro() {
  return (
    <div className={styles.homeIntroWrapper}>
    <section className={`bg-blue ${styles.homeIntro}`}>
      <div>
        <div className={styles.box}>

          <div className={styles.content}>
            <p>
              The strategic business partner to Cal Poly Solano Campus and Graduate Education, the Graduate Education provides the campus and the local community with innovative services through strategic business partnerships that continuously improve value and enhance the overall experience of our cadets.
            </p>
          </div>

        <div className={styles.numbers}>
          
          <div className={styles.numberItem}>
            <h2>5<span className="blue">+</span></h2>
            <p>Years Supporting Graduate Education</p>
          </div>

          <div className={styles.numberItem}>
            <h2>750<span className="blue">+</span></h2>
            <p>Number of Cadets Supported</p>
          </div>

          <div className={styles.numberItem}>
            <h2>$6.5 million<span className="blue">+</span></h2>
            <p>Generated Revenue in Support of Graduate Education</p>
          </div>

        </div>

      </div>
      </div>
    </section>
    </div>
  );
}
