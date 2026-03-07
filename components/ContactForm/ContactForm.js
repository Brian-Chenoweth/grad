'use client';

import { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';

import styles from './ContactForm.module.scss';

export default function ContactForm({ programOptions = [] }) {
  const [state, formspreeSubmit] = useForm('mvgqleqb');
  const [confirmError, setConfirmError] = useState('');

  const handleSubmit = (e) => {
    setConfirmError('');
    const form = e.currentTarget;
    const email = form.email.value.trim();
    const confirmEmail = form.confirmEmail.value.trim();

    if (email !== confirmEmail) {
      e.preventDefault();
      setConfirmError('Emails do not match.');
      return;
    }

    formspreeSubmit(e);
  };

  if (state.succeeded) {
    return <p className={styles.successMsg}>Thanks! We’ll be in touch shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} contact-form`} noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      <div className={styles.grid}>
        <label htmlFor="firstName" className={styles.field}>
          <span>First Name (Required)</span>
          <input id="firstName" name="firstName" type="text" required />
        </label>

        <label htmlFor="lastName" className={styles.field}>
          <span>Last Name (Required)</span>
          <input id="lastName" name="lastName" type="text" required />
        </label>

        <label htmlFor="email" className={styles.field}>
          <span>Email (Required)</span>
          <input id="email" name="email" type="email" required />
        </label>

        <label htmlFor="confirmEmail" className={styles.field}>
          <span>Confirm Email (Required)</span>
          <input id="confirmEmail" name="confirmEmail" type="email" required />
        </label>

        <label htmlFor="phone" className={styles.field}>
          <span>Phone (Optional)</span>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
          />
        </label>

        <label htmlFor="programOfInterest" className={styles.field}>
          <span>Program of Interest (Optional)</span>
          <select
            id="programOfInterest"
            name="programOfInterest"
            defaultValue=""
          >
            <option value="">Select a program</option>
            {programOptions.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="message" className={`${styles.field} ${styles.fullWidth}`}>
          <span>Message</span>
          <textarea id="message" name="message" rows={6} />
        </label>
      </div>

      <div className={styles.errors}>
        <ValidationError prefix="Email" field="email" errors={state.errors} />
        {confirmError && <p className={styles.errorMsg}>{confirmError}</p>}
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>

      <button type="submit" disabled={state.submitting} className={styles.submitBtn}>
        {state.submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
