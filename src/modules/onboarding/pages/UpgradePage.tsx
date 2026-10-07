import { Button } from '@radix-ui/themes';
import { usePlansQuery } from '../hooks/usePlansQuery';
import styles from './Upgrade.module.css';
import Plans from '../components/Plans';
import { usePlanUsage } from '../hooks/usePlanUsage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { useNavigate } from 'react-router';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import type { APIResponse } from '../../../types/common.types';
import { QueryKey } from '../../../constants/queryKey';

function UpgradePage() {
  const { data, isLoading, isError } = usePlansQuery();
  const { data: planUsage, isLoading: isPlanLoading } = usePlanUsage();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, variables } = useMutation({
    mutationFn: (reqBody: { planId: number }) =>
      axiosInstance.post<APIResponse<null>>(API_ENDPOINTS.CHANGE_PLAN, reqBody),
    onSuccess: async (data) => {
      if (data.status === 204) {
        await qc.invalidateQueries({ queryKey: [QueryKey.PROFILE_CONTEXT] });
        navigate(ROUTE_PATHS.DASHBOARD);
      }
    },
  });
  const plans = data?.data?.data ?? [];

  const currentPlan = plans.find((plan) => plan.is_free);

  const onUpgrade = (planId: number) => {
    mutate({ planId });
  };
  const onCta = () => {
    navigate(ROUTE_PATHS.DASHBOARD);
  };
  if (isLoading) return <p>Loading plans…</p>;

  if (isError) return <p>Could not load the plans. Please try again.</p>;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <p className={styles.eyebrow}>Upgrade your plan</p>

          <h1 className={styles.heading}>
            {currentPlan ? (
              <>
                You are on the{' '}
                <span className={styles.planName}>
                  {currentPlan.name.toLowerCase()}
                </span>{' '}
                plan
              </>
            ) : (
              'Choose a plan'
            )}
          </h1>

          {currentPlan && !isPlanLoading && planUsage && (
            <p className={styles.usage}>
              <span>
                {planUsage.data.data.user} / {currentPlan.max_user} users
              </span>
              <span>
                {planUsage.data.data.document} / {currentPlan.max_documents}{' '}
                documents
              </span>
              <span>{currentPlan.tags ? 'Tags on documents' : 'No tags'}</span>
            </p>
          )}
        </div>
        <Button variant='ghost' onClick={onCta}>
          Go to dashboard
        </Button>
      </header>

      <Plans
        plans={plans}
        currentPlanId={currentPlan?.id}
        onUpgrade={onUpgrade}
        isPending={
          variables?.planId && isPending
            ? { planId: variables?.planId }
            : undefined
        }
      />

      <p className={styles.tagline}>
        Pick the limits that fit your team. You can change plan later.
      </p>
    </section>
  );
}

export default UpgradePage;
