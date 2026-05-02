import { getRequest, postRequest } from './apiClient';

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

  const data = await postRequest('/orders', {
    items,
    shippingAddress,
    paymentMethod,
    orderNotes,
    discountCode,
    discountPercent,
    subtotal,
    shipping,
    grandTotal,
  });

  return data.order; // contains orderId, status, etc.
}

// ── Get current user's order history ─────────────────────────
async function getMyOrders() {
  const data = await getRequest('/orders');

  return data.orders;
}

// ── Get single order by ID ────────────────────────────────────
async function getOrderById(orderId) {
  const data = await getRequest(`/orders/${orderId}`);

  return data.order;
}

export { placeOrder, getMyOrders, getOrderById };
