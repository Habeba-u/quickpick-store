import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/styles.css';

function AdminCategoryEditPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
        visibility: true,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setFormData({
                    name: data.name,
                    name_ar: data.name_ar || '',
                    visibility: data.visibility,
                });
                // Set the preview to the existing image if it exists
                if (data.image) {
                    setPreview(`${process.env.REACT_APP_API_URL}/storage/${data.image}`);
                }
            } catch (error) {
                console.error('Error fetching category:', error);
                setError('Error fetching category');
            }
        };
        fetchCategory();
    }, [id]);

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
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Show preview of the newly selected file
        } else {
            setImage(null);
            // Reset to the existing image if no new file is selected
            if (formData.image) {
                setPreview(`${process.env.REACT_APP_API_URL}/storage/${formData.image}`);
            } else {
                setPreview('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('name_ar', formData.name_ar);
            data.append('visibility', formData.visibility ? '1' : '0');
            if (image) {
                data.append('image', image);
            }
            data.append('_method', 'PUT');

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: data,
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/admin/categories');
            } else {
                const data = await response.json();
                setError(data.message || Object.values(data.errors).flat().join(', '));
            }
        } catch (err) {
            console.error('Submit error:', err);
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
                            Edit Category
                        </li>
                    </ol>
                </nav>
                <h2 className="mb-3">Edit category</h2>
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
                            <button type="submit" className="btn btn-success">Save</button>
                            <Link to="/admin/categories" className="btn btn-secondary ms-2">Cancel</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategoryEditPage;
