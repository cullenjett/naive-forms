import { useForm } from './use-form';
import { required, validate } from './validation';
import { Checkbox, FileInput, Input, RadioGroup, Select } from './fields';
import { useState } from 'react';

type Fields = {
  firstName: string;
  lastName: string;
  ssn: string;
  favoriteColor: 'red' | 'blue';
  isLegal: boolean;
  pickOne: string;
  doc: FileList;
};

export function App() {
  const [submission, setSubmission] = useState<Partial<Fields> | null>(null);

  const { handleSubmit, getInputProps, isSubmitting } = useForm<Fields>({
    initialValues: {
      firstName: 'Cullen',
      isLegal: true,
    },
    validate: (formValues) => {
      return {
        firstName: validate(required())(formValues.firstName),
        lastName: validate(required())(formValues.lastName),
        ssn: validate(required())(formValues.ssn),
        favoriteColor: validate(required())(formValues.favoriteColor),
        isLegal: validate(required())(formValues.isLegal),
        pickOne: validate(required())(formValues.pickOne),
      };
    },
    onSubmit: async (formValues) => {
      setSubmission(null);
      console.log(formValues);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      setSubmission(formValues);
    },
  });

  // TODO: file inputs can't be controlled
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, ...docInputProps } = getInputProps('doc');

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <Input label="First name" {...getInputProps('firstName')} />
        <Input label="Last name" {...getInputProps('lastName')} />
        <Input label="SSN" {...getInputProps('ssn')} />
        <RadioGroup
          label="Favorite color"
          options={[
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
          ]}
          {...getInputProps('favoriteColor')}
        />
        <Checkbox
          label="Are you over 21?"
          type="checkbox"
          {...getInputProps('isLegal')}
        />
        <Select label="Pick one" {...getInputProps('pickOne')}>
          <option value=""></option>
          <option value="heaven">Heaven</option>
          <option value="hell">Hell</option>
        </Select>
        <FileInput label="Upload a document" {...getInputProps('doc')} />
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>

      {submission && (
        <code>
          <pre>{JSON.stringify(submission, null, 2)}</pre>
        </code>
      )}
    </main>
  );
}
