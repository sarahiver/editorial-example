// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import EditorialGlobalStyles from './styles/GlobalStyles';
import { WeddingProvider, DemoProvider, useWedding } from './context/WeddingContext';

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

// ============================================
// LOADING & ERROR SCREENS
// ============================================
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

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
      <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
        {message || 'Das Hochzeitsprojekt konnte nicht gefunden werden.'}
      </p>
      <a href="/" style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.75rem',
        fontWeight: '500',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#000',
        textDecoration: 'none',
        borderBottom: '1px solid #000',
        paddingBottom: '0.25rem',
      }}>
        ← Zurück zur Startseite
      </a>
    </div>
  </div>
);

// ============================================
// DEMO PAGE (ohne Slug - nutzt DemoProvider)
// ============================================
const DemoPage = () => {
  const { content } = useWedding();
  const navLinks = [
    { label: 'Unsere Geschichte', href: '#story' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'Location', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <Navigation coupleNames="Pauli & Mo" weddingDate="15. August 2026" links={navLinks} />
      <Hero name1="Pauli" name2="Mo" date="15. August 2026" location="Hamburg" eyebrow="Wir heiraten" />
      <Countdown weddingDate="2026-08-15T14:00:00" />
      <LoveStory content={content.lovestory} />
      <Timeline content={content.timeline} />
      <Locations content={content.locations} />
      <Directions content={content.directions} />
      <RSVP content={content.rsvp} />
      <Dresscode content={content.dresscode} />
      <Gifts content={content.gifts} />
      <Accommodations content={content.accommodations} />
      <Contact content={content.witnesses} />
      <Gallery content={content.gallery} />
      <MusicWishes content={content.musicwishes} />
      <Guestbook content={content.guestbook} />
      <FAQ content={content.faq} />
      <WeddingABC content={content.weddingabc} />
      <PhotoUpload content={content.photoupload} />
      <Footer coupleNames="Pauli & Mo" content={content.footer} />
    </>
  );
};

// ============================================
// WEDDING PAGE (mit Slug - lädt echte Daten)
// ============================================
const WeddingPage = () => {
  const { 
    project, 
    content, 
    isLoading, 
    error, 
    isComponentActive,
    coupleNames,
    weddingDate,
    slug,
  } = useWedding();

  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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
      <Navigation 
        coupleNames={coupleNames}
        weddingDate={formatDate(weddingDate)}
        links={navLinks}
      />

      <Hero 
        name1={coupleNames.split('&')[0]?.trim() || 'Name'}
        name2={coupleNames.split('&')[1]?.trim() || 'Name'}
        date={formatDate(weddingDate)}
        location={heroContent.location_short || ''}
        eyebrow={heroContent.tagline || 'Wir heiraten'}
        backgroundImage={heroContent.background_image}
      />

      {isComponentActive('countdown') && (
        <Countdown 
          weddingDate={countdownContent.target_date || `${weddingDate}T14:00:00`}
          title={countdownContent.title}
          showSeconds={countdownContent.show_seconds}
        />
      )}

      {isComponentActive('lovestory') && <LoveStory content={content.lovestory} />}
      {isComponentActive('timeline') && <Timeline content={content.timeline} />}
      {isComponentActive('locations') && <Locations content={content.locations} />}
      {isComponentActive('directions') && <Directions content={content.directions} />}
      {isComponentActive('rsvp') && <RSVP content={content.rsvp} />}
      {isComponentActive('dresscode') && <Dresscode content={content.dresscode} />}
      {isComponentActive('gifts') && <Gifts content={content.gifts} />}
      {isComponentActive('accommodations') && <Accommodations content={content.accommodations} />}
      {isComponentActive('witnesses') && <Contact content={content.witnesses} />}
      {isComponentActive('gallery') && <Gallery content={content.gallery} />}
      {isComponentActive('musicwishes') && <MusicWishes content={content.musicwishes} />}
      {isComponentActive('guestbook') && <Guestbook content={content.guestbook} />}
      {isComponentActive('faq') && <FAQ content={content.faq} />}
      {isComponentActive('weddingabc') && <WeddingABC content={content.weddingabc} />}
      {isComponentActive('photoupload') && <PhotoUpload content={content.photoupload} />}

      <Footer coupleNames={coupleNames} content={content.footer} slug={slug} />
    </>
  );
};

// ============================================
// STATUS ROUTER
// ============================================
const StatusRouter = () => {
  const { status, isLoading, error, project } = useWedding();

  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

  switch (status) {
    case 'std': return <SaveTheDate />;
    case 'archiv': return <ArchivePage />;
    default: return <WeddingPage />;
  }
};

// ============================================
// SLUG WRAPPER
// ============================================
const SlugWrapper = ({ children }) => {
  const { slug } = useParams();
  return <WeddingProvider slug={slug}>{children}</WeddingProvider>;
};

// ============================================
// MAIN APP
// ============================================
function App() {
  return (
    <Router>
      <EditorialGlobalStyles />
      <Routes>
        {/* Startseite ohne Slug → Demo mit DemoProvider */}
        <Route path="/" element={
          <DemoProvider>
            <DemoPage />
          </DemoProvider>
        } />
        
        {/* Slug-basierte Routen */}
        <Route path="/:slug" element={<SlugWrapper><StatusRouter /></SlugWrapper>} />
        <Route path="/:slug/admin" element={<SlugWrapper><AdminDashboard /></SlugWrapper>} />
        <Route path="/:slug/std" element={<SlugWrapper><SaveTheDate /></SlugWrapper>} />
        <Route path="/:slug/archiv" element={<SlugWrapper><ArchivePage /></SlugWrapper>} />
        <Route path="/:slug/preview" element={<SlugWrapper><WeddingPage /></SlugWrapper>} />
        
        {/* Fallback */}
        <Route path="*" element={<ErrorScreen message="Seite nicht gefunden" />} />
      </Routes>
    </Router>
  );
}

export default App;
