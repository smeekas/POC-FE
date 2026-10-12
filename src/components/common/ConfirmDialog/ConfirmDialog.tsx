import { AlertDialog, Button, Flex } from '@radix-ui/themes';

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
 * Built on `AlertDialog` rather than `Dialog`, so it cannot be dismissed by clicking
 * away from it: answering is the only way out, which is the point of asking.
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
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        {description && (
          <AlertDialog.Description size='2'>
            {description}
          </AlertDialog.Description>
        )}

        <Flex gap='3' mt='4' justify='end'>
          <AlertDialog.Cancel>
            <Button variant='soft' color='gray' disabled={loading}>
              {cancelLabel}
            </Button>
          </AlertDialog.Cancel>

          <Button
            color={destructive ? 'red' : undefined}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ConfirmDialog;
