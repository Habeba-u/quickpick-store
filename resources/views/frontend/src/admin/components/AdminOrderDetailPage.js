import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/styles.css';

function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/orders/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message);
      }
    };
    fetchOrder();
  }, [id]);

  if (error) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <div className="alert alert-danger">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/orders">Orders</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Order #{order.id}
            </li>
          </ol>
        </nav>
        <h2 className="mb-3">Order #{order.id}</h2>
        <div className="card mb-4">
          <div className="card-body">
            <h5>Customer</h5>
            <p>{order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Unknown'}</p>
            <h5>Order Details</h5>
            <p>Status: {order.status}</p>
            <p>Payment Status: {order.payment_status}</p>
            <p>Payment Method: {order.payment_method || 'N/A'}</p>
            <p>Total: EGP {parseFloat(order.total).toFixed(2)}</p>
            <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
            <h5>Shipping Address</h5>
            <p>
              {order.address
                ? `${order.address.label}, ${order.address.street}${
                    order.address.aptNo ? `, Apt ${order.address.aptNo}` : ''
                  }${order.address.floor ? `, Floor ${order.address.floor}` : ''}${
                    order.address.description ? `, ${order.address.description}` : ''
                  }`
                : 'N/A'}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5>Items</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>EGP {parseFloat(item.price).toFixed(2)}</td>
                    <td>EGP {(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailPage;
