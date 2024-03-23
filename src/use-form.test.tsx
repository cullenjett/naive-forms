import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useForm } from './use-form';

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
    const onSubmitMock = vi.fn().mockResolvedValue(null);
    const TestForm = () => {
      const { handleSubmit, getInputProps, formValues } = useForm<Fields>({
        onSubmit: onSubmitMock,
      });

      return (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input type="email" {...getInputProps('email')} />
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
});
