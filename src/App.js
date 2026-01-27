// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EditorialGlobalStyles from './styles/GlobalStyles';
import { WeddingProvider, useWedding } from './context/WeddingContext';

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

// Loading Screen
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FAFAFA',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '2px solid #E0E0E0',
        borderTopColor: '#000',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
      }} />
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Laden...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

// Error Screen
const ErrorScreen = ({ message }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FAFAFA',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ 
        fontFamily: 'Instrument Serif, serif', 
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#000',
      }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        {message || 'Das Hochzeitsprojekt konnte nicht gefunden werden.'}
      </p>
    </div>
  </div>
);

// Main Wedding Page - renders active components
const WeddingPage = () => {
  const { 
    project, 
    content, 
    isLoading, 
    error, 
    isComponentActive,
    coupleNames,
    weddingDate,
  } = useWedding();

  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Build navigation links based on active components
  const navLinks = [];
  if (isComponentActive('lovestory')) navLinks.push({ label: 'Unsere Geschichte', href: '#story' });
  if (isComponentActive('timeline')) navLinks.push({ label: 'Ablauf', href: '#timeline' });
  if (isComponentActive('locations')) navLinks.push({ label: 'Location', href: '#location' });
  if (isComponentActive('rsvp')) navLinks.push({ label: 'RSVP', href: '#rsvp' });
  if (isComponentActive('faq')) navLinks.push({ label: 'FAQ', href: '#faq' });

  const heroContent = content.hero || {};
  const countdownContent = content.countdown || {};

  return (
    <>
      {/* Navigation - always shown */}
      <Navigation 
        coupleNames={coupleNames}
        weddingDate={formatDate(weddingDate)}
        links={navLinks}
      />

      {/* Hero - always shown */}
      <Hero 
        name1={coupleNames.split('&')[0]?.trim() || 'Name'}
        name2={coupleNames.split('&')[1]?.trim() || 'Name'}
        date={formatDate(weddingDate)}
        location={heroContent.location_short || ''}
        eyebrow={heroContent.tagline || 'Wir heiraten'}
        backgroundImage={heroContent.background_image}
        backgroundVideo={heroContent.background_video}
      />

      {/* Countdown */}
      {isComponentActive('countdown') && (
        <Countdown 
          weddingDate={countdownContent.target_date || `${weddingDate}T14:00:00`}
          title={countdownContent.title}
          showSeconds={countdownContent.show_seconds}
        />
      )}

      {/* Love Story */}
      {isComponentActive('lovestory') && (
        <LoveStory content={content.lovestory} />
      )}

      {/* Timeline */}
      {isComponentActive('timeline') && (
        <Timeline content={content.timeline} />
      )}

      {/* Locations */}
      {isComponentActive('locations') && (
        <Locations content={content.locations} />
      )}

      {/* Directions */}
      {isComponentActive('directions') && (
        <Directions content={content.directions} />
      )}

      {/* RSVP */}
      {isComponentActive('rsvp') && (
        <RSVP content={content.rsvp} />
      )}

      {/* Dresscode */}
      {isComponentActive('dresscode') && (
        <Dresscode content={content.dresscode} />
      )}

      {/* Gifts */}
      {isComponentActive('gifts') && (
        <Gifts content={content.gifts} />
      )}

      {/* Accommodations */}
      {isComponentActive('accommodations') && (
        <Accommodations content={content.accommodations} />
      )}

      {/* Contact / Witnesses */}
      {isComponentActive('witnesses') && (
        <Contact content={content.witnesses} />
      )}

      {/* Gallery */}
      {isComponentActive('gallery') && (
        <Gallery content={content.gallery} />
      )}

      {/* Music Wishes */}
      {isComponentActive('musicwishes') && (
        <MusicWishes content={content.musicwishes} />
      )}

      {/* Guestbook */}
      {isComponentActive('guestbook') && (
        <Guestbook content={content.guestbook} />
      )}

      {/* FAQ */}
      {isComponentActive('faq') && (
        <FAQ content={content.faq} />
      )}

      {/* Wedding ABC */}
      {isComponentActive('weddingabc') && (
        <WeddingABC content={content.weddingabc} />
      )}

      {/* Photo Upload */}
      {isComponentActive('photoupload') && (
        <PhotoUpload content={content.photoupload} />
      )}

      {/* Footer - always shown */}
      <Footer 
        coupleNames={coupleNames}
        content={content.footer}
      />
    </>
  );
};

// Status-based Router - shows correct page based on project status
const StatusRouter = () => {
  const { status, isLoading, error, project } = useWedding();

  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

  // Route based on status
  switch (status) {
    case 'std':
      return <SaveTheDate />;
    case 'archiv':
      return <ArchivePage />;
    case 'live':
    default:
      return <WeddingPage />;
  }
};

// Main App
function App() {
  return (
    <Router>
      <EditorialGlobalStyles />
      <WeddingProvider>
        <Routes>
          {/* Main route - shows page based on status */}
          <Route path="/" element={<StatusRouter />} />
          
          {/* Force specific views (for previewing) */}
          <Route path="/preview" element={<WeddingPage />} />
          <Route path="/save-the-date" element={<SaveTheDate />} />
          <Route path="/archive" element={<ArchivePage />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Slug-based routing (for multi-project setup) */}
          <Route path="/:slug" element={<StatusRouter />} />
          <Route path="/:slug/admin" element={<AdminDashboard />} />
          <Route path="/:slug/preview" element={<WeddingPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WeddingProvider>
    </Router>
  );
}

export default App;
