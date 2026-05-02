// src/services/orderService.js
// Handles placing and fetching orders from the backend

import { getToken } from './authService';

const BASE_URL = 'http://localhost:5000/api/orders';

// ── Place a new order ─────────────────────────────────────────
async function placeOrder({
  cartItems,
  shippingAddress,
  paymentMethod,
  orderNotes,
  discountCode,
  discountPercent,
  subtotal,
  shipping,
  grandTotal,
}) {
  // Map cart items to the shape the backend expects
  const items = cartItems.map((item) => ({
    productId: item.id,
    name: item.name,
    size: item.size,
    quantity: item.quantity,
  }));

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      items,
      shippingAddress,
      paymentMethod,
      orderNotes,
      discountCode,
      discountPercent,
      subtotal,
      shipping,
      grandTotal,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to place order');

  return data.order; // contains orderId, status, etc.
}

// ── Get current user's order history ─────────────────────────
async function getMyOrders() {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');

  return data.orders;
}

// ── Get single order by ID ────────────────────────────────────
async function getOrderById(orderId) {
  const res = await fetch(`${BASE_URL}/${orderId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order not found');

  return data.order;
}

export { placeOrder, getMyOrders, getOrderById };
