import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/styles.css';

function AdminCategoryCreatePage() {
    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
        visibility: true,
    });
    const [image, setimage] = useState(null); // Store the selected file
    const [preview, setPreview] = useState(''); // Store image preview URL
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setimage(file);
            setPreview(URL.createObjectURL(file)); // Create preview URL
        } else {
            setimage(null);
            setPreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please login again.');
                navigate('/admin/login');
                return;
            }

            const data = new FormData();
            data.append('name', formData.name);
            data.append('name_ar', formData.name_ar);
            data.append('visibility', formData.visibility);
            data.append('visibility', formData.visibility ? '1' : '0');
            if (image) {
                data.append('image', image);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: data,
            });

            if (response.status === 401) {
                setError('Your session has expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/admin/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Error creating category');
                return;
            }

            navigate('/admin/categories');
        } catch (err) {
            console.error('Error creating category:', err);
            setError('An error occurred. Please try again.');
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
                        <li className="breadcrumb-item">
                            <Link to="/admin/categories">Categories</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Create Category
                        </li>
                    </ol>
                </nav>
                <h2 className="mb-3">Create new category</h2>
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name (EN)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name_ar" className="form-label">Name (AR)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name_ar"
                                    name="name_ar"
                                    value={formData.name_ar}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="visibility" className="form-label">Visibility</label>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="visibility"
                                        name="visibility"
                                        checked={formData.visibility}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="visibility">
                                        Visible
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Category Image (optional)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {preview && (
                                    <div className="mt-2">
                                        <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-success">Create</button>
                            <Link to="/admin/categories" className="btn btn-secondary ms-2">Cancel</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategoryCreatePage;
