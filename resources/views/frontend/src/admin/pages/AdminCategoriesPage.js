import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/styles.css';

function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token'); // If using Sanctum
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
                    headers: {
                        'Accept': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Add token if using Sanctum
                    },
                    credentials: token ? undefined : 'include', // Use credentials if not using Sanctum
                });
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const token = localStorage.getItem('token');
                await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                    credentials: token ? undefined : 'include',
                });
                setCategories(categories.filter(category => category.id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
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
                            Categories
                        </li>
                    </ol>
                </nav>
                <h2 className="mb-3">Product categories</h2>
                <p className="text-muted">{categories.length} categories</p>
                <div className="card">
                    <div className="card-body p-0">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name (EN)</th>
                                    <th>Name (AR)</th>
                                    <th>Visibility</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td dir="rtl">{category.name_ar || '-'}</td>
                                        <td>
                                            <span className={`badge ${category.visibility ? 'bg-success' : 'bg-secondary'}`}>
                                                {category.visibility ? 'Visible' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td>
                                            {category.image ? (
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/storage/${category.image}`}
                                                    alt={category.name}
                                                    style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        console.error('Failed to load image:', `${process.env.REACT_APP_API_URL}/storage/${category.image}`);
                                                        e.target.style.display = 'none'; // Hide broken image
                                                    }}
                                                />
                                            ) : (
                                                <span className="badge bg-secondary">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <Link to={`/admin/categories/edit/${category.id}`} className="btn btn-sm btn-outline-primary me-2">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-outline-danger">
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
                    <Link to="/admin/categories/create" className="btn btn-success">
                        Create new category
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminCategoriesPage;
