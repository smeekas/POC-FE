import { Box, Flex, Separator, Text } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

import styles from './Sidebar.module.css';

export type SidebarNavItem = {
  to: string;
  label: string;
  icon?: ReactNode;
  /** Highlights only on an exact path match, for a row that is the root of a section. */
  end?: boolean;
};

export type SidebarProps = {
  items: SidebarNavItem[];
  /** Caption above the rows, e.g. `Workspace`. */
  navLabel?: string;
  /** Sits above the nav: whose workspace or console this is. */
  header?: ReactNode;
  /** Sits at the bottom behind a separator: who is signed in. */
  footer?: ReactNode;
};

/**
 * The signed in shell's left hand column: a header slot, the rows it is given, and a
 * footer slot.
 *
 * It decides nothing about who sees what. The rows arrive already filtered, because
 * what a role is allowed to reach is the layout's question, not the sidebar's. That is
 * what lets one sidebar serve a tenant workspace and a platform admin console.
 */
export const Sidebar = ({ items, navLabel, header, footer }: SidebarProps) => {
  return (
    <Flex
      asChild
      direction={{ initial: 'row', sm: 'column' }}
      align={{ initial: 'center', sm: 'stretch' }}
      gap={{ initial: '4', sm: '5' }}
      p='4'
      className={styles.sidebar}
    >
      <aside>
        {header}

        <Flex asChild direction={{ initial: 'row', sm: 'column' }} gap='1'>
          <nav>
            {navLabel && (
              <Box display={{ initial: 'none', sm: 'block' }} mb='2'>
                <Text as='p' size='1' className={styles.navLabel}>
                  {navLabel}
                </Text>
              </Box>
            )}

            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : '']
                    .filter(Boolean)
                    .join(' ')
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Flex>

        {/* `mt='auto'` is what pins the footer to the bottom of a tall sidebar, so the
            separator has to stay a direct child of the column. */}
        {footer && (
          <>
            <Box display={{ initial: 'none', sm: 'block' }} mt='auto'>
              <Separator size='4' />
            </Box>

            {footer}
          </>
        )}
      </aside>
    </Flex>
  );
};

export default Sidebar;
