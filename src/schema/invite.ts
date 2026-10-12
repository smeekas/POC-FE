import { z } from 'zod';

import { UserRole } from '../constants/role';

/**
 * Validation rules for the invite form.
 *
 * `.pipe()` is used instead of chaining `.email()` so that an empty field reports
 * "Email is required." rather than the format error.
 */
export const inviteFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .pipe(z.email('Enter a valid email address.')),
  /* The control always holds one of the two roles, so this only has to reject a value
     the API would not recognise. */
  role: z.enum(UserRole, 'Select a role.'),
});

/** The values the invite form holds while the user is typing. */
export type InviteFormValues = z.infer<typeof inviteFormSchema>;

/**
 * Empty invite form, used as the react-hook-form default so inputs start controlled.
 *
 * Role opens on the lesser of the two, so handing out admin is always deliberate.
 */
export const INVITE_FORM_DEFAULT_VALUES: InviteFormValues = {
  email: '',
  role: UserRole.MEMBER,
};
