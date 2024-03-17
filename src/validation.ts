type ValidatorFunc = (value: unknown) => string | undefined;

type Validate = (
  ...validatorFuncs: ValidatorFunc[]
) => (value: unknown) => string | undefined;

export const validate: Validate =
  (...validatorFuncs) =>
  (value) => {
    const errorString = validatorFuncs.reduce((error, validatorFunc) => {
      return error || validatorFunc(value) || '';
    }, '');

    return errorString !== '' ? errorString : undefined;
  };

export function required(customMsg?: string): ValidatorFunc {
  return (value) => {
    let error;

    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === false
    ) {
      error = customMsg || 'Required';
    }

    return error;
  };
}
