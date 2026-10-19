import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { GearIcon } from '@radix-ui/react-icons';
import { NavLink, Outlet } from 'react-router';

import { Sidebar } from '../components/common/Sidebar/Sidebar';
import { UserRole } from '../constants/role';
import { ROUTE_PATHS } from '../constants/routePaths';
import { useTenantUser } from '../hooks/useTenantUser';

import styles from './AppLayout.module.css';

const NAV_ITEMS = [
  {
    to: ROUTE_PATHS.DOCUMENTS,
    label: 'Documents',
    role: [UserRole.MEMBER],
  },
  { to: ROUTE_PATHS.MEMBERS, label: 'Members', role: [] as UserRole[] },
];

/** Signed in shell: tenant and navigation on the left, the routed page on the right. */
export const AppLayout = () => {
  const { profile } = useTenantUser();
  /* Avatar falls back to grey rather than the accent, so the brand mark has to name the
     theme's primary colour explicitly for it to follow `theme.primaryColor`. */
  const { primaryColor } = useMantineTheme();

  /* Filtered here rather than inside the sidebar: who may reach what is this shell's
     question, and the sidebar only draws the rows it is handed. */
  const navItems = NAV_ITEMS.filter((navItem) => {
    if (profile?.role === UserRole.ADMIN) return true;
    return profile?.role && navItem.role.includes(profile.role);
  });

  return (
    <div className={styles.shell}>
      <Sidebar
        items={navItems}
        navLabel='Workspace'
        header={
          <Group align='center' gap='xs' p='xs' wrap='nowrap'>
            <Avatar size='md' color={primaryColor} variant='filled'>
              {profile?.tenant?.name?.[0] || ''}
            </Avatar>
            <Text size='md' fw={700} truncate>
              {profile?.tenant?.name}
            </Text>
          </Group>
        }
        footer={
          <Group
            align='center'
            gap='xs'
            wrap='nowrap'
            pt={{ base: 0, sm: 'sm' }}
            ml={{ base: 'auto', sm: 0 }}
          >
            <Avatar size='md' radius='full' color='gray'>
              {profile?.email[0] || ''}
            </Avatar>

            <Stack gap={0} display={{ base: 'none', sm: 'flex' }} miw={0}>
              <Text size='sm' fw={500} truncate>
                {profile?.email}
              </Text>
              <Text size='xs' c='dimmed' truncate>
                {profile?.email}
              </Text>
            </Stack>

            {profile?.role && (
              <Badge radius='full' variant='light'>
                {profile.role}
              </Badge>
            )}

            {/* The icon says nothing to a screen reader, so the link carries the name. */}
            <ActionIcon
              component={NavLink}
              to={ROUTE_PATHS.PROFILE_SETTINGS}
              aria-label='Profile settings'
              variant='subtle'
              color='gray'
            >
              <GearIcon />
            </ActionIcon>
          </Group>
        }
      />

      <Box component='main' p='xl'>
        <Outlet />
      </Box>
    </div>
  );
};
