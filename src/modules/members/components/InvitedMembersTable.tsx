import {
  Badge,
  Button,
  Group,
  Input,
  Modal,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';

import DataTable from '../../../components/common/DataTable/DataTable';
import { getInvitedMemberColumns } from '../columns/invitedMembers.columns';
import { useGetInvitedMembers } from '../hooks/useGetInvitedMembers';
import { PlusIcon } from '@radix-ui/react-icons';
import { UserRole } from '../../../constants/role';
import {
  INVITE_FORM_DEFAULT_VALUES,
  inviteFormSchema,
  type InviteFormValues,
} from '../../../schema/invite';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import useSendInvitation from '../hooks/useSendInvitation';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { useModalState } from '../../../hooks/useModalState';
import {
  InviteMemberUpdateEnum,
  type InvitedMemberItem,
} from '../dto/invitedMembers.dto';
import useChangeStatus from '../hooks/useChangeStatus';
import CopyInvitationLink from './CopyInvitationLink';
import { ActionButton } from '../../../components/ui/ActionButton';

/**
 * Invites that have gone out but not yet turned into members, with the count beside the
 * heading so the size of the backlog is readable without counting rows.
 */
export const InvitedMembersTable = () => {
  const { data, isLoading, isRefetching } = useGetInvitedMembers();
  const invitations = data?.data?.data || [];
  const [open, setOpen] = useState(false);
  const {
    mutate,
    isPending,
    isSuccess,
    data: invitationResponse,
  } = useSendInvitation();
  const {
    mutate: changeStatusMutation,
    isPending: statusChangePending,
    data: statusUpdateResponse,
  } = useChangeStatus();
  const [revoke, handleRevokeOpen, handleRevokeClose] =
    useModalState<InvitedMemberItem>();

  const [resend, handleResendOpen, handleResendClose] =
    useModalState<InvitedMemberItem>();
  /* Awaiting the revoke and resend endpoints: the menu is wired, the calls are not. */
  const columns = getInvitedMemberColumns({
    onResend: (user) => {
      handleResendOpen(user);
    },
    onRevoke: (user) => {
      handleRevokeOpen(user);
    },
  });

  const { control, handleSubmit, reset } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: INVITE_FORM_DEFAULT_VALUES,
  });

  /* The next invite starts from an empty field rather than the last one typed. */
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) reset(INVITE_FORM_DEFAULT_VALUES);
  };

  const onSubmit = handleSubmit((values) => {
    mutate(
      { email: values.email, role: values.role },
      {
        onSuccess(data) {
          if (data.status === 201) {
            toast.success(data.data.statusMessage);
            if (resend) handleResendClose();
            else setOpen(false);
          }
        },
        onError(error) {
          if (isAxiosError(error)) {
            toast.error(error.response?.data?.message);
          }
        },
      },
    );
  });

  const onConfirm = (id: number, status: InviteMemberUpdateEnum) => {
    changeStatusMutation(
      { id, reqStatus: status },
      {
        onSuccess(data) {
          if (data.status === 200) {
            toast.success(data.data.statusMessage);
            if (revoke) handleRevokeClose();
            if (resend) handleResendClose();
          }
        },
        onError(error) {
          if (isAxiosError(error)) {
            toast.error(error.response?.data?.message);
          }
        },
      },
    );
  };
  const link =
    invitationResponse?.data.data.url || statusUpdateResponse?.data.data?.url;
  return (
    <>
      <Stack component='section' gap='sm' mt='xl'>
        <Group justify='space-between'>
          <Group align='center' gap='xs'>
            <Title order={2} size='lg'>
              Pending invitations
            </Title>

            <Badge radius='full' color='gray'>
              {invitations.length}
            </Badge>
          </Group>

          <ActionButton
            feature='user'
            leftSection={<PlusIcon />}
            onClick={() => handleOpenChange(true)}
          >
            Invite
          </ActionButton>

          <Modal
            opened={open}
            onClose={() => handleOpenChange(false)}
            title='Invite user'
            size='450px'
            centered
          >
            {/* `noValidate` hands validation to zod, so the browser does not pop its
                own bubble over the field error. */}
            <form onSubmit={onSubmit} noValidate>
              <Stack gap='xs'>
                <Controller
                  name='email'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      id='invite-email'
                      label='Email'
                      type='email'
                      placeholder='abc@org.com'
                      autoComplete='email'
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />

                {/* Two roles, one of them always picked: a segmented control says that
                    better than a radio list does. */}
                <Controller
                  name='role'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input.Wrapper
                      id='invite-role'
                      label='Role'
                      error={fieldState.error?.message}
                    >
                      <SegmentedControl
                        id='invite-role'
                        fullWidth
                        value={field.value}
                        onChange={field.onChange}
                        data={[
                          { label: 'MEMBER', value: UserRole.MEMBER },
                          { label: 'ADMIN', value: UserRole.ADMIN },
                        ]}
                      />
                    </Input.Wrapper>
                  )}
                />
              </Stack>

              <Group gap='sm' mt='md' justify='flex-end'>
                <Button
                  disabled={isPending}
                  type='button'
                  variant='default'
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' loading={isPending} disabled={isSuccess}>
                  send
                </Button>
              </Group>
            </form>
          </Modal>
        </Group>

        <DataTable
          loading={isLoading || isRefetching}
          columns={columns}
          row={invitations}
        />
      </Stack>
      <ConfirmDialog
        onOpenChange={(open) => {
          if (!open) handleRevokeClose();
        }}
        onConfirm={() => {
          if (revoke) {
            onConfirm(revoke.id, InviteMemberUpdateEnum.Revoke);
          }
        }}
        destructive
        loading={statusChangePending}
        open={revoke !== null}
        title='Are you sure?'
        description={
          revoke ? `invitation will be revoked for ${revoke?.email}` : ''
        }
      />
      <ConfirmDialog
        onOpenChange={(open) => {
          if (!open) handleResendClose();
        }}
        onConfirm={() => {
          if (resend) {
            onConfirm(resend.id, InviteMemberUpdateEnum.Resend);
          }
        }}
        loading={statusChangePending}
        open={resend !== null}
        title='Are you sure?'
        description={
          resend ? `invitation will be re-sent to ${resend?.email}` : ''
        }
      />
      <CopyInvitationLink link={link} key={link || ''} />
    </>
  );
};
