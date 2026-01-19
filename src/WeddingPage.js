import React, { useState } from 'react';

import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Countdown from './components/Countdown';
import LoveStory from './components/LoveStory';
import Locations from './components/Locations';
import Timeline from './components/Timeline';
import RSVP from './components/RSVP';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import Gifts from './components/Gifts';
import WeddingABC from './components/WeddingABC';
import PhotoUpload from './components/PhotoUpload';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

function WeddingPage({ weddingData }) {
  const [showAdmin, setShowAdmin] = useState(false);
  
  const {
    couple = {},
    wedding = {},
    navLinks = [],
    activeComponents = {},
  } = weddingData || {};

  const { name1 = 'Sarah', name2 = 'Max' } = couple;
  const { date = '15. August 2025', dateISO = '2025-08-15T14:00:00', location = 'Schloss Heidelberg' } = wedding;
  const coupleNames = `${name1} & ${name2}`;

  const handleAdminLogin = () => setShowAdmin(true);
  const handleAdminLogout = () => setShowAdmin(false);

  if (showAdmin) {
    return <AdminDashboard coupleNames={coupleNames} onLogout={handleAdminLogout} />;
  }

  return (
    <>
      <Navigation coupleNames={coupleNames} weddingDate={date} links={navLinks} />
      {activeComponents.hero !== false && <Hero name1={name1} name2={name2} date={date} location={location} />}
      {activeComponents.countdown !== false && <Countdown weddingDate={dateISO} />}
      {activeComponents.loveStory !== false && <LoveStory />}
      {activeComponents.locations !== false && <Locations />}
      {activeComponents.timeline !== false && <Timeline />}
      {activeComponents.rsvp !== false && <RSVP />}
      {activeComponents.gallery !== false && <Gallery />}
      {activeComponents.faq !== false && <FAQ />}
      {activeComponents.gifts !== false && <Gifts />}
      {activeComponents.weddingABC !== false && <WeddingABC />}
      {activeComponents.photoUpload === true && <PhotoUpload />}
      <Footer coupleNames={coupleNames} onLogin={handleAdminLogin} />
    </>
  );
}

export default WeddingPage;
