// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
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

// ============================================
// STYLED COMPONENTS FOR LANDING PAGE
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LandingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #FAFAFA;
  padding: 2rem;
`;

const LandingContent = styled.div`
  text-align: center;
  max-width: 600px;
  animation: ${fadeIn} 0.8s ease;
`;

const LandingLogo = styled.h1`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
  
  span {
    font-style: italic;
  }
`;

const LandingTagline = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const LandingCTA = styled.a`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  padding: 1.25rem 2.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
`;

const LandingLinks = styled.div`
  margin-top: 3rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const LandingLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #000;
  }
`;

const DemoNotice = styled.div`
  margin-top: 4rem;
  padding: 1.5rem 2rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: #666;
    margin: 0;
    
    code {
      background: #F5F5F5;
      padding: 0.2rem 0.4rem;
      font-size: 0.8rem;
    }
  }
`;

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
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
      <h1 style={{ 
        fontFamily: 'Instrument Serif, serif', 
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#000',
      }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
        {message || 'Das Hochzeitsprojekt konnte nicht gefunden werden.'}
      </p>
      <a 
        href="/" 
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#000',
          textDecoration: 'none',
          borderBottom: '1px solid #000',
          paddingBottom: '0.25rem',
        }}
      >
        ← Zurück zur Startseite
      </a>
    </div>
  </div>
);

// ============================================
// LANDING PAGE (ohne Slug)
// ============================================
const LandingPage = () => {
  return (
    <LandingContainer>
      <LandingContent>
        <LandingLogo>
          Iver<span>Lasting</span>
        </LandingLogo>
        <LandingTagline>
          Wunderschöne Hochzeitswebsites für euren besonderen Tag.
          Modern, elegant und individuell gestaltet.
        </LandingTagline>
        <LandingCTA href="https://iverlasting.de" target="_blank" rel="noopener">
          Mehr erfahren
        </LandingCTA>
        
        <DemoNotice>
          <p>
            Demo ansehen: <code>/demo</code> · Admin: <code>/demo/admin</code>
          </p>
        </DemoNotice>
        
        <LandingLinks>
          <LandingLink href="/demo">Demo ansehen</LandingLink>
          <LandingLink href="/demo/std">Save the Date</LandingLink>
          <LandingLink href="/demo/archiv">Archiv</LandingLink>
          <LandingLink href="/demo/admin">Admin</LandingLink>
        </LandingLinks>
      </LandingContent>
    </LandingContainer>
  );
};

// ============================================
// WEDDING PAGE (Live-Ansicht)
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
  } = useWedding();

  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
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

      <Footer coupleNames={coupleNames} content={content.footer} />
    </>
  );
};

// ============================================
// STATUS ROUTER (zeigt Seite basierend auf Status)
// ============================================
const StatusRouter = () => {
  const { status, isLoading, error, project } = useWedding();

  if (isLoading) return <LoadingScreen />;
  if (error || !project) return <ErrorScreen message={error} />;

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

// ============================================
// SLUG WRAPPER - Lädt Projekt basierend auf URL-Slug
// ============================================
const SlugWrapper = ({ children }) => {
  const { slug } = useParams();
  
  return (
    <WeddingProvider slug={slug}>
      {children}
    </WeddingProvider>
  );
};

// ============================================
// MAIN APP
// ============================================
function App() {
  return (
    <Router>
      <EditorialGlobalStyles />
      <Routes>
        {/* Landing Page (ohne Slug) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Slug-basierte Routen */}
        <Route path="/:slug" element={
          <SlugWrapper>
            <StatusRouter />
          </SlugWrapper>
        } />
        
        <Route path="/:slug/admin" element={
          <SlugWrapper>
            <AdminDashboard />
          </SlugWrapper>
        } />
        
        <Route path="/:slug/std" element={
          <SlugWrapper>
            <SaveTheDate />
          </SlugWrapper>
        } />
        
        <Route path="/:slug/archiv" element={
          <SlugWrapper>
            <ArchivePage />
          </SlugWrapper>
        } />
        
        <Route path="/:slug/preview" element={
          <SlugWrapper>
            <WeddingPage />
          </SlugWrapper>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<ErrorScreen message="Seite nicht gefunden" />} />
      </Routes>
    </Router>
  );
}

export default App;
