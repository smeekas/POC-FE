import type { ReactNode } from 'react';
import { useProfile } from '../context/ProfileContext';

type HasTagFeatureProps = {
  children: ReactNode;
};
export const HasTagFeature = ({ children }: HasTagFeatureProps) => {
  const { profile } = useProfile();
  if (profile?.plan?.tags) return children;
  return null;
};
