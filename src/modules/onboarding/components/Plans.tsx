import { Badge, Button } from '@mantine/core';
import type { IndividualPlan } from '../onboarding.dto';
import styles from './Plans.module.css';
import { useTenantUser } from '../../../hooks/useTenantUser';
import { UserRole } from '../../../constants/role';

type PlansProps = {
  plans: IndividualPlan[];

  currentPlanId?: number;

  onUpgrade: (planId: number) => void;
  isPending?: { planId: number };
};

/** The plan cards a tenant picks from on the upgrade screen. */
function Plans({ plans, currentPlanId, onUpgrade, isPending }: PlansProps) {
  const { profile } = useTenantUser();
  const isAdmin = profile.role === UserRole.ADMIN;
  const allPlans = isAdmin
    ? plans
    : plans.filter((planItem) => planItem.id === currentPlanId);
  return (
    <ul className={styles.planList}>
      {allPlans.map((planItem) => {
        const isCurrent = planItem.id === currentPlanId;

        return (
          <li
            key={planItem.id}
            className={[styles.plan, isCurrent ? styles.current : '']
              .filter(Boolean)
              .join(' ')}
          >
            {isCurrent && (
              <Badge className={styles.currentTag} radius='full'>
                Current
              </Badge>
            )}

            <h3 className={styles.name}>{planItem.name}</h3>

            <p className={styles.price}>
              {planItem.is_free ? (
                'Free'
              ) : (
                <>
                  ${planItem.price}
                  <span className={styles.period}>/month</span>
                </>
              )}
            </p>

            <ul className={styles.featureList}>
              <li>{planItem.max_user} Users</li>
              <li>{planItem.max_documents} Documents</li>
              <li className={planItem.tags ? undefined : styles.featureOff}>
                {planItem.tags ? 'Tags on documents' : 'No tags'}
              </li>
            </ul>

            {
              <Button
                className={styles.upgradeBtn}
                onClick={() => onUpgrade(planItem.id)}
                variant={isCurrent ? 'light' : 'filled'}
                loading={isPending?.planId === planItem.id}
                disabled={isCurrent || isPending?.planId === planItem.id}
              >
                {isCurrent
                  ? 'Current plan'
                  : planItem.is_free
                    ? `Downgrade to Free`
                    : `Upgrade to ${planItem.name}`}
              </Button>
            }
          </li>
        );
      })}
    </ul>
  );
}

export default Plans;
