import { describe, expect, it } from 'vitest';

import {
  MINIMUM_PASSWORD_LENGTH,
  SIGNUP_FORM_DEFAULT_VALUES,
  signupFormSchema,
  type SignupFormValues,
} from './signup';

const VALID_VALUES: SignupFormValues = {
  email: 'user@company.com',
  password: 'passw0rd',
  confirmPassword: 'passw0rd',
};

/** Parses `VALID_VALUES` with the given overrides applied. */
const parseWith = (overrides: Partial<SignupFormValues>) =>
  signupFormSchema.safeParse({ ...VALID_VALUES, ...overrides });

/** Collects the first message reported for each field — the one the form shows. */
const messagesByField = (
  overrides: Partial<SignupFormValues>,
): Record<string, string> => {
  const result = parseWith(overrides);

  if (result.success) return {};

  const messages: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = String(issue.path[0]);

    messages[field] ??= issue.message;
  }

  return messages;
};

describe('signupFormSchema', () => {
  it('accepts an email with a matching, strong enough password', () => {
    const result = parseWith({});

    expect(result.success).toBe(true);
    expect(result.data).toEqual(VALID_VALUES);
  });

  it('trims surrounding whitespace off the email', () => {
    expect(parseWith({ email: '  user@company.com  ' }).data?.email).toBe(
      'user@company.com',
    );
  });

  it('reports the required error, not the format error, for an empty email', () => {
    expect(messagesByField({ email: '' }).email).toBe('Email is required.');
  });

  it('rejects a malformed email', () => {
    expect(messagesByField({ email: 'not-an-email' }).email).toBe(
      'Enter a valid email address.',
    );
  });

  it(`rejects a password shorter than ${MINIMUM_PASSWORD_LENGTH} characters`, () => {
    const short = 'pass0rd'.slice(0, MINIMUM_PASSWORD_LENGTH - 1);

    expect(messagesByField({ password: short, confirmPassword: short }).password).toBe(
      `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
    );
  });

  it(`accepts a password of exactly ${MINIMUM_PASSWORD_LENGTH} characters`, () => {
    const exact = 'abcdefg1'.padEnd(MINIMUM_PASSWORD_LENGTH, '1');

    expect(parseWith({ password: exact, confirmPassword: exact }).success).toBe(true);
  });

  it('requires at least one letter in the password', () => {
    expect(
      messagesByField({ password: '12345678', confirmPassword: '12345678' }).password,
    ).toBe('Password must contain at least one letter.');
  });

  it('requires at least one number in the password', () => {
    expect(
      messagesByField({ password: 'abcdefgh', confirmPassword: 'abcdefgh' }).password,
    ).toBe('Password must contain at least one number.');
  });

  it('accepts symbols as long as a letter and a number are present', () => {
    expect(
      parseWith({ password: 'p@ssw0rd!', confirmPassword: 'p@ssw0rd!' }).success,
    ).toBe(true);
  });

  it('requires the confirmation field to be filled in', () => {
    expect(messagesByField({ confirmPassword: '' }).confirmPassword).toBe(
      'Please confirm your password.',
    );
  });

  it('reports a mismatch on the confirm field, where the user is looking', () => {
    const result = parseWith({ confirmPassword: 'passw0rdX' });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword']);
    expect(result.error?.issues[0]?.message).toBe('Passwords do not match.');
  });

  it('treats confirmation as case sensitive', () => {
    expect(messagesByField({ confirmPassword: 'PASSW0RD' }).confirmPassword).toBe(
      'Passwords do not match.',
    );
  });

  it('reports the field rule and the mismatch together, not one after the other', () => {
    const result = parseWith({ password: 'short', confirmPassword: 'different' });
    const messages = result.error?.issues.map((issue) => issue.message) ?? [];

    expect(result.success).toBe(false);
    expect(messages).toContain(
      `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
    );
    expect(messages).toContain('Passwords do not match.');
  });

  it('reports every field at once when the form is untouched', () => {
    expect(messagesByField(SIGNUP_FORM_DEFAULT_VALUES)).toEqual({
      email: 'Email is required.',
      password: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
      confirmPassword: 'Please confirm your password.',
    });
  });
});

describe('SIGNUP_FORM_DEFAULT_VALUES', () => {
  it('starts every input controlled with an empty string', () => {
    expect(SIGNUP_FORM_DEFAULT_VALUES).toEqual({
      email: '',
      password: '',
      confirmPassword: '',
    });
  });
});
