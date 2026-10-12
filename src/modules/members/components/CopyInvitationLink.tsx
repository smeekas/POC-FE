import { Button, Dialog, Flex } from '@radix-ui/themes';
import { useState } from 'react';
import { TextInput } from '../../../components/ui/TextInput';
import { CopyIcon } from '@radix-ui/react-icons';
import styles from './copyBotton.module.css';
import toast from 'react-hot-toast';
type CopyInvitationLinkProps = {
  link: string | undefined;
};
function CopyInvitationLink({ link }: CopyInvitationLinkProps) {
  const [open, setOpen] = useState(!!link);
  const linkWithDomain = `${window.location.host}${link}`;
  async function copyText() {
    try {
      await navigator.clipboard.writeText(linkWithDomain);
      toast.success('link copied!');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.log(err);
    }
  }
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) setOpen(false);
      }}
    >
      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>Copy invitation link</Dialog.Title>

        <Flex>
          <TextInput
            value={linkWithDomain}
            disabled
            className={styles['copy-input']}
          />
          <Button
            size={'3'}
            className={styles['copy-button']}
            onClick={copyText}
          >
            <CopyIcon />
          </Button>
        </Flex>
        <Flex gap='3' mt='4' justify='end'>
          <Dialog.Close>
            <Button type='button' variant='soft' color='gray'>
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default CopyInvitationLink;
