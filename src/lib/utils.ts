export function formatCurrency(amount: number, symbol: string = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generateOrderNumber(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `VEL-${randomSuffix}`;
}

export function generateClaimNumber(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `CLM-${randomSuffix}`;
}

/**
 * Phase 4 & Shipping Rules:
 * - Never provide free shipping.
 * - Charge shipping on every order.
 * - Flat shipping charges configurable via store settings.
 */
export function calculateOrderTotals(
  subtotal: number,
  standardShippingFee: number = 99,
  taxRatePercent: number = 18.0
) {
  // Mandatory shipping fee charged on every order with items
  const shippingFee = subtotal > 0 ? Number(standardShippingFee) : 0;
  const taxAmount = Number(((subtotal * taxRatePercent) / 100).toFixed(2));
  const totalAmount = Number((subtotal + shippingFee + taxAmount).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shippingFee,
    taxAmount,
    totalAmount,
  };
}

export function calculateDiscountPercent(price: number, comparePrice?: number | null): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function calculateProfitMargin(retailPrice: number, costPrice: number) {
  if (retailPrice <= 0) return { profit: 0, marginPercent: 0 };
  const profit = retailPrice - costPrice;
  const marginPercent = Math.round((profit / retailPrice) * 100);
  return { profit, marginPercent };
}
