import { GearIcon } from '@radix-ui/react-icons';
import { Avatar, Badge, Box, Button, Flex, Grid, Text } from '@radix-ui/themes';
import { NavLink, Outlet } from 'react-router';

import { Sidebar } from '../components/common/Sidebar/Sidebar';
import { ROUTE_PATHS } from '../constants/routePaths';
import { useProfile } from '../context/ProfileContext';

import styles from './PlatformAdminLayout.module.css';

/* The admin console sits above every tenant, so there is no workspace name to show in
   its place. */
const PLATFORM_NAME = 'Platform';

const NAV_ITEMS = [
  { to: ROUTE_PATHS.PLATFORM_ADMIN_DASHBOARD, label: 'Dashboard' },
];

/**
 * Shell for the platform admin console: the same sidebar the tenant app uses, handed a
 * different header, a different set of rows, and the admin's own account block.
 */
export const PlatformAdminLayout = () => {
  const { profile } = useProfile();

  return (
    <Grid
      columns={{ initial: 'minmax(0, 1fr)', sm: '16rem minmax(0, 1fr)' }}
      minHeight='100%'
    >
      <Sidebar
        items={NAV_ITEMS}
        navLabel='Platform'
        header={
          <Flex asChild align='center' gap='2' p='2'>
            <NavLink
              to={ROUTE_PATHS.PLATFORM_ADMIN_DASHBOARD}
              className={styles.brand}
            >
              <Avatar size='2' variant='solid' fallback={PLATFORM_NAME[0]} />

              {/* The role is part of the identity here rather than a detail in the
                  footer: it is the whole reason this console looks different. */}
              <Flex direction='column' align='start' minWidth='0' gap='1'>
                <Text size='3' weight='bold' truncate>
                  {PLATFORM_NAME}
                </Text>
                <Badge radius='full' variant='soft' color='purple'>
                  Platform admin
                </Badge>
              </Flex>
            </NavLink>
          </Flex>
        }
        footer={
          <Flex
            align='center'
            justify={'between'}
            gap='2'
            pt={{ initial: '0', sm: '3' }}
            ml={{ initial: 'auto', sm: '0' }}
          >
            <Flex align={'center'} gap={'2'}>
              <Avatar
                size='2'
                radius='full'
                color='gray'
                fallback={profile?.email[0] || ''}
              />

              <Flex
                direction='column'
                display={{ initial: 'none', sm: 'flex' }}
                minWidth='0'
              >
                <Text size='2' weight='medium' truncate>
                  {profile?.email}
                </Text>
              </Flex>
            </Flex>
            {/* The icon says nothing to a screen reader, so the link carries the name. */}
            <Button asChild size='1' variant='ghost'>
              <NavLink
                to={ROUTE_PATHS.PLATFORM_ADMIN_SETTINGS}
                aria-label='Platform admin settings'
              >
                <GearIcon />
              </NavLink>
            </Button>
          </Flex>
        }
      />

      <Box asChild p='6'>
        <main>
          <Outlet />
        </main>
      </Box>
    </Grid>
  );
};

export default PlatformAdminLayout;
