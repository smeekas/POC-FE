import { describe, expect, it } from 'vitest';

import {
  LOGIN_FORM_DEFAULT_VALUES,
  loginFormSchema,
  type LoginFormValues,
} from './login';

/** Collects the first message reported for each field — the one the form shows. */
const messagesByField = (values: unknown): Record<string, string> => {
  const result = loginFormSchema.safeParse(values);

  if (result.success) return {};

  const messages: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = String(issue.path[0]);

    messages[field] ??= issue.message;
  }

  return messages;
};

describe('loginFormSchema', () => {
  it('accepts a well formed email and password', () => {
    const result = loginFormSchema.safeParse({
      email: 'user@company.com',
      password: 'secret123',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      email: 'user@company.com',
      password: 'secret123',
    });
  });

  it('trims surrounding whitespace off the email', () => {
    const result = loginFormSchema.safeParse({
      email: '  user@company.com  ',
      password: 'secret123',
    });

    expect(result.success).toBe(true);
    expect(result.data?.email).toBe('user@company.com');
  });

  it('reports the required error, not the format error, for an empty email', () => {
    expect(messagesByField({ email: '', password: 'secret123' }).email).toBe(
      'Email is required.',
    );
  });

  it('treats a whitespace only email as missing rather than malformed', () => {
    expect(messagesByField({ email: '   ', password: 'secret123' }).email).toBe(
      'Email is required.',
    );
  });

  it.each(['user', 'user@', '@company.com', 'user@company', 'user company@x.com'])(
    'rejects %j as an email address',
    (email) => {
      expect(messagesByField({ email, password: 'secret123' }).email).toBe(
        'Enter a valid email address.',
      );
    },
  );

  it('requires a password', () => {
    expect(messagesByField({ email: 'user@company.com', password: '' }).password).toBe(
      'Password is required.',
    );
  });

  it('does not enforce password strength on login', () => {
    const result = loginFormSchema.safeParse({
      email: 'user@company.com',
      password: 'a',
    });

    expect(result.success).toBe(true);
  });

  it('reports both fields at once when the form is untouched', () => {
    expect(messagesByField(LOGIN_FORM_DEFAULT_VALUES)).toEqual({
      email: 'Email is required.',
      password: 'Password is required.',
    });
  });

  it('rejects non string values', () => {
    expect(loginFormSchema.safeParse({ email: 42, password: null }).success).toBe(false);
  });
});

describe('LOGIN_FORM_DEFAULT_VALUES', () => {
  it('starts every input controlled with an empty string', () => {
    const defaults: LoginFormValues = LOGIN_FORM_DEFAULT_VALUES;

    expect(defaults).toEqual({ email: '', password: '' });
  });
});
