# Naive Forms

Forms are foundational for nearly all applications. There are a lot of great libraries for handling complex forms, but sometimes you just need a small, simple solution.

**This is not a published package, just a place for me to store this pattern.**

## What is it?

Patterns for the things you typically need when creating forms:

- A simple and type-safe `useForm()` hook to wire everything together.
- Components to compliment the output of `useForm()`.
- Input validation.

### What does it look like?

```tsx
type Fields = {
  name: string;
  favoriteColor: string;
  agreeToTerms: boolean;
  pickOne: 'good' | 'evil';
};

function RegistrationForm() {
  const { handleSubmit, getInputProps, isSubmitting } = useForm<Fields>({
    initialValues: {
      name: 'Cullen',
    },
    validate: (formValues) => {
      return {
        name: validate(required())(formValues.name),
        favoriteColor: validate(required())(formValues.favoriteColor),
        agreeToTerms: validate(required())(formValues.agreeToTerms),
        pickOne: validate(required())(formValues.pickOne),
      };
    },
    onSubmit: async (formValues) => {
      console.log(formValues);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        type="text"
        {...getInputProps('name', {
          onChange: (e) => console.log(e.target.value),
          format: (value) => value.toUpperCase(),
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
        label="I agree to our Terms and Conditions"
        type="checkbox"
        {...getInputProps('agreeToTerms')}
      />
      <Select label="Pick one" {...getInputProps('pickOne')}>
        <option value=""></option>
        <option value="good">Good</option>
        <option value="evil">Evil</option>
      </Select>
      <button type="submit" disabled={isSubmitting}>
        Create my account
      </button>
    </form>
  );
}
```
