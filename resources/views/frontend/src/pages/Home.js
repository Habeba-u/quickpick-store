import React from 'react';
import Banner from '../components/Banner';
import DealsSection from '../components/DealsSection';
import PopularProducts from '../components/PopularProducts';
import CategoriesSection from '../components/CategoriesSection';
import PromoSection from '../components/PromoSection';
import HowItWorksSection from '../components/HowItWorksSection';
import PromoBannerSection from '../components/PromoBannerSection';
import CounterSection from '../components/CounterSection';

function Home() {
  console.log('Home rendering');
  return (
    <div>
      <Banner />
      <DealsSection />
      <PopularProducts />
      <CategoriesSection />
      <PromoBannerSection />
      <PromoSection />
      <HowItWorksSection />
      <CounterSection />
    </div>
  );
}

export default Home;