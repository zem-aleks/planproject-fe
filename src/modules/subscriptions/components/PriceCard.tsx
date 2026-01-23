import { UpgradeSubscriptionForm } from '@/modules/subscriptions/components/UpgradeSubscriptionForm';
import { PRICES } from '@/modules/subscriptions/data/prices';
import { SUBSCRIPTION_TITLES } from '@/modules/subscriptions/data/subscriptions';
import { SubscriptionType } from '@/modules/users/types/user';

export const PriceCard = ({
  subscription,
  yearly,
  badges,
  className,
  showUpgradeForm,
}: {
  subscription: SubscriptionType;
  yearly: boolean;
  badges: Array<{ text: string; bg: string }>;
  className?: string;
  showUpgradeForm?: boolean;
}) => {
  const priceBlock = PRICES[subscription];
  const price = yearly ? priceBlock.yearly : priceBlock.monthly;

  return (
    <div
      className={`relative rounded-2xl border bg-white p-8 shadow-sm ${className} flex flex-col justify-between`}
    >
      {badges.length > 0 && (
        <div className="absolute -top-3 right-6 flex items-center gap-2">
          {badges.map((badge) => (
            <span
              className={`rounded-full ${badge.bg} px-3 py-1 text-xs font-semibold text-white`}
            >
              {badge.text}
            </span>
          ))}
        </div>
      )}

      <div>
        <h3 className="mb-2 text-xl font-semibold">
          {SUBSCRIPTION_TITLES[subscription]}
        </h3>
        <p className="mb-4 text-gray-600">{priceBlock.description}</p>

        <div className={'mb-6 flex flex-col gap-2'}>
          <p className="text-3xl font-bold">
            {price.discountPrice !== null && (
              <span className="mr-2 text-gray-400 line-through">
                €{price.discountPrice}
              </span>
            )}
            €{price.price}
            <span className="text-base font-medium">
              {yearly ? ' / year' : ' / month'}
            </span>
          </p>

          {yearly && priceBlock.monthly.price > 0 && (
            <p className="text-sm text-gray-500">
              Billed annually — save €
              {Math.round(
                priceBlock.monthly.price * 12 - priceBlock.yearly.price,
              )}
            </p>
          )}
          {!yearly && priceBlock.monthly.price > 0 && (
            <p className="text-sm text-gray-500">
              €{priceBlock.yearly.price} / year (2 months free)
            </p>
          )}
        </div>

        <ul className="mb-6 space-y-3 text-sm text-gray-700">
          {priceBlock.details.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </div>

      {showUpgradeForm && price.priceId && (
        <div className={'w-full'}>
          <UpgradeSubscriptionForm priceId={price.priceId} />
        </div>
      )}
    </div>
  );
};
