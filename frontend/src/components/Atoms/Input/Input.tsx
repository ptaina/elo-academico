import type { ComponentPropsWithoutRef } from "react";
import styles from "./Input.module.css"; 

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      
      <input
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        {...props}
      />
      
      {/*  mensagem de erro akir*/}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}