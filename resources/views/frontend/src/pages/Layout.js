import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomNavbar from '../components/Navbar';
import FloatingCartButton from '../components/FloatingCartButton';
import FooterSection from '../components/FooterSection';

function Layout() {
  return (
    <div>
      <CustomNavbar />
      <main>
        <Outlet />
      </main>
      <FloatingCartButton />
      <FooterSection />
    </div>
  );
}

export default Layout;