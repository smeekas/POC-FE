import { z } from 'zod';

/** Longest workspace name we accept. Kept here so the rule and its hint text never drift apart. */
export const MAXIMUM_WORKSPACE_NAME_LENGTH = 30;

/** Validation rules for the create-workspace form. */
export const createWorkspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required.')
    .max(
      MAXIMUM_WORKSPACE_NAME_LENGTH,
      `Workspace name must be ${MAXIMUM_WORKSPACE_NAME_LENGTH} characters or fewer.`,
    ),
});

/** The values the create-workspace form holds while the user is typing. */
export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceFormSchema>;

/** Empty form, used as the react-hook-form default so the input starts controlled. */
export const CREATE_WORKSPACE_FORM_DEFAULT_VALUES: CreateWorkspaceFormValues = {
  name: '',
};
