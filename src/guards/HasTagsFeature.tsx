import type { ReactNode } from 'react';
import { useTenantUser } from '../hooks/useTenantUser';

type HasTagFeatureProps = {
  children: ReactNode;
};
export const HasTagFeature = ({ children }: HasTagFeatureProps) => {
  const { profile } = useTenantUser();
  if (profile?.plan?.tags) return children;
  return null;
};
