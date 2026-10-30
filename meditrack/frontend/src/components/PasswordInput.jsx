import { useState } from "react";
import styles from "./PasswordInput.module.css";

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  dark = false,
  required = true,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={dark ? styles.labelDark : styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={dark ? styles.inputDark : styles.input}
        />

        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => !s)}
          className={styles.toggleBtn}
        >
          {show ? (
            // eye with slash (password visible)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          ) : (
            // eye (password hidden)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
