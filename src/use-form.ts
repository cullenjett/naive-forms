import { useState } from 'react';

type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

type UseFormConfig<FormValues> = {
  validate?: (
    formValues: Partial<FormValues>
  ) => Partial<Record<keyof FormValues, string>>;
  onSubmit?: (
    formValues: Partial<FormValues>
  ) => Promise<Partial<Record<keyof FormValues, string>> | void>;
  initialValues?: Partial<FormValues>;
};

type GetInputPropsOptions<FieldType> = {
  onChange?: (e: InputChangeEvent) => void;
  format?: (value: FieldType) => FieldType;
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
    e: InputChangeEvent,
    // TODO: type this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format?: any
  ) {
    let value: string | boolean | FileList | null;

    if (e.target.type === 'file' && 'files' in e.target) {
      value = e.target.files;
    } else if (e.target.type === 'checkbox' && 'checked' in e.target) {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    if (format) {
      value = format(value);
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
          handleError(errors);
          return;
        }
      }
    }

    setFormErrors({});
    setFormStatus('submitting');

    const errors = await config.onSubmit?.(formValues);
    if (errors) {
      handleError(errors);
    }

    setFormStatus('idle');
  }

  function handleError(errors: Partial<Record<keyof FormValues, string>>) {
    setFormErrors(errors);
    setTimeout(() => {
      const errorField = document.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >('[aria-invalid="true"]');
      if (errorField) {
        errorField.focus();
        errorField.scrollIntoView({
          block: 'end',
        });
      }
    }, 0);
  }

  function getInputProps<FieldName extends keyof FormValues>(
    fieldName: FieldName,
    options?: GetInputPropsOptions<FormValues[FieldName]>
  ) {
    return {
      id: fieldName,
      name: fieldName,
      value: String(formValues[fieldName] || ''),
      onChange: (e: InputChangeEvent) => {
        handleInputChange(e, options?.format);

        // Hack in a sync update so e.target.value reflects the result of handleInputChange
        if (options?.onChange) {
          setTimeout(() => {
            options?.onChange?.(e);
          }, 0);
        }
      },
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
