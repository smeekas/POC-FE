import { z } from 'zod';

/**
 * Validation rules for the login form.
 *
 * `.pipe()` is used instead of chaining `.email()` so that an empty field reports
 * "Email is required." rather than the format error.
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Password is required.'),
});

/** The values the login form holds while the user is typing. */
export type LoginFormValues = z.infer<typeof loginFormSchema>;

/** Empty login form, used as the react-hook-form default so inputs start controlled. */
export const LOGIN_FORM_DEFAULT_VALUES: LoginFormValues = {
  email: '',
  password: '',
};
