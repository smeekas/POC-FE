import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Button, Flex, Text } from '@radix-ui/themes';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
import { FormField } from '../../../components/form/FormField';
import { Alert } from '../../../components/ui/Alert';
import { Spinner } from '../../../components/ui/Spinner';
import { TextArea } from '../../../components/ui/TextArea';
import { TextInput } from '../../../components/ui/TextInput';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import {
  CREATE_DOCUMENT_FORM_DEFAULT_VALUES,
  createDocumentFormSchema,
  type CreateDocumentFormValues,
} from '../../../schema/document';
import { getApiErrorMessage } from '../../../utils/error';
import DeleteButton from '../components/DeleteButton';
import useCreateDocument from '../hooks/useCreateDocument';
import useGetDocument from '../hooks/useGetDocument';
import useUpdateDocument from '../hooks/useUpdateDocument';

import styles from './CreateDocumentPage.module.css';
import { HasTagFeature } from '../../../guards/HasTagsFeature';
import { usePlan } from '../../../hooks/usePlan';

/**
 * The one form behind both creating and editing a document.
 *
 * An `:id` in the route is the whole difference: with one the form fills itself from
 * the document and saves over it, without one it starts empty and creates.
 */
export const CreateDocumentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tags: hasTags } = usePlan();
  const docId = !id ? null : +id;
  const editMode = !!docId;

  const { data: docData, isLoading: isDocumentLoading } = useGetDocument(docId);
  const doc = docData?.data?.data;

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument(docId);
  const { isPending, isError, error } = editMode
    ? updateDocument
    : createDocument;

  /* `values` rather than `defaultValues` for the document: the fetch resolves after the
     first render, and only `values` re-seeds the form when it lands. */
  const { control, handleSubmit, watch } = useForm<CreateDocumentFormValues>({
    resolver: zodResolver(createDocumentFormSchema),
    defaultValues: CREATE_DOCUMENT_FORM_DEFAULT_VALUES,
    values: doc
      ? {
          title: doc.title,
          description: doc.description,
          tags: doc.tags?.join(','),
        }
      : undefined,
  });
  const formTags = watch('tags');
  let allTags =
    formTags
      ?.split(',')
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean) || [];
  allTags = [...new Set(allTags).values()];
  /* Saved or created, the document is only visible in the list, so that is where the
     user is sent. */
  const onSubmit = handleSubmit((values) => {
    const { tags: _, ...rest } = values;
    const onSaved = (message: string) => {
      toast.success(message);
      navigate(ROUTE_PATHS.DOCUMENTS);
    };

    if (editMode) {
      updateDocument.mutate(
        { ...rest, tags: hasTags ? allTags : undefined },
        {
          onSuccess: (res) => onSaved(res.data.statusMessage),
        },
      );
      return;
    }

    createDocument.mutate(
      { ...rest, tags: hasTags ? allTags : undefined },
      {
        onSuccess: (res) => onSaved(res.data.statusMessage),
      },
    );
  });

  return (
    <section>
      <PageHeader
        title={editMode ? 'Edit document' : 'Create document'}
        description={
          editMode
            ? 'Change the title or what this document holds.'
            : 'Give the document a title and say what it holds.'
        }
      />

      {isError ? (
        <Alert severity='error'>{getApiErrorMessage(error)}</Alert>
      ) : null}

      {isDocumentLoading ? (
        <Flex align='center' gap='2'>
          <Spinner size='small' />
          <Text size='2' color='gray'>
            Loading document...
          </Text>
        </Flex>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Controller
            name='title'
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId='document-title'
                label='Title'
                error={fieldState.error?.message}
              >
                <TextInput
                  id='document-title'
                  name={field.name}
                  value={field.value}
                  placeholder='Quarterly report'
                  invalid={fieldState.invalid}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />

          <Controller
            name='description'
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId='document-description'
                label='Description'
                error={fieldState.error?.message}
              >
                <TextArea
                  id='document-description'
                  name={field.name}
                  value={field.value}
                  rows={6}
                  placeholder='What is this document about?'
                  invalid={fieldState.invalid}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />
          <HasTagFeature>
            <Controller
              name='tags'
              control={control}
              render={({ field, fieldState }) => (
                <FormField
                  inputId='document-tag'
                  label='Tags'
                  error={fieldState.error?.message}
                >
                  <TextInput
                    id='document-tag'
                    name={field.name}
                    value={field.value}
                    placeholder='comma separated tags'
                    invalid={fieldState.invalid}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormField>
              )}
            />
            <Flex gap='1' wrap='wrap'>
              {allTags.map((item) => {
                return (
                  <Badge key={item} variant='outline'>
                    {item}
                  </Badge>
                );
              })}
            </Flex>
          </HasTagFeature>
          <div className={styles.actions}>
            <div className={styles.primaryActions}>
              <Button type='submit' loading={isPending}>
                Save
              </Button>

              <Button
                type='button'
                variant='soft'
                color='gray'
                disabled={isPending}
                onClick={() => navigate(ROUTE_PATHS.DOCUMENTS)}
              >
                Cancel
              </Button>
            </div>

            {/* Pushed to the far edge rather than queued up as a third button: delete
                undoes the page instead of completing it, so it should not sit where a
                hand aiming for Save can land on it. Only an existing document has
                anything to delete. */}
            {docId !== null && (
              <DeleteButton docId={docId} disabled={isPending} />
            )}
          </div>
        </form>
      )}
    </section>
  );
};

export default CreateDocumentPage;
