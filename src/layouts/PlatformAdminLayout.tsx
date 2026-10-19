import {
  Avatar,
  Badge,
  Box,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Outlet } from 'react-router';

import { Sidebar } from '../components/common/Sidebar/Sidebar';
import { ROUTE_PATHS } from '../constants/routePaths';
import { useProfile } from '../context/ProfileContext';

import styles from './PlatformAdminLayout.module.css';

/* The admin console sits above every tenant, so there is no workspace name to show in
   its place. */
const PLATFORM_NAME = 'Platform';

const NAV_ITEMS = [
  { to: ROUTE_PATHS.PLATFORM_ADMIN_DASHBOARD, label: 'Dashboard' },
  { to: ROUTE_PATHS.PLATFORM_ADMIN_SETTINGS, label: 'Settings' },
];

/**
 * Shell for the platform admin console: the same sidebar the tenant app uses, handed a
 * different header, a different set of rows, and the admin's own account block.
 */
export const PlatformAdminLayout = () => {
  const { profile } = useProfile();
  /* Avatar falls back to grey rather than the accent, so the brand mark has to name the
     theme's primary colour explicitly for it to follow `theme.primaryColor`. */
  const { primaryColor } = useMantineTheme();

  return (
    <div className={styles.shell}>
      <Sidebar
        items={NAV_ITEMS}
        navLabel='Platform'
        header={
          <Group align='center' gap='xs' p='xs' wrap='nowrap'>
            <Avatar size='md' color={primaryColor} variant='filled'>
              {PLATFORM_NAME[0]}
            </Avatar>
            {/* The role is part of the identity here rather than a detail in the
                footer: it is the whole reason this console looks different. */}
            <Stack align='flex-start' miw={0} gap='2xs'>
              <Text size='md' fw={700} truncate>
                {PLATFORM_NAME}
              </Text>
              {/* No `color`: Badge already falls back to `theme.primaryColor`. */}
              <Badge radius='full' variant='light'>
                Platform admin
              </Badge>
            </Stack>
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
              {/* Not every address fits the 16rem column, so the full one stays
                  reachable on hover. */}
              <Text size='sm' fw={500} truncate title={profile?.email}>
                {profile?.email}
              </Text>
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

export default PlatformAdminLayout;
