import { postRequest } from './apiClient';

// ── Validate a discount code ──────────────────────────────────
// Returns: { code, discountPercent } on success
// Throws: Error with message on failure
async function validateDiscount(code) {
  const data = await postRequest('/discounts/validate', { code });

  return {
    code: data.code,
    discountPercent: data.discountPercent,
  };
}

export { validateDiscount };
