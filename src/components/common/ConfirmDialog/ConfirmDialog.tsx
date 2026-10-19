import { Button, Group, Modal, Text } from '@mantine/core';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Text on the confirming button. */
  confirmLabel?: string;
  /** Text on the dismissing button. */
  cancelLabel?: string;
  /** Paints the confirming button red, for anything that destroys or undoes. */
  destructive?: boolean;
  /** Keeps the dialog up with a spinner while the action it started is in flight. */
  loading?: boolean;
  onConfirm: () => void;
};

/**
 * Asks before something that cannot be taken back.
 *
 * It cannot be dismissed by clicking away from it: answering is the only way out,
 * which is the point of asking. While the action it started is in flight it cannot be
 * dismissed at all.
 *
 * The confirming button does not close the dialog by itself. The caller closes it, so a
 * request can be awaited under `loading` and the dialog can stay up if it fails.
 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  destructive = false,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) => {
  return (
    <Modal
      opened={open}
      onClose={() => onOpenChange(false)}
      title={title}
      size='450px'
      centered
      closeOnClickOutside={false}
      closeOnEscape={!loading}
      withCloseButton={!loading}
    >
      {description && (
        <Text size='sm' c='dimmed'>
          {description}
        </Text>
      )}

      <Group gap='sm' mt='md' justify='flex-end'>
        <Button
          variant='default'
          disabled={loading}
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </Button>

        <Button
          color={destructive ? 'red' : undefined}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmDialog;
