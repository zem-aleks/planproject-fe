import { SubscriptionType } from '@/modules/users/types/user';

export type Price = {
  price: number;
  discountPrice: number | null;
};

export type PriceBlock = {
  monthly: Price;
  yearly: Price;
  description: string;
  details: string[];
};

export const PRICES: Record<SubscriptionType, PriceBlock> = {
  basic: {
    description: 'Perfect for exploring the platform',
    details: [
      '✔ 1 project plan generation',
      '✔ Step-by-step actionable roadmaps',
      '✔ Basic AI-generated plan',
      '✔ Limited competitor & audience analysis',
    ],
    monthly: {
      price: 0,
      discountPrice: null,
    },
    yearly: {
      price: 0,
      discountPrice: null,
    },
  },
  pro: {
    description: 'For serious builders and goal achievers',
    details: [
      '✔ Everything from Basic Plan',
      '✔ Up to 5 projects',
      '✔ Advanced AI planning',
      '✔ Full competitor & audience analysis',
      '✔ AI refinement & iteration',
    ],
    monthly: {
      price: 19,
      discountPrice: null,
    },
    yearly: {
      price: 190,
      discountPrice: null,
    },
  },
  business: {
    description:
      'For startups and teams looking for unlimited control and insights',
    details: [
      '✔ Everything from Pro Plan',
      '✔ Unlimited projects',
      '✔ Priority Support',
      '✔ Market & monetization insights (coming soon)',
      '✔ Progress tracking & reminders (coming soon)',
      '✔ Export options (coming soon)',
    ],
    monthly: {
      price: 39,
      discountPrice: 49,
    },
    yearly: {
      price: 390,
      discountPrice: 490,
    },
  },
};
