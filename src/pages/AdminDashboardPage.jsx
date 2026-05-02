import { useEffect, useState } from 'react';
import { getRequest, patchRequest, postRequest } from '../services/apiClient';
import withAuthGuard from '../components/withAuthGuard';
import dashboardHero from '../../photos/shirt_pics/sample4.jpg';

function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const [newDiscount, setNewDiscount] = useState({ code: '', discountPercent: 10 });
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: 0,
    originalPrice: 0,
    category: 'casual',
    thumbnail: '',
    description: '',
    stockCount: 1,
  });

  const loadData = async () => {
    const [ordersRes, productsRes, discountsRes] = await Promise.all([
      getRequest('/orders/admin/all'),
      getRequest('/products'),
      getRequest('/discounts'),
    ]);
    setOrders(ordersRes.orders || []);
    setProducts(productsRes.products || []);
    setDiscounts(discountsRes.discounts || []);
  };

  useEffect(() => {
    loadData().catch((err) => setStatusMessage(err.message));
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await patchRequest(`/orders/${id}/status`, { status });
      await loadData();
      setStatusMessage('Order status updated');
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const createDiscount = async () => {
    try {
      await postRequest('/discounts', newDiscount);
      setNewDiscount({ code: '', discountPercent: 10 });
      await loadData();
      setStatusMessage('Discount created');
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const createProduct = async () => {
    try {
      await postRequest('/products', {
        ...newProduct,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000'],
        colorNames: ['Black'],
        images: [newProduct.thumbnail],
        rating: 4.5,
        reviewCount: 0,
      });
      setStatusMessage('Product created');
      await loadData();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.subtitle}>{statusMessage}</p>

      <section style={styles.section}>
        <h2>Metrics</h2>
        <p>Total Orders: {orders.length}</p>
        <p>Total Products: {products.length}</p>
        <p>Total Discounts: {discounts.length}</p>
      </section>

      <section style={styles.section}>
        <h2>Orders</h2>
        {orders.slice(0, 8).map((order) => (
          <div key={order._id} style={styles.row}>
            <span>{order.orderId}</span>
            <span>{order.status}</span>
            <select
              defaultValue={order.status}
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2>Discount Management</h2>
        <div style={styles.formRow}>
          <input
            placeholder="Code"
            value={newDiscount.code}
            onChange={(e) => setNewDiscount((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
          />
          <input
            type="number"
            min="1"
            max="100"
            value={newDiscount.discountPercent}
            onChange={(e) =>
              setNewDiscount((p) => ({ ...p, discountPercent: Number(e.target.value) }))
            }
          />
          <button onClick={createDiscount}>Add Discount</button>
        </div>
      </section>

      <section style={styles.section}>
        <h2>Product CRUD (Create)</h2>
        <div style={styles.grid}>
          <input placeholder="Name" onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} />
          <input placeholder="Slug" onChange={(e) => setNewProduct((p) => ({ ...p, slug: e.target.value }))} />
          <input type="number" placeholder="Price" onChange={(e) => setNewProduct((p) => ({ ...p, price: Number(e.target.value) }))} />
          <input type="number" placeholder="Original Price" onChange={(e) => setNewProduct((p) => ({ ...p, originalPrice: Number(e.target.value) }))} />
          <input placeholder="Thumbnail URL" onChange={(e) => setNewProduct((p) => ({ ...p, thumbnail: e.target.value }))} />
          <input placeholder="Description" onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} />
        </div>
        <button onClick={createProduct}>Create Product</button>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundImage: `linear-gradient(rgba(244, 234, 222, 0.92), rgba(244, 234, 222, 0.96)), url(${dashboardHero})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 8,
    animation: 'panelFadeUp 520ms ease',
  },
  title: { fontSize: '2rem', marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 20 },
  section: {
    background: 'rgba(255, 255, 255, 0.92)',
    padding: 20,
    marginBottom: 20,
    border: '1px solid #e8d7c1',
    animation: 'panelFadeUp 420ms ease',
  },
  row: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 },
  formRow: { display: 'flex', gap: 8, alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 },
};

export default withAuthGuard(AdminDashboardPage, { requiredRole: 'admin' });
