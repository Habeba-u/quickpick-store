import React from 'react';

import WishList from '../components/WishList';
import BorderHeader from '../components/BorderHeader';


function WishListPage() {
  console.log('Home rendering');
  return (
    <div>
      <BorderHeader />
      <WishList />
    </div>
  );
}

export default WishListPage;