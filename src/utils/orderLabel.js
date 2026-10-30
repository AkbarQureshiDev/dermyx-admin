// Orders stored before bundle pricing derived-from-quantity carry a synthetic
// size key like "tier_864"; render a readable bundle tag instead.
export const bundleTag = (size, quantity) => {
  if (typeof size === 'string' && size.startsWith('tier_')) return '(Bundle)';
  return Number(quantity) > 1 ? `(Bundle of ${quantity})` : '';
};
