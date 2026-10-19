import { Button, Group, Modal, TextInput } from '@mantine/core';
import { CopyIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import toast from 'react-hot-toast';

import styles from './copyButton.module.css';

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
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title='Copy invitation link'
      size='450px'
      centered
    >
      <Group gap={0} wrap='nowrap'>
        <TextInput
          value={linkWithDomain}
          disabled
          classNames={{
            root: styles['copy-root'],
            input: styles['copy-input'],
          }}
        />
        <Button
          size='md'
          className={styles['copy-button']}
          aria-label='Copy invitation link'
          onClick={copyText}
        >
          <CopyIcon />
        </Button>
      </Group>

      <Group gap='sm' mt='md' justify='flex-end'>
        <Button type='button' variant='default' onClick={() => setOpen(false)}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}

export default CopyInvitationLink;
