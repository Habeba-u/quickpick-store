import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import Sidebar from './Sidebar';
import '../styles/styles.css';

function AdminProductEditPage() {
    const { language } = useContext(LanguageContext);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
        description_ar: '',
        ingredients_material: '',
        ingredients_material_ar: '',
        instructions: '',
        instructions_ar: '',
        weight_dimensions: '',
        weight_dimensions_ar: '',
        return_policy: '',
        return_policy_ar: '',
        active: true,
    });
    const [featuredImage, setFeaturedImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [featuredPreview, setFeaturedPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const translations = {
        en: {
            editTitle: 'Edit product',
            nameLabel: 'Name (EN)',
            nameArLabel: 'Name (AR)',
            categoryLabel: 'Category',
            priceLabel: 'Price',
            stockLabel: 'Stock',
            featuredImageLabel: 'Featured Image (optional)',
            galleryImagesLabel: 'Gallery Images (optional)',
            descriptionLabel: 'Product Description',
            descriptionArLabel: 'Product Description (AR)',
            ingredientsLabel: 'Ingredients / Material',
            ingredientsArLabel: 'Ingredients / Material (AR)',
            instructionsLabel: 'How to Use / Instructions',
            instructionsArLabel: 'How to Use / Instructions (AR)',
            weightLabel: 'Weight, Dimensions, etc.',
            weightArLabel: 'Weight, Dimensions, etc. (AR)',
            returnPolicyLabel: 'Return Policy',
            returnPolicyArLabel: 'Return Policy (AR)',
            activeLabel: 'Active',
            saveButton: 'Save',
            cancelButton: 'Cancel',
            errorFetching: 'Error fetching product or categories',
            errorSubmit: 'An error occurred. Please try again.',
        },
        ar: {
            editTitle: 'تعديل المنتج',
            nameLabel: 'الاسم (إنجليزي)',
            nameArLabel: 'الاسم (عربي)',
            categoryLabel: 'الفئة',
            priceLabel: 'السعر',
            stockLabel: 'المخزون',
            featuredImageLabel: 'الصورة المميزة (اختياري)',
            galleryImagesLabel: 'صور المعرض (اختياري)',
            descriptionLabel: 'وصف المنتج',
            descriptionArLabel: 'وصف المنتج (عربي)',
            ingredientsLabel: 'المكونات / المواد',
            ingredientsArLabel: 'المكونات / المواد (عربي)',
            instructionsLabel: 'كيفية الاستخدام / التعليمات',
            instructionsArLabel: 'كيفية الاستخدام / التعليمات (عربي)',
            weightLabel: 'الوزن، الأبعاد، إلخ.',
            weightArLabel: 'الوزن، الأبعاد، إلخ. (عربي)',
            returnPolicyLabel: 'سياسة الإرجاع',
            returnPolicyArLabel: 'سياسة الإرجاع (عربي)',
            activeLabel: 'نشط',
            saveButton: 'حفظ',
            cancelButton: 'إلغاء',
            errorFetching: 'خطأ في جلب المنتج أو الفئات',
            errorSubmit: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        },
    };

    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/products/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const productData = await productResponse.json();
                setFormData({
                    name: productData.name,
                    name_ar: productData.name_ar || '',
                    category_id: productData.category_id.toString(),
                    price: productData.price,
                    stock: productData.stock,
                    description: productData.description || '',
                    description_ar: productData.description_ar || '',
                    ingredients_material: productData.ingredients_material || '',
                    ingredients_material_ar: productData.ingredients_material_ar || '',
                    instructions: productData.instructions || '',
                    instructions_ar: productData.instructions_ar || '',
                    weight_dimensions: productData.weight_dimensions || '',
                    weight_dimensions_ar: productData.weight_dimensions_ar || '',
                    return_policy: productData.return_policy || '',
                    return_policy_ar: productData.return_policy_ar || '',
                    active: productData.active,
                });
                if (productData.image) {
                    setFeaturedPreview(`${process.env.REACT_APP_API_URL}/storage/${productData.image}`);
                }
                if (productData.gallery_images && Array.isArray(productData.gallery_images)) {
                    setGalleryPreviews(productData.gallery_images.map(img => `${process.env.REACT_APP_API_URL}/storage/${img}`));
                }

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
                setError(t.errorFetching);
            }
        };
        fetchData();
    }, [id, t.errorFetching]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImage(file);
            setFeaturedPreview(URL.createObjectURL(file));
        } else {
            setFeaturedImage(null);
            setFeaturedPreview(formData.image ? `${process.env.REACT_APP_API_URL}/storage/${formData.image}` : '');
        }
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryImages(files);
        setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (const key in formData) {
                if (key === 'active') {
                    data.append(key, formData[key] ? '1' : '0');
                } else {
                    data.append(key, formData[key]);
                }
            }
            if (featuredImage) {
                data.append('image', featuredImage);
            }
            galleryImages.forEach((image, index) => {
                data.append(`gallery_images[${index}]`, image);
            });
            data.append('_method', 'PUT');

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/products/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: data,
            });

            if (response.ok) {
                navigate('/admin/products');
            } else {
                const data = await response.json();
                setError(data.message || Object.values(data.errors).flat().join(', '));
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError(t.errorSubmit);
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
                            <Link to="/admin/products">Products</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {t.editTitle}
                        </li>
                    </ol>
                </nav>
                <h2 className="mb-3">{t.editTitle}</h2>
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">{t.nameLabel}</label>
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
                                <label htmlFor="name_ar" className="form-label">{t.nameArLabel}</label>
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
                                <label htmlFor="category_id" className="form-label">{t.categoryLabel}</label>
                                <select
                                    className="form-control"
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {language === 'ar' ? category.name_ar || category.name : category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">{t.priceLabel}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stock" className="form-label">{t.stockLabel}</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="featured_image" className="form-label">{t.featuredImageLabel}</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="featured_image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFeaturedImageChange}
                                />
                                {featuredPreview && (
                                    <div className="mt-2">
                                        <img src={featuredPreview} alt="Featured Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gallery_images" className="form-label">{t.galleryImagesLabel}</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="gallery_images"
                                    name="gallery_images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryImagesChange}
                                />
                                {galleryPreviews.length > 0 && (
                                    <div className="mt-2 d-flex flex-wrap gap-2">
                                        {galleryPreviews.map((preview, index) => (
                                            <img key={index} src={preview} alt={`Gallery Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">{t.descriptionLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description_ar" className="form-label">{t.descriptionArLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="description_ar"
                                    name="description_ar"
                                    value={formData.description_ar}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ingredients_material" className="form-label">{t.ingredientsLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="ingredients_material"
                                    name="ingredients_material"
                                    value={formData.ingredients_material}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ingredients_material_ar" className="form-label">{t.ingredientsArLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="ingredients_material_ar"
                                    name="ingredients_material_ar"
                                    value={formData.ingredients_material_ar}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="instructions" className="form-label">{t.instructionsLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="instructions"
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="instructions_ar" className="form-label">{t.instructionsArLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="instructions_ar"
                                    name="instructions_ar"
                                    value={formData.instructions_ar}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="weight_dimensions" className="form-label">{t.weightLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="weight_dimensions"
                                    name="weight_dimensions"
                                    value={formData.weight_dimensions}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="weight_dimensions_ar" className="form-label">{t.weightArLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="weight_dimensions_ar"
                                    name="weight_dimensions_ar"
                                    value={formData.weight_dimensions_ar}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="return_policy" className="form-label">{t.returnPolicyLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="return_policy"
                                    name="return_policy"
                                    value={formData.return_policy}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="return_policy_ar" className="form-label">{t.returnPolicyArLabel}</label>
                                <textarea
                                    className="form-control"
                                    id="return_policy_ar"
                                    name="return_policy_ar"
                                    value={formData.return_policy_ar}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="active" className="form-label">{t.activeLabel}</label>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="active"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="active">
                                        {t.activeLabel}
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success">{t.saveButton}</button>
                            <Link to="/admin/products" className="btn btn-secondary ms-2">{t.cancelButton}</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProductEditPage;
