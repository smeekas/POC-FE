import { z } from 'zod';

/** Shortest password we accept. Kept here so the rule and its hint text never drift apart. */
export const MINIMUM_PASSWORD_LENGTH = 8;

/**
 * Validation rules for the signup form.
 *
 * The confirm-password check lives on the object rather than the field so it can compare
 * both values, and its error is reported on the confirm field where the user will look.
 */
export const signupFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .pipe(z.email('Enter a valid email address.')),
    password: z
      .string()
      .min(
        MINIMUM_PASSWORD_LENGTH,
        `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
      )
      .regex(/[A-Za-z]/, 'Password must contain at least one letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/** The values the signup form holds while the user is typing. */
export type SignupFormValues = z.infer<typeof signupFormSchema>;

/** Empty signup form, used as the react-hook-form default so inputs start controlled. */
export const SIGNUP_FORM_DEFAULT_VALUES: SignupFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};
