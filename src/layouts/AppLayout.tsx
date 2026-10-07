import { Avatar, Badge, Box, Flex, Grid, Separator, Text } from '@radix-ui/themes';
import { NavLink, Outlet } from 'react-router';

import { ROUTE_PATHS } from '../constants/routePaths';
import { useProfile } from '../context/ProfileContext';

import styles from './AppLayout.module.css';

/* Stand-ins until the tenant name and the user's display name come back from the API. */
const DUMMY_TENANT_NAME = 'Acme Workspace';
const DUMMY_USER_NAME = 'Alex Morgan';

const NAV_ITEMS = [
  { to: ROUTE_PATHS.DOCUMENTS, label: 'Documents' },
  { to: ROUTE_PATHS.MEMBERS, label: 'Members' },
];

/** Signed in shell: tenant and navigation on the left, the routed page on the right. */
export const AppLayout = () => {
  const { profile } = useProfile();

  return (
    <Grid
      columns={{ initial: 'minmax(0, 1fr)', sm: '16rem minmax(0, 1fr)' }}
      minHeight='100%'
    >
      <Flex
        asChild
        direction={{ initial: 'row', sm: 'column' }}
        align={{ initial: 'center', sm: 'stretch' }}
        gap={{ initial: '4', sm: '5' }}
        p='4'
        className={styles.sidebar}
      >
        <aside>
          <Flex asChild align='center' gap='2' p='2'>
            <NavLink to={ROUTE_PATHS.DASHBOARD} className={styles.tenant}>
              <Avatar
                size='2'
                variant='solid'
                fallback={DUMMY_TENANT_NAME.charAt(0)}
              />
              <Text size='3' weight='bold' truncate>
                {DUMMY_TENANT_NAME}
              </Text>
            </NavLink>
          </Flex>

          <Flex
            asChild
            direction={{ initial: 'row', sm: 'column' }}
            gap='1'
          >
            <nav>
              <Box display={{ initial: 'none', sm: 'block' }} mb='2'>
                <Text as='p' size='1' className={styles.navLabel}>
                  Workspace
                </Text>
              </Box>

              {NAV_ITEMS.map((navItem) => (
                <NavLink
                  key={navItem.to}
                  to={navItem.to}
                  className={({ isActive }) =>
                    [styles.navLink, isActive ? styles.navLinkActive : '']
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  {navItem.label}
                </NavLink>
              ))}
            </nav>
          </Flex>

          <Box display={{ initial: 'none', sm: 'block' }} mt='auto'>
            <Separator size='4' />
          </Box>

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
              fallback={DUMMY_USER_NAME.charAt(0)}
            />

            <Flex
              direction='column'
              display={{ initial: 'none', sm: 'flex' }}
              minWidth='0'
            >
              <Text size='2' weight='medium' truncate>
                {DUMMY_USER_NAME}
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
          </Flex>
        </aside>
      </Flex>

      <Box asChild p='6'>
        <main>
          <Outlet />
        </main>
      </Box>
    </Grid>
  );
};
