import { TrashIcon } from '@radix-ui/react-icons';
import { Button } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import { getApiErrorMessage } from '../../../utils/error';
import useDeleteDocument from '../hooks/useDeleteDocument';
import { withViewerControl } from '../../../hoc/withViewerControl';

export type DeleteButtonProps = {
  docId: number;
  /** Greys the button out while something else on the page is mid flight. */
  disabled?: boolean;
};

/**
 * Deletes a document, start to finish: the caller passes an id and places the button,
 * and everything between the click and the redirect is handled here.
 *
 * Drawn as a quiet red ghost rather than a third solid button, because a destructive
 * action should be findable without competing with the one the page is actually for.
 */
export const DeleteButton = ({
  docId,
  disabled = false,
}: DeleteButtonProps) => {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending } = useDeleteDocument();

  const handleConfirm = () => {
    mutate(docId, {
      onSuccess: (res) => {
        toast.success(res.data.statusMessage);
        /* The document this page was editing no longer exists, so staying on it would
           leave the form pointed at nothing. */
        navigate(ROUTE_PATHS.DOCUMENTS);
      },
      /* The dialog is left open on failure: the message says what went wrong, and the
         confirming button is still there to try again. */
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <>
      <Button
        type='button'
        variant='subtle'
        color='red'
        leftSection={<TrashIcon width={16} height={16} />}
        disabled={disabled || isPending}
        onClick={() => setConfirming(true)}
      >
        Delete
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        onConfirm={handleConfirm}
        loading={isPending}
        destructive
        title='Delete this document?'
        description='The document and everything in it will be removed. This cannot be undone.'
        confirmLabel='Delete'
        cancelLabel='Cancel'
      />
    </>
  );
};

const ViewerControlledButton = withViewerControl(DeleteButton);
export default ViewerControlledButton;
