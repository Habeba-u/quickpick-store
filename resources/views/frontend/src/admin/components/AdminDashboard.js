import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import Sidebar from './Sidebar';
import '../styles/styles.css';

function AdminDashboard() {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        totalUsers: 0, // Added to store total number of users
        monthlySales: 0,
        recentActivity: [],
        salesTrends: [],
        popularProducts: [],
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('AdminDashboardPage mounted');
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard-data`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.status === 401) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('admin_id');
                    navigate('/admin/login');
                    return;
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError(error.message);
                navigate('/admin/login');
            }
        };
        fetchData();
    }, [navigate]);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setMonth(date.getMonth() - (6 - i));
                        return date.toLocaleString('default', { month: 'short' });
                    }),
                    datasets: [{
                        label: 'Sales',
                        data: dashboardData.salesTrends,
                        borderColor: '#28a745',
                        fill: false,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [dashboardData.salesTrends]);

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

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4">
                <h2>Dashboard Overview</h2>
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card p-3">
                            <h5>Total Orders</h5>
                            <h3>{dashboardData.totalOrders.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card p-3">
                            <h5>Total Revenue</h5>
                            <h3>EGP {dashboardData.totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card p-3">
                            <h5>Active Users</h5>
                            <h3>{dashboardData.activeUsers.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card p-3">
                            <h5>Total Users</h5>
                            <h3>{dashboardData.totalUsers.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="card p-3 mb-4">
                    <h5>Recent Activity</h5>
                    {dashboardData.recentActivity.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {dashboardData.recentActivity.map(activity => (
                                <li key={activity.order_id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={activity.user_image
                                                ? `${process.env.REACT_APP_API_URL}/storage/${activity.user_image}`
                                                : '/assets/placeholder.jpg'}
                                            alt="User"
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                                            onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                                        />
                                        <div>
                                            <div>{activity.customer}</div>
                                            <small className="text-muted">
                                                Order #{activity.order_id} - {activity.item_count} item{activity.item_count !== 1 ? 's' : ''}
                                            </small>
                                        </div>
                                    </div>
                                    <span>EGP {parseFloat(activity.total).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No recent activity available.</p>
                    )}
                </div>
                <div className="card p-3 mb-4">
                    <h5>Sales Trends</h5>
                    <div className="d-flex align-items-center mb-3">
                        <h3 className="me-3">Monthly Sales: EGP {dashboardData.monthlySales.toLocaleString()}</h3>
                        <span className="text-success">This Month +12%</span>
                    </div>
                    <canvas id="salesChart" ref={chartRef}></canvas>
                </div>
                <div className="card p-3">
                    <h5>Popular Products</h5>
                    {dashboardData.popularProducts.length > 0 ? (
                        <div className="row">
                            {dashboardData.popularProducts.map(product => (
                                <div className="col-md-3" key={product.name}>
                                    <div className="popular-product text-center">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                            onError={(e) => {
                                                e.target.src = '/assets/placeholder.jpg';
                                            }}
                                        />
                                        <p>{product.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No popular products available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
