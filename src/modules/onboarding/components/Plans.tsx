import { Badge, Button } from '@radix-ui/themes';
import type { IndividualPlan } from '../onboarding.dto';
import styles from './Plans.module.css';

type PlansProps = {
  plans: IndividualPlan[];

  currentPlanId?: number;

  onUpgrade: (planId: number) => void;
  isPending?: { planId: number };
};

/** The plan cards a tenant picks from on the upgrade screen. */
function Plans({ plans, currentPlanId, onUpgrade, isPending }: PlansProps) {
  return (
    <ul className={styles.planList}>
      {plans.map((planItem) => {
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

            <Button
              className={styles.upgradeBtn}
              onClick={() => onUpgrade(planItem.id)}
              variant={isCurrent ? 'soft' : 'solid'}
              loading={isPending?.planId === planItem.id}
              disabled={isCurrent || isPending?.planId === planItem.id}
            >
              {isCurrent ? 'Current plan' : `Upgrade to ${planItem.name}`}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export default Plans;
