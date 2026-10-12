import { z } from 'zod';

/** Validation rules for the create document form. */
export const createDocumentFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().trim().min(1, 'Description is required.'),
  tags: z.string().optional(),
});

/** The values the create document form holds while the user is typing. */
export type CreateDocumentFormValues = z.infer<typeof createDocumentFormSchema>;

/** Empty form, used as the react-hook-form default so inputs start controlled. */
export const CREATE_DOCUMENT_FORM_DEFAULT_VALUES: CreateDocumentFormValues = {
  title: '',
  description: '',
};
