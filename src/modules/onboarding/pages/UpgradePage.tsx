import { Button } from '@radix-ui/themes';
import { useNavigate } from 'react-router';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import { useProfile } from '../../../context/ProfileContext';
import PlanSelection from '../components/PlanSelection';
import { usePlanUsage } from '../hooks/usePlanUsage';
import styles from './Upgrade.module.css';

function UpgradePage() {
  const { profile } = useProfile();
  const { data: planUsage, isLoading: isPlanLoading } = usePlanUsage();
  const navigate = useNavigate();

  /* The profile already carries the tenant's own plan in full, so the header needs
     nothing from the plan list; `PlanSelection` fetches that for the cards. A platform
     admin has no plan, hence the narrowing rather than a plain read. */
  const currentPlan = profile && 'plan' in profile ? profile.plan : undefined;

  const onCta = () => {
    navigate(ROUTE_PATHS.DASHBOARD);
  };

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

      <PlanSelection onChanged={() => navigate(ROUTE_PATHS.DASHBOARD)} />

      <p className={styles.tagline}>
        Pick the limits that fit your team. You can change plan later.
      </p>
    </section>
  );
}

export default UpgradePage;
