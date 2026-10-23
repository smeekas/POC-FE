import { useTenantUser } from '../../../hooks/useTenantUser';
import { useChangePlan } from '../hooks/useChangePlan';
import { usePlansQuery } from '../hooks/usePlansQuery';
import Plans from './Plans';

export type PlanSelectionProps = {
  /** Runs once the change has gone through and the profile has been refetched. */
  onChanged?: () => void;
};

/**
 * Every plan on offer, with the tenant's own marked and the rest switchable.
 *
 * Fetching, the current plan match and the change itself all live here so that a screen
 * only has to decide where to put the cards and what to do afterwards.
 */
export const PlanSelection = ({ onChanged }: PlanSelectionProps) => {
  const { profile } = useTenantUser();
  const { data, isLoading, isError } = usePlansQuery();
  const { mutate, isPending, variables } = useChangePlan();

  const plans = data?.data?.data ?? [];

  const handleUpgrade = (planId: number) => {
    mutate(
      { planId },
      {
        onSuccess: (response) => {
          if (response.status === 201) onChanged?.();
        },
      },
    );
  };

  if (isLoading) return <p>Loading plans…</p>;

  if (isError) return <p>Could not load the plans. Please try again.</p>;

  return (
    <Plans
      plans={plans}
      currentPlanId={profile.plan?.id}
      onUpgrade={handleUpgrade}
      isPending={
        isPending && variables?.planId
          ? { planId: variables.planId }
          : undefined
      }
    />
  );
};

export default PlanSelection;
