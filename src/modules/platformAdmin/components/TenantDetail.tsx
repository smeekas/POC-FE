import {
  Anchor,
  Avatar,
  Badge,
  Breadcrumbs,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { Link, useSearchParams } from 'react-router';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import type { TenantDetailRes } from '../dto/detail.dto';

import styles from './TenantDetail.module.css';
import TenantFeatureList from './TenantFeatureList/TenantFeatureList';
import TenantFeatureListContainer from './TenantFeatureList/TenantFeatureListContainer';

type TenantDetailProps = {
  data: TenantDetailRes;
};

function TenantDetail({ data }: TenantDetailProps) {
  /* Avatar falls back to grey rather than the accent, so the tenant mark has to name the
     theme's primary colour explicitly for it to follow `theme.primaryColor`. */
  const { primaryColor } = useMantineTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const onTabChange = (value: string | null) => {
    if (!value) return;
    setSearchParams((prev) => {
      prev.set('tab', value);
      return prev;
    });
  };
  return (
    <div className={styles.container}>
      <header className={styles.band}>
        <Breadcrumbs className={styles.crumbs}>
          <Anchor
            component={Link}
            to={ROUTE_PATHS.PLATFORM_ADMIN_DASHBOARD}
            size='sm'
          >
            Tenants
          </Anchor>
          {/* The last crumb is the page already open, so it reads as text rather than
              offering a link back to itself. */}
          <Text size='sm' c='dimmed'>
            {data.name}
          </Text>
        </Breadcrumbs>

        <div className={styles.tenantInfo}>
          <Avatar radius='sm' size='xl' variant='filled' color={primaryColor}>
            {data.name[0]}
          </Avatar>

          <div className={styles.tenantName}>
            {/* No `size` override: the tenant name is the largest thing on the page, so
                it takes `h1` straight off the heading scale. */}
            <Title order={1}>{data.name}</Title>
            {/* A plan is a status, so it gets the same chip treatment the sidebar gives
                the admin's role. */}
            <Badge radius='full' variant='light'>
              {data.plan.name}
            </Badge>
          </div>
        </div>
      </header>

      <Tabs
        className={styles.tabs}
        defaultValue={searchParams.get('tab') || 'features'}
        onChange={onTabChange}
      >
        <Tabs.List className={styles.tabList}>
          <Tabs.Tab value='overview'>Overview</Tabs.Tab>
          <Tabs.Tab value='subscription'>Subscription history</Tabs.Tab>
          <Tabs.Tab value='features'>Features</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel className={styles.pane} value='overview'>
          Overview tab content
        </Tabs.Panel>

        <Tabs.Panel className={styles.pane} value='subscription'>
          Subscription history tab content
        </Tabs.Panel>

        <Tabs.Panel className={styles.pane} value='features'>
          <TenantFeatureListContainer  />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default TenantDetail;
