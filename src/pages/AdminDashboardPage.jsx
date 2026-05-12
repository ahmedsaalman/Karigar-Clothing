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
    <>
      <style>{dashboardCSS}</style>
      <div className="admin-page">
        <header className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">{statusMessage || 'System operational'}</p>
        </header>

        <div className="admin-grid-top">
          <section className="admin-card admin-card--metrics">
            <h2 className="admin-card__title">Metrics</h2>
            <div className="admin-metrics">
              <div className="admin-metric"><span>Orders</span><strong>{orders.length}</strong></div>
              <div className="admin-metric"><span>Products</span><strong>{products.length}</strong></div>
              <div className="admin-metric"><span>Discounts</span><strong>{discounts.length}</strong></div>
            </div>
          </section>

          <section className="admin-card">
            <h2 className="admin-card__title">Discount Management</h2>
            <div className="admin-form-row">
              <input placeholder="Code" value={newDiscount.code} onChange={(e) => setNewDiscount((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className="admin-input" />
              <input type="number" min="1" max="100" value={newDiscount.discountPercent} onChange={(e) => setNewDiscount((p) => ({ ...p, discountPercent: Number(e.target.value) }))} className="admin-input" />
              <button onClick={createDiscount} className="admin-btn">Add</button>
            </div>
          </section>
        </div>

        <section className="admin-card admin-card--table">
          <h2 className="admin-card__title">Recent Orders</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderId}</td>
                    <td><span className={`admin-badge admin-badge--${order.status}`}>{order.status}</span></td>
                    <td>
                      <select defaultValue={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="admin-select">
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card">
          <h2 className="admin-card__title">Add New Product</h2>
          <div className="admin-product-form">
            <input placeholder="Name" onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} className="admin-input" />
            <input placeholder="Slug" onChange={(e) => setNewProduct((p) => ({ ...p, slug: e.target.value }))} className="admin-input" />
            <input type="number" placeholder="Price" onChange={(e) => setNewProduct((p) => ({ ...p, price: Number(e.target.value) }))} className="admin-input" />
            <input type="number" placeholder="Original Price" onChange={(e) => setNewProduct((p) => ({ ...p, originalPrice: Number(e.target.value) }))} className="admin-input" />
            <input placeholder="Thumbnail URL" onChange={(e) => setNewProduct((p) => ({ ...p, thumbnail: e.target.value }))} className="admin-input" />
            <input placeholder="Description" onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} className="admin-input admin-input--full" />
          </div>
          <button onClick={createProduct} className="admin-btn admin-btn--primary">Create Product</button>
        </section>
      </div>
    </>
  );
}

const dashboardCSS = `
  .admin-page { max-width: var(--container-max); margin: 0 auto; padding: 100px 20px; }
  .admin-header { margin-bottom: 40px; }
  .admin-title { font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: #ffffff; margin: 0; }
  .admin-subtitle { font-size: 0.9rem; color: var(--color-gold); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

  .admin-grid-top { display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 24px; }
  @media (min-width: 900px) { .admin-grid-top { grid-template-columns: 1fr 1fr; } }

  .admin-card { background: var(--color-bg-elevated); padding: 32px; border-radius: 8px; border: 1px solid var(--color-border); margin-bottom: 24px; }
  .admin-card__title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; color: #ffffff; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border); text-transform: uppercase; letter-spacing: 1px; }

  .admin-metrics { display: flex; gap: 24px; }
  .admin-metric { display: flex; flex-direction: column; gap: 4px; }
  .admin-metric span { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; font-weight: 700; }
  .admin-metric strong { font-family: var(--font-display); font-size: 2rem; color: var(--color-gold); }

  .admin-input, .admin-select { background: rgba(255,255,255,0.03); border: 1px solid var(--color-border); padding: 12px 16px; border-radius: 6px; color: #ffffff; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
  .admin-input:focus { border-color: var(--color-gold); }
  .admin-input--full { grid-column: 1 / -1; }

  .admin-form-row { display: flex; gap: 12px; }
  .admin-btn { padding: 12px 24px; background: var(--color-gold); color: #000000; border: none; border-radius: 6px; font-weight: 800; cursor: pointer; transition: all 0.2s; text-transform: uppercase; font-size: 0.8rem; }
  .admin-btn:hover { background: var(--color-gold-light); transform: translateY(-1px); }
  .admin-btn--primary { width: 100%; margin-top: 16px; padding: 16px; font-size: 0.9rem; }

  .admin-table-wrap { overflow-x: auto; }
  .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
  .admin-table th { padding: 12px; font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; font-weight: 800; border-bottom: 1px solid var(--color-border); }
  .admin-table td { padding: 16px 12px; font-size: 0.9rem; color: #ffffff; border-bottom: 1px solid var(--color-border); }

  .admin-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
  .admin-badge--pending { background: #6b4e00; color: #ffd700; }
  .admin-badge--confirmed { background: #004d00; color: #00ff00; }
  .admin-badge--shipped { background: #003366; color: #66ccff; }
  .admin-badge--delivered { background: #2d5a27; color: #ffffff; }

  .admin-product-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
`;

export default withAuthGuard(AdminDashboardPage, { requiredRole: 'admin' });
