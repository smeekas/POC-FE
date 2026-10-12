import { GearIcon } from '@radix-ui/react-icons';
import { Avatar, Badge, Box, Button, Flex, Grid, Text } from '@radix-ui/themes';
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

  /* Filtered here rather than inside the sidebar: who may reach what is this shell's
     question, and the sidebar only draws the rows it is handed. */
  const navItems = NAV_ITEMS.filter((navItem) => {
    if (profile?.role === UserRole.ADMIN) return true;
    return profile?.role && navItem.role.includes(profile.role);
  });

  return (
    <Grid
      columns={{ initial: 'minmax(0, 1fr)', sm: '16rem minmax(0, 1fr)' }}
      minHeight='100%'
    >
      <Sidebar
        items={navItems}
        navLabel='Workspace'
        header={
          <Flex asChild align='center' gap='2' p='2'>
            <NavLink to={ROUTE_PATHS.DASHBOARD} className={styles.tenant}>
              <Avatar
                size='2'
                variant='solid'
                fallback={profile?.tenant?.name?.[0] || ''}
              />
              <Text size='3' weight='bold' truncate>
                {profile?.tenant?.name}
              </Text>
            </NavLink>
          </Flex>
        }
        footer={
          <Flex
            align='center'
            gap='2'
            pt={{ initial: '0', sm: '3' }}
            ml={{ initial: 'auto', sm: '0' }}
          >
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
              <Text size='1' color='gray' truncate>
                {profile?.email}
              </Text>
            </Flex>

            {profile?.role && (
              <Badge radius='full' variant='soft'>
                {profile.role}
              </Badge>
            )}

            {/* The icon says nothing to a screen reader, so the link carries the name. */}
            <Button asChild size={'1'} variant='ghost'>
              <NavLink
                to={ROUTE_PATHS.PROFILE_SETTINGS}
                aria-label='Profile settings'
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
