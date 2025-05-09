import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaBuilding, FaHome, FaBriefcase, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import AccountSidebar from '../components/AccountSidebar';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageAddress.css';

function ManageAddress() {
  const { user, updateUser } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [view, setView] = useState('saved'); // 'saved', 'new', or 'edit'
  const [addresses, setAddresses] = useState([]);
  const [editAddressId, setEditAddressId] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    type: 'Apartment',
    aptNo: '',
    floor: '',
    street: '',
    description: '',
    isDefault: false,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Translations
  const translations = {
    en: {
      title: 'Manage Address',
      savedAddresses: {
        title: 'Saved Addresses',
        addNewAddress: 'Add New Address',
        label: 'Label',
        description: 'Description',
        default: 'Default',
        edit: 'Edit',
        noAddresses: 'No addresses saved',
        placeholderLabel: 'e.g., Home',
      },
      newAddress: {
        title: 'New Address',
        label: 'Label *',
        labelPlaceholder: 'e.g., Home',
        aptNo: 'Apt No.',
        aptNoPlaceholder: 'Apartment Number',
        floor: 'Floor',
        floorPlaceholder: 'Floor Number',
        street: 'Street *',
        streetPlaceholder: 'Street Name',
        description: 'Description',
        descriptionPlaceholder: 'Additional details',
        setDefault: 'Set as Default',
        saveAddress: 'Save Address',
        cancel: 'Cancel',
      },
      editAddress: {
        title: 'Edit Address',
        label: 'Label *',
        labelPlaceholder: 'e.g., Home',
        aptNo: 'Apt No.',
        aptNoPlaceholder: 'Apartment Number',
        floor: 'Floor',
        floorPlaceholder: 'Floor Number',
        street: 'Street *',
        streetPlaceholder: 'Street Name',
        description: 'Description',
        descriptionPlaceholder: 'Additional details',
        setDefault: 'Set as Default',
        updateAddress: 'Update Address',
        cancel: 'Cancel',
      },
      addressTypes: {
        Apartment: 'Apartment',
        House: 'House',
        Work: 'Work',
        Other: 'Other',
      },
      messages: {
        addressSaved: 'Address saved successfully!',
        addressUpdated: 'Address updated successfully!',
        errorRequired: 'Label and Street are required.',
      },
    },
    ar: {
      title: 'إدارة العنوان',
      savedAddresses: {
        title: 'العناوين المحفوظة',
        addNewAddress: 'إضافة عنوان جديد',
        label: 'الأسم',
        description: 'الوصف',
        default: 'الافتراضي',
        edit: 'تعديل',
        noAddresses: 'لم يتم حفظ أي عناوين',
        placeholderLabel: 'مثال، المنزل',
      },
      newAddress: {
        title: 'عنوان جديد',
        label: 'الأسم *',
        labelPlaceholder: 'مثال، المنزل',
        aptNo: 'رقم الشقة',
        aptNoPlaceholder: 'رقم الشقة',
        floor: 'الطابق',
        floorPlaceholder: 'رقم الطابق',
        street: 'الشارع *',
        streetPlaceholder: 'اسم الشارع',
        description: 'الوصف',
        descriptionPlaceholder: 'تفاصيل إضافية',
        setDefault: 'تعيين كافتراضي',
        saveAddress: 'حفظ العنوان',
        cancel: 'إلغاء',
      },
      editAddress: {
        title: 'تعديل العنوان',
        label: 'الأسم *',
        labelPlaceholder: 'مثال، المنزل',
        aptNo: 'رقم الشقة',
        aptNoPlaceholder: 'رقم الشقة',
        floor: 'الطابق',
        floorPlaceholder: 'رقم الطابق',
        street: 'الشارع *',
        streetPlaceholder: 'اسم الشارع',
        description: 'الوصف',
        descriptionPlaceholder: 'تفاصيل إضافية',
        setDefault: 'تعيين كافتراضي',
        updateAddress: 'تحديث العنوان',
        cancel: 'إلغاء',
      },
      addressTypes: {
        Apartment: 'شقة',
        House: 'منزل',
        Work: 'عمل',
        Other: 'آخر',
      },
      messages: {
        addressSaved: 'تم حفظ العنوان بنجاح!',
        addressUpdated: 'تم تحديث العنوان بنجاح!',
        errorRequired: 'الأسم والشارع مطلوبان.',
      },
    },
  };

  const t = translations[language];

  // Load addresses from user data
  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    } else {
      setAddresses([]);
    }
  }, [user]);

  // Save addresses to the backend
  const saveAddresses = async (updatedAddresses) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone || '',
        gender: user.gender || '',
        wallet: user.wallet || 0,
        addresses: updatedAddresses,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update addresses');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setAddresses(updatedUser.addresses || []);
    } catch (err) {
      console.error('Error saving addresses:', err);
      setError(err.message || 'Failed to save addresses');
      setSuccess('');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle address type selection
  const handleTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  // Handle form submission (new or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.label || !formData.street) {
      setError(t.messages.errorRequired);
      setSuccess('');
      return;
    }

    let updatedAddresses;
    if (view === 'edit') {
      // Update existing address
      updatedAddresses = addresses.map((addr) =>
        addr.id === editAddressId ? { ...formData, id: addr.id } : addr
      );
    } else {
      // Add new address
      updatedAddresses = [...addresses, { ...formData, id: Date.now() }];
    }

    // Handle default address logic
    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === (view === 'edit' ? editAddressId : updatedAddresses[updatedAddresses.length - 1].id),
      }));
    }

    await saveAddresses(updatedAddresses);
    setSuccess(view === 'edit' ? t.messages.addressUpdated : t.messages.addressSaved);
    setError('');
    resetForm();
    setView('saved');
  };

  // Reset form and edit state
  const resetForm = () => {
    setFormData({
      label: '',
      type: 'Apartment',
      aptNo: '',
      floor: '',
      street: '',
      description: '',
      isDefault: false,
    });
    setEditAddressId(null);
  };

  // Handle edit button click
  const handleEdit = (address) => {
    setFormData(address);
    setEditAddressId(address.id);
    setView('edit');
  };

  // Handle setting default address
  const handleSetDefault = async (id) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    await saveAddresses(updatedAddresses);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="my-account-page">
      <Container className="py-5">
        <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.title}
        </h2>
        <Row>
          <Col md={3}>
            <AccountSidebar />
          </Col>
          <Col md={9}>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {view === 'saved' ? (
              <div className="saved-addresses">
                <div
                  className={`d-flex justify-content-between align-items-center mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                >
                  <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>
                    {t.savedAddresses.title}
                  </h4>
                  <Button variant="success" size="sm" onClick={() => setView('new')}>
                    {t.savedAddresses.addNewAddress}
                  </Button>
                </div>
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <Card key={address.id} className="address-card mb-3">
                      <Card.Body>
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>{t.savedAddresses.label}</Form.Label>
                            <Form.Control
                              type="text"
                              value={address.label}
                              readOnly
                              className={language === 'ar' ? 'text-end' : 'text-start'}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>{t.savedAddresses.description}</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={address.description}
                              readOnly
                              className={language === 'ar' ? 'text-end' : 'text-start'}
                            />
                          </Form.Group>
                          <div
                            className={`d-flex justify-content-between align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                          >
                            <Form.Check
                              type="checkbox"
                              label={t.savedAddresses.default}
                              checked={address.isDefault}
                              onChange={() => handleSetDefault(address.id)}
                            />
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleEdit(address)}
                            >
                              <FaEdit /> {t.savedAddresses.edit}
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Card className="address-card mb-3">
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>{t.savedAddresses.label}</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={t.savedAddresses.placeholderLabel}
                            disabled
                            className={language === 'ar' ? 'text-end' : 'text-start'}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>{t.savedAddresses.description}</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder={t.savedAddresses.noAddresses}
                            disabled
                            className={language === 'ar' ? 'text-end' : 'text-start'}
                          />
                        </Form.Group>
                        <Form.Check
                          type="checkbox"
                          label={t.savedAddresses.default}
                          disabled
                        />
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </div>
            ) : (
              <div className={view === 'edit' ? 'edit-address' : 'new-address'}>
                <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>
                  {view === 'edit' ? t.editAddress.title : t.newAddress.title}
                </h4>
                <div className="map-placeholder mb-3">
                  <div className="map-image"></div>
                </div>
                <div
                  className={`address-type mb-3 ${language === 'ar' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <Button
                    variant={formData.type === 'Apartment' ? 'success' : 'outline-success'}
                    className="type-button me-2"
                    onClick={() => handleTypeChange('Apartment')}
                  >
                    <FaBuilding /> {t.addressTypes.Apartment}
                  </Button>
                  <Button
                    variant={formData.type === 'House' ? 'success' : 'outline-success'}
                    className="type-button me-2"
                    onClick={() => handleTypeChange('House')}
                  >
                    <FaHome /> {t.addressTypes.House}
                  </Button>
                  <Button
                    variant={formData.type === 'Work' ? 'success' : 'outline-success'}
                    className="type-button me-2"
                    onClick={() => handleTypeChange('Work')}
                  >
                    <FaBriefcase /> {t.addressTypes.Work}
                  </Button>
                  <Button
                    variant={formData.type === 'Other' ? 'success' : 'outline-success'}
                    className="type-button"
                    onClick={() => handleTypeChange('Other')}
                  >
                    <FaMapMarkerAlt /> {t.addressTypes.Other}
                  </Button>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>{view === 'edit' ? t.editAddress.label : t.newAddress.label}</Form.Label>
                    <Form.Control
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      placeholder={view === 'edit' ? t.editAddress.labelPlaceholder : t.newAddress.labelPlaceholder}
                      required
                      className={language === 'ar' ? 'text-end' : 'text-start'}
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>{view === 'edit' ? t.editAddress.aptNo : t.newAddress.aptNo}</Form.Label>
                        <Form.Control
                          type="text"
                          name="aptNo"
                          value={formData.aptNo}
                          onChange={handleInputChange}
                          placeholder={view === 'edit' ? t.editAddress.aptNoPlaceholder : t.newAddress.aptNoPlaceholder}
                          className={language === 'ar' ? 'text-end' : 'text-start'}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>{view === 'edit' ? t.editAddress.floor : t.newAddress.floor}</Form.Label>
                        <Form.Control
                          type="text"
                          name="floor"
                          value={formData.floor}
                          onChange={handleInputChange}
                          placeholder={view === 'edit' ? t.editAddress.floorPlaceholder : t.newAddress.floorPlaceholder}
                          className={language === 'ar' ? 'text-end' : 'text-start'}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>{view === 'edit' ? t.editAddress.street : t.newAddress.street}</Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder={view === 'edit' ? t.editAddress.streetPlaceholder : t.newAddress.streetPlaceholder}
                      required
                      className={language === 'ar' ? 'text-end' : 'text-start'}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{view === 'edit' ? t.editAddress.description : t.newAddress.description}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={view === 'edit' ? t.editAddress.descriptionPlaceholder : t.newAddress.descriptionPlaceholder}
                      className={language === 'ar' ? 'text-end' : 'text-start'}
                    />
                  </Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isDefault"
                    label={view === 'edit' ? t.editAddress.setDefault : t.newAddress.setDefault}
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}
                  />
                  <div
                    className={`d-flex justify-content-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                  >
                    <Button
                      variant="outline-secondary"
                      onClick={() => setView('saved')}
                    >
                      {view === 'edit' ? t.editAddress.cancel : t.newAddress.cancel}
                    </Button>
                    <Button type="submit" variant="success">
                      {view === 'edit' ? t.editAddress.updateAddress : t.newAddress.saveAddress}
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ManageAddress;
