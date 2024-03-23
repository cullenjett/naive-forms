import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useForm } from './use-form';
import { Input } from './fields';
import { required, validate } from './validation';

type Fields = {
  name: string;
  email: string;
};

describe('useForm()', () => {
  it('can set initialValues', () => {
    const { result } = renderHook(() =>
      useForm<Fields>({
        initialValues: {
          email: 'test@example.com',
          name: 'Cullen',
        },
      })
    );

    expect(result.current.formValues).toEqual({
      email: 'test@example.com',
      name: 'Cullen',
    });
  });

  it('generates the expected input props', () => {
    const { result } = renderHook(() => useForm<Fields>({}));

    const emailInputProps = result.current.getInputProps('email');
    expect(emailInputProps).toMatchInlineSnapshot(`
      {
        "aria-invalid": false,
        "disabled": false,
        "error": undefined,
        "id": "email",
        "name": "email",
        "onChange": [Function],
        "value": "",
      }
    `);
  });

  it('updates text input values on change', () => {
    const TestForm = () => {
      const { handleSubmit, getInputProps, formValues } = useForm<Fields>({});

      return (
        <>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              {...getInputProps('email')}
            />
          </form>

          <p data-testid="email-output">{formValues.email}</p>
        </>
      );
    };

    render(<TestForm />);

    const emailInput = screen.getByLabelText<HTMLInputElement>('Email address');
    expect(emailInput.value).toEqual('');

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    expect(emailInput.value).toEqual('test@example.com');

    expect(screen.getByTestId('email-output').textContent).toEqual(
      'test@example.com'
    );
  });

  it('prevents submit on validation error', () => {
    const onSubmitMock = vi.fn().mockResolvedValue(null);
    const TestForm = () => {
      const { handleSubmit, getInputProps, formValues } = useForm<Fields>({
        onSubmit: onSubmitMock,
        validate: (formValues) => {
          return {
            email: validate(required())(formValues.email),
          };
        },
      });

      return (
        <>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              {...getInputProps('email')}
            />
            <button type="submit">Submit</button>
          </form>

          <p data-testid="email-output">{formValues.email}</p>
        </>
      );
    };

    render(<TestForm />);

    const emailInput = screen.getByLabelText<HTMLInputElement>('Email address');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.click(submitButton);

    expect(emailInput.getAttribute('aria-invalid')).toEqual('true');

    const errorMessage = screen.getByText('Required');
    expect(errorMessage).toBeInTheDocument(); // TODO: make error messages accessible
  });
});
