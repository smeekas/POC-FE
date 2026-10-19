import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
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
import { useIsViewer } from '../hooks/useIsViewer';

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
  const isDisabled = useIsViewer(doc?.created_by);
  const isSaveBtnDisabled = editMode && isDisabled;
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
  const title = isSaveBtnDisabled ? 'View Document' : 'Edit document';
  return (
    <section>
      <PageHeader
        title={editMode ? title : 'Create document'}
        description={
          editMode
            ? isSaveBtnDisabled
              ? ''
              : 'Change the title or what this document holds.'
            : 'Give the document a title and say what it holds.'
        }
      />

      {isError ? (
        <Alert color='red' role='alert'>
          {getApiErrorMessage(error)}
        </Alert>
      ) : null}

      {isDocumentLoading ? (
        <Group align='center' gap='xs'>
          <Loader size='xs' />
          <Text size='sm' c='dimmed'>
            Loading document...
          </Text>
        </Group>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Controller
            name='title'
            control={control}
            render={({ field, fieldState }) => (
              <TextInput
                id='document-title'
                label='Title'
                disabled={isSaveBtnDisabled}
                placeholder='Quarterly report'
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <Controller
            name='description'
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                id='document-description'
                label='Description'
                disabled={isSaveBtnDisabled}
                rows={6}
                placeholder='What is this document about?'
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <HasTagFeature>
            <Controller
              name='tags'
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  id='document-tag'
                  label='Tags'
                  disabled={isSaveBtnDisabled}
                  placeholder='comma separated tags'
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Group gap='2xs' wrap='wrap'>
              {allTags.map((item) => {
                return (
                  <Badge key={item} variant='outline'>
                    {item}
                  </Badge>
                );
              })}
            </Group>
          </HasTagFeature>
          <div className={styles.actions}>
            <div className={styles.primaryActions}>
              <Button
                type='submit'
                loading={isPending}
                disabled={isSaveBtnDisabled}
              >
                Save
              </Button>

              <Button
                type='button'
                variant='default'
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
            {docId !== null && doc && (
              <DeleteButton
                id={doc.created_by}
                docId={docId}
                disabled={isPending}
              />
            )}
          </div>
        </form>
      )}
    </section>
  );
};

export default CreateDocumentPage;
