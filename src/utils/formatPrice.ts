export const formatPrice = (
  priceInCents: number,
  currency: string = 'EUR',
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(priceInCents / 100);
};
