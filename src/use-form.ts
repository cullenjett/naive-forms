import { useState } from 'react';

type UseFormConfig<FormValues> = {
  validate?: (
    formValues: Partial<FormValues>
  ) => Partial<Record<keyof FormValues, string>>;
  onSubmit?: (
    formValues: Partial<FormValues>
  ) => Promise<Partial<Record<keyof FormValues, string>> | void>;
  initialValues?: Partial<FormValues>;
};

export const useForm = <
  FormValues extends Record<string, unknown> = Record<string, unknown>,
>(
  config: UseFormConfig<FormValues>
) => {
  const [formValues, setFormValues] = useState<Partial<FormValues>>(
    config.initialValues || {}
  );
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting'>('idle');

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    let value: string | boolean | FileList | null;

    if (e.target.type === 'file' && 'files' in e.target) {
      value = e.target.files;
    } else if (e.target.type === 'checkbox' && 'checked' in e.target) {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    setFormValues((prev) => {
      return {
        ...prev,
        [e.target.name]: value,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formStatus === 'submitting') {
      return;
    }

    if (config.validate) {
      const errors = config.validate(formValues);
      for (const fieldName in errors) {
        if (errors[fieldName]) {
          setFormErrors(errors);
          return;
        }
      }
    }

    setFormErrors({});
    setFormStatus('submitting');

    const errors = await config.onSubmit?.(formValues);
    if (errors) {
      setFormErrors(errors);
    }

    setFormStatus('idle');
  }

  function getInputProps(fieldName: keyof FormValues) {
    return {
      id: fieldName,
      name: fieldName,
      value: String(formValues[fieldName] || ''),
      onChange: handleInputChange,
      disabled: formStatus === 'submitting',
      error: formErrors[fieldName],
      'aria-invalid': Boolean(formErrors[fieldName]),
    };
  }

  return {
    formErrors,
    formValues,
    getInputProps,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    setFormValues,
    isSubmitting: formStatus === 'submitting',
  };
};
