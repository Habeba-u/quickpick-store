import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/FloatingCartButton.css';

function FloatingCartButton() {
  const { itemCount } = useContext(CartContext);

  return (
    <Link to="/cart" className="floating-cart-button" aria-label={`Cart with ${itemCount} items`}>
      <div className="cart-content">
        <img
          src={process.env.PUBLIC_URL + '/assets/person-pushing-cart.png'} // Replace with your image
          alt="Person pushing cart"
          className="cart-icon"
        />
        {itemCount > 0 && (
          <span className="cart-badge">{itemCount}</span>
        )}
      </div>
    </Link>
  );
}

export default FloatingCartButton;