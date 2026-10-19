import {
  Avatar,
  Box,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Outlet } from 'react-router';

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
  {
    to: ROUTE_PATHS.PROFILE_SETTINGS,
    label: 'Settings',
    role: [UserRole.MEMBER],
  },
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

            {/* Address over role, the quieter line second: two short lines fit the
                16rem column where one row of address, badge and icon could not. */}
            <Stack gap={0} display={{ base: 'none', sm: 'flex' }} miw={0}>
              {/* Not every address fits even a line of its own, so the full one stays
                  reachable on hover. */}
              <Text size='sm' fw={500} truncate title={profile?.email}>
                {profile?.email}
              </Text>
              {profile?.role && (
                <Text size='xs' c='dimmed' tt='capitalize' truncate>
                  {profile.role.toLowerCase()}
                </Text>
              )}
            </Stack>
          </Group>
        }
      />

      <Box component='main' p='xl'>
        <Outlet />
      </Box>
    </div>
  );
};
