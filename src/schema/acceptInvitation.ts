import { z } from 'zod';

import { MINIMUM_PASSWORD_LENGTH } from './signup';

/**
 * Validation rules for the accept invitation form.
 *
 * The password rules are the signup rules: an account born from an invite is held to
 * the same standard as one that signed itself up. The confirm check lives on the object
 * so it can compare both values, and reports on the confirm field where the user looks.
 */
export const acceptInvitationFormSchema = z
  .object({
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

/** The values the accept invitation form holds while the user is typing. */
export type AcceptInvitationFormValues = z.infer<
  typeof acceptInvitationFormSchema
>;

/** Empty form, used as the react-hook-form default so inputs start controlled. */
export const ACCEPT_INVITATION_FORM_DEFAULT_VALUES: AcceptInvitationFormValues =
  {
    password: '',
    confirmPassword: '',
  };
