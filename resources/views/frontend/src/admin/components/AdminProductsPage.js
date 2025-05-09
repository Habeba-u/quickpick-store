import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/styles.css';

function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/products`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const productsData = await productsResponse.json();
                setProducts(productsData);

                // Fetch categories for reference
                const categoriesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`${process.env.REACT_APP_API_URL}/api/admin/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProducts(products.filter(product => product.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4">
                <nav aria-label="breadcrumb" className="mb-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/admin/dashboard">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Products
                        </li>
                    </ol>
                </nav>
                <h2 className="mb-3">Products</h2>
                <p className="text-muted">{products.length} products</p>
                <div className="card">
                    <div className="card-body p-0">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name (EN)</th>
                                    <th>Name (AR)</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Image</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td dir="rtl">{product.name_ar || '-'}</td>
                                        <td>{product.category ? product.category.name : '-'}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            {product.image ? (
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/storage/${product.image}`}
                                                    alt={product.name}
                                                    style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span className="badge bg-secondary">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${product.active ? 'bg-success' : 'bg-secondary'}`}>
                                                {product.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/admin/products/edit/${product.id}`} className="btn btn-sm btn-outline-primary me-2">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-outline-danger">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3">
                    <Link to="/admin/products/create" className="btn btn-success">
                        Create new product
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminProductsPage;
