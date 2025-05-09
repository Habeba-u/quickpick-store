import React from 'react';
import { useParams } from 'react-router-dom';
import Offers from '../components/Offers';
import CounterSection from '../components/CounterSection';

function CategoryPage() {
  
  return (
    <div>
      <Offers />
      <CounterSection />
    </div>
    
  );
}

export default CategoryPage;