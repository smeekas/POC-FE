/** Request and response shapes for the onboarding module. */

/** One subscription plan as `GET plan` returns it. `price` is a decimal string, e.g. `"9.99"`. */
export type IndividualPlan = {
  id: number;
  name: string;
  max_user: number;
  max_documents: number;
  tags: boolean;
  is_active: boolean;
  is_free: boolean;
  price: string;
};

/** `data` of `GET plan`: every plan the backend offers. */
export type PlansResponseDto = IndividualPlan[];
export type PlanUsageDto = { user: number; document: number };
