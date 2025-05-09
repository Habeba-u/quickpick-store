import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { House, List, Box, Cart, People, Percent, BarChart, Gear, BoxArrowRight } from 'react-bootstrap-icons';
import '../styles/styles.css';

function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://127.0.0.1:8000/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({}),
        credentials: 'include',
      });
      logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="sidebar p-3">
      <div className="mb-4 text-center">
        <h4 className="sidebar-title">QuickPick</h4>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/dashboard"
          >
            <House className="me-2" /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/categories"
          >
            <List className="me-2" /> Categories
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/products"
          >
            <Box className="me-2" /> Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/orders"
          >
            <Cart className="me-2" /> Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/users"
          >
            <People className="me-2" /> Users
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/promotions"
          >
            <Percent className="me-2" /> Promotions
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/reports"
          >
            <BarChart className="me-2" /> Reports
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/admin/settings"
          >
            <Gear className="me-2" /> Settings
          </NavLink>
        </li>
        <li className="nav-item mt-auto">
          <button
            className="nav-link btn btn-link"
            onClick={handleLogout}
          >
            <BoxArrowRight className="me-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
