import React, { useContext, useState } from 'react';
import { Nav, Modal, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/AccountSidebar.css';

function AccountSidebar() {
  const { logout } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

  // Translations
  const translations = {
    en: {
      personalInfo: 'Personal Information',
      myOrders: 'My Orders',
      myWallet: 'My Wallet',
      manageAddress: 'Manage Address',
      paymentMethod: 'Payment Method',
      changePassword: 'Change Password',
      logout: 'Logout',
      logoutModal: {
        title: 'Log out from QuickPick',
        message: 'Are you sure you would like to sign out of your QuickPick account?',
        cancel: 'Cancel',
        confirm: 'Log out',
      },
    },
    ar: {
      personalInfo: 'المعلومات الشخصية',
      myOrders: 'طلباتي',
      myWallet: 'محفظتي',
      manageAddress: 'إدارة العنوان',
      paymentMethod: 'طريقة الدفع',
      changePassword: 'تغيير كلمة المرور',
      logout: 'تسجيل الخروج',
      logoutModal: {
        title: 'تسجيل الخروج من QuickPick',
        message: 'هل أنت متأكد أنك تريد تسجيل الخروج من حساب QuickPick الخاص بك؟',
        cancel: 'إلغاء',
        confirm: 'تسجيل الخروج',
      },
    },
  };

  const t = translations[language];

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Show the logout confirmation modal
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/'); // Redirect to homepage after logout
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // Close the modal without logging out
  };

  // Determine active link based on current path
  const getActiveKey = () => {
    if (location.pathname.includes('myaccount')) return 'personalInfo';
    if (location.pathname.includes('my-orders')) return 'myOrders';
    if (location.pathname.includes('manage-address')) return 'manageAddress';
    if (location.pathname.includes('payment-method')) return 'paymentMethod';
    if (location.pathname.includes('my-wallet')) return 'mywallet';
    if (location.pathname.includes('change-password')) return 'changePassword';
    if (location.pathname.includes('logout')) return 'logout';
    return 'personalInfo'; // Default
  };

  return (
    <>
      <Nav
        variant="pills"
        className={`flex-column account-sidebar ${language === 'ar' ? 'text-end' : 'text-start'}`}
        activeKey={getActiveKey()}
        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
      >
        <Nav.Item>
          <Nav.Link as={Link} to="/account/myaccount" eventKey="personalInfo">
            {t.personalInfo}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/account/my-orders" eventKey="myOrders">
            {t.myOrders}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/account/my-wallet" eventKey="mywallet">
            {t.myWallet}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/account/manage-address" eventKey="manageAddress">
            {t.manageAddress}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/account/payment-method" eventKey="paymentMethod">
            {t.paymentMethod}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/account/change-password" eventKey="changePassword">
            {t.changePassword}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="logout" onClick={handleLogoutClick}>
            {t.logout}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={handleLogoutCancel}
        centered
        dialogClassName="logout-modal"
      >
        <Modal.Body>
          <div className={`logout-modal-content ${language === 'ar' ? 'text-end' : 'text-start'}`}>
            <h5>{t.logoutModal.title}</h5>
            <p>{t.logoutModal.message}</p>
            <div
              className={`d-flex justify-content-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <Button
                variant="success"
                onClick={handleLogoutCancel}
                className="logout-modal-btn cancel-btn"
              >
                {t.logoutModal.cancel}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleLogoutConfirm}
                className="logout-modal-btn confirm-btn"
              >
                {t.logoutModal.confirm}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AccountSidebar;
