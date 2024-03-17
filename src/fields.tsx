import { ComponentProps, ReactNode } from 'react';
import { clsx } from 'clsx';

import styles from './fields.module.css';

interface InputProps extends ComponentProps<'input'> {
  name: string;
  label?: ReactNode;
  error?: ReactNode;
}

interface SelectProps extends ComponentProps<'select'> {
  name: string;
  label?: ReactNode;
  error?: ReactNode;
}

export function Input(props: InputProps) {
  const { label, error, ...inputProps } = props;
  const id = inputProps.id || inputProps.name;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={clsx(styles.label, {
            [styles.labelError]: error,
          })}
        >
          {label}
        </label>
      )}
      <input
        className={clsx(styles.input, {
          [styles.inputError]: error,
        })}
        {...inputProps}
        id={id}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export function Checkbox(props: InputProps) {
  const { label, error, value, ...inputProps } = props;
  const id = inputProps.id || inputProps.name;

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          {...inputProps}
          value={value}
          checked={Boolean(value)}
          type="checkbox"
          id={id}
        />
        {label && (
          <label
            htmlFor={id}
            className={clsx(styles.checkboxLabel, {
              [styles.checkboxLabelError]: error,
            })}
          >
            {label}
          </label>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export function RadioGroup(
  props: InputProps & { options: Array<{ label: string; value: string }> }
) {
  const { label, options, error, ...inputProps } = props;

  return (
    <div>
      {label && (
        <div
          className={styles.label}
          style={{ color: error ? 'red' : 'black' }}
        >
          {label}
        </div>
      )}
      {options.map((option) => (
        <div key={option.label} style={{ display: 'flex', gap: '8px' }}>
          <input
            {...inputProps}
            id={option.value}
            type="radio"
            value={option.value}
          />
          <label
            className={clsx(styles.checkboxLabel, {
              [styles.checkboxLabelError]: error,
            })}
            htmlFor={option.value}
          >
            {option.label}
          </label>
        </div>
      ))}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export function Select(props: SelectProps) {
  const { label, error, ...selectProps } = props;
  const id = selectProps.id || selectProps.name;

  return (
    <div>
      {label && (
        <label
          className={clsx(styles.label, {
            [styles.labelError]: error,
          })}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <select
        className={clsx(styles.select, {
          [styles.selectError]: error,
        })}
        {...selectProps}
        id={id}
      >
        {props.children}
      </select>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
