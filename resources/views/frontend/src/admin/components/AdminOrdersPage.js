import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Table, Badge, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import '../styles/styles.css';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/orders`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/api/admin/orders/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(orders.filter(order => order.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
        setError('Error deleting order');
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === id ? { ...order, status } : order
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating status');
    }
  };

  const handleUpdatePaymentStatus = async (id, payment_status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/orders/${id}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ payment_status }),
      });
      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === id ? { ...order, payment_status } : order
        ));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Error updating payment status');
    }
  };

  return (
    <div className="d-flex admin-orders-page">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Orders
            </li>
          </ol>
        </nav>
        <h2 className="mb-4">Delivery Orders</h2>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        <div className="card">
          <div className="card-body p-0">
            {orders.length > 0 ? (
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Order Status</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={order.user && order.user.image
                              ? `${process.env.REACT_APP_API_URL}/storage/${order.user.image}`
                              : '/assets/placeholder.jpg'}
                            alt="User"
                            className="user-image"
                            onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                          />
                          {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Unknown'}
                        </div>
                      </td>
                      <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} item{order.items.length !== 1 ? 's' : ''}</td>
                      <td>EGP {parseFloat(order.total).toFixed(2)}</td>
                      <td>
                        <Dropdown onSelect={(status) => handleUpdateStatus(order.id, status)}>
                          <Dropdown.Toggle variant="link" className="p-0">
                            <Badge className={`badge-status ${order.status}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                              <Dropdown.Item key={status} eventKey={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                      <td>
                        <Dropdown onSelect={(payment_status) => handleUpdatePaymentStatus(order.id, payment_status)}>
                          <Dropdown.Toggle variant="link" className="p-0">
                            <Badge className={`badge-status ${order.payment_status}`}>
                              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </Badge>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {['pending', 'paid', 'failed'].map(status => (
                              <Dropdown.Item key={status} eventKey={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" className="btn-action" id={`dropdown-${order.id}`}>
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/admin/orders/${order.id}`}>
                              View
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate(`/admin/orders/${order.id}`)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(order.id)}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="p-3">No orders available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
