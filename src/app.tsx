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
  const [lastSubmission, setLastSubmission] = useState<Partial<Fields> | null>(
    null
  );

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
      setLastSubmission(null);
      console.log(formValues);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      setLastSubmission(formValues);
    },
  });

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <Input label="First name" {...getInputProps('firstName')} />
        <Input label="Last name" {...getInputProps('lastName')} />
        <Input
          label="SSN"
          placeholder="999-99-9999"
          {...getInputProps('ssn', {
            format: (value) => {
              return value
                .replace(/\D/g, '')
                .replace(/^(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/^(\d{3})-(\d{2})(.+)/, '$1-$2-$3')
                .substring(0, 11);
            },
          })}
        />
        <RadioGroup
          label="Favorite color"
          options={[
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
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

      <aside>
        <p>Last submission:</p>
        <code>
          {isSubmitting ? (
            'Submitting...'
          ) : lastSubmission ? (
            <pre>{JSON.stringify(lastSubmission, null, 2)}</pre>
          ) : null}
        </code>
      </aside>
    </main>
  );
}
