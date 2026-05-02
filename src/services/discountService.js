// src/services/discountService.js
// Validates discount codes against the backend

import { getToken } from './authService';

const BASE_URL = 'http://localhost:5000/api/discounts';

// ── Validate a discount code ──────────────────────────────────
// Returns: { code, discountPercent } on success
// Throws: Error with message on failure
async function validateDiscount(code) {
  const res = await fetch(`${BASE_URL}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Invalid discount code');

  return {
    code: data.code,
    discountPercent: data.discountPercent,
  };
}

export { validateDiscount };
