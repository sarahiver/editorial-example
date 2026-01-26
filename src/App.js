import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EditorialGlobalStyles from './styles/GlobalStyles';

// Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import LoveStory from './components/LoveStory';
import Timeline from './components/Timeline';
import Locations from './components/Locations';
import Directions from './components/Directions';
import RSVP from './components/RSVP';
import Dresscode from './components/Dresscode';
import Gifts from './components/Gifts';
import Accommodations from './components/Accommodations';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import MusicWishes from './components/MusicWishes';
import Guestbook from './components/Guestbook';
import FAQ from './components/FAQ';
import WeddingABC from './components/WeddingABC';
import PhotoUpload from './components/PhotoUpload';
import Footer from './components/Footer';

// Standalone Pages
import AdminDashboard from './components/AdminDashboard';
import SaveTheDate from './components/SaveTheDate';
import ArchivePage from './components/ArchivePage';

// Wedding Configuration
const config = {
  // Couple Info
  coupleName: "Pauli & Mo",
  name1: "Pauli",
  name2: "Mo",
  
  // Dates
  weddingDate: "2026-08-15",
  weddingDateDisplay: "August 15, 2026",
  weddingDateISO: "2026-08-15T14:00:00",
  rsvpDeadline: "2026-07-01",
  
  // Location
  location: "Villa Aurora",
  ceremonyLocation: "Villa Aurora Gardens",
  ceremonyAddress: "123 Coastal Drive, Malibu, CA",
  ceremonyTime: "14:00",
  
  receptionLocation: "Villa Aurora Ballroom",
  receptionAddress: "123 Coastal Drive, Malibu, CA",
  receptionTime: "17:00",
  
  // Contact
  email: "hello@pauliandmo.com",
  phone: "+1 (555) 123-4567",
  instagram: "@pauliandmo",
  hashtag: "#PauliAndMo2026",
  
  // Navigation
  navLinks: [
    { label: 'Our Story', href: '#story' },
    { label: 'Schedule', href: '#timeline' },
    { label: 'Location', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'FAQ', href: '#faq' },
  ],
};

// Main Wedding Page
const WeddingPage = ({ config }) => {
  return (
    <>
      <Navigation 
        coupleNames={config.coupleName} 
        weddingDate={config.weddingDateDisplay}
        links={config.navLinks}
      />
      <Hero 
        name1={config.name1}
        name2={config.name2}
        date={config.weddingDateDisplay}
        location={config.location}
        eyebrow="We're getting married"
      />
      <Countdown weddingDate={config.weddingDateISO} />
      <LoveStory />
      <Timeline />
      <Locations />
      <Directions />
      <RSVP />
      <Dresscode />
      <Gifts />
      <Accommodations />
      <Contact />
      <Gallery />
      <MusicWishes />
      <Guestbook />
      <FAQ />
      <WeddingABC />
      <PhotoUpload />
      <Footer coupleNames={config.coupleName} />
    </>
  );
};

function App() {
  // Archive mode - controlled from Admin Dashboard
  const [isArchived, setIsArchived] = useState(false);
  
  return (
    <Router>
      <EditorialGlobalStyles />
      <Routes>
        {/* Main Wedding Site */}
        <Route 
          path="/" 
          element={
            isArchived ? (
              <Navigate to="/archive" replace />
            ) : (
              <WeddingPage config={config} />
            )
          } 
        />
        
        {/* Save the Date - Standalone */}
        <Route 
          path="/save-the-date" 
          element={<SaveTheDate config={config} />} 
        />
        
        {/* Archive Page - Post Wedding */}
        <Route 
          path="/archive" 
          element={<ArchivePage config={config} />} 
        />
        
        {/* Admin Dashboard - has its own login */}
        <Route 
          path="/admin" 
          element={<AdminDashboard config={config} onArchiveToggle={setIsArchived} />} 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
