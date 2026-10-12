import {
  Badge,
  Button,
  Dialog,
  Flex,
  Heading,
  SegmentedControl,
} from '@radix-ui/themes';

import DataTable from '../../../components/common/DataTable/DataTable';
import { getInvitedMemberColumns } from '../columns/invitedMembers.columns';
import { useGetInvitedMembers } from '../hooks/useGetInvitedMembers';
import { PlusIcon } from '@radix-ui/react-icons';
import { FormField } from '../../../components/form/FormField';
import { TextInput } from '../../../components/ui/TextInput';
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
      <Flex asChild direction='column' gap='3' mt='6'>
        <section>
          <Flex justify='between'>
            <Flex align='center' gap='2'>
              <Heading as='h2' size='4' trim='start'>
                Pending invitations
              </Heading>

              <Badge radius='full' color='gray'>
                {invitations.length}
              </Badge>
            </Flex>
            <Dialog.Root open={open} onOpenChange={handleOpenChange}>
              <Dialog.Trigger>
                <Button>
                  <PlusIcon /> Invite
                </Button>
              </Dialog.Trigger>
              <Dialog.Content maxWidth='450px'>
                <Dialog.Title>Invite user</Dialog.Title>

                {/* `noValidate` hands validation to zod, so the browser does not pop its
                    own bubble over the field error. */}
                <form onSubmit={onSubmit} noValidate>
                  <Flex gap={'2'} direction={'column'}>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field, fieldState }) => (
                        <FormField
                          inputId='invite-email'
                          label='Email'
                          error={fieldState.error?.message}
                        >
                          <TextInput
                            id='invite-email'
                            type='email'
                            placeholder='abc@org.com'
                            autoComplete='email'
                            invalid={fieldState.invalid}
                            {...field}
                          />
                        </FormField>
                      )}
                    />
                    <Controller
                      name='role'
                      control={control}
                      render={({ field, fieldState }) => (
                        <FormField
                          inputId='invite-role'
                          label='Role'
                          error={fieldState.error?.message}
                        >
                          <SegmentedControl.Root
                            id='invite-role'
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SegmentedControl.Item value={UserRole.MEMBER}>
                              MEMBER
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value={UserRole.ADMIN}>
                              ADMIN
                            </SegmentedControl.Item>
                          </SegmentedControl.Root>
                        </FormField>
                      )}
                    />

                    {/* Two roles, one of them always picked: a segmented control says that
                better than a radio list does. */}
                  </Flex>
                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button
                        disabled={isPending}
                        type='button'
                        variant='soft'
                        color='gray'
                      >
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button
                      type='submit'
                      loading={isPending}
                      disabled={isSuccess}
                    >
                      send
                    </Button>
                  </Flex>
                </form>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
          <DataTable
            loading={isLoading || isRefetching}
            columns={columns}
            row={invitations}
          />
        </section>
      </Flex>
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
