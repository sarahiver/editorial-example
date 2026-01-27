// src/App.js
import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
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
// DEMO CONTEXT (für Seite ohne Slug)
// ============================================
const DemoContext = createContext(null);

const demoContent = {
  hero: { tagline: 'Wir heiraten', location_short: 'Hamburg', background_image: null },
  countdown: { target_date: '2026-08-15T14:00:00', title: 'Noch', show_seconds: false },
  lovestory: {
    title: 'Unsere Geschichte',
    subtitle: 'Wie alles begann',
    events: [
      { date: '2019', title: 'Das erste Treffen', description: 'Auf einer Party haben wir uns kennengelernt...', image: null },
      { date: '2020', title: 'Der erste Urlaub', description: 'Zusammen nach Italien...', image: null },
      { date: '2024', title: 'Die Verlobung', description: 'Am Strand bei Sonnenuntergang...', image: null },
    ],
  },
  timeline: {
    title: 'Ablauf',
    subtitle: 'So feiern wir',
    events: [
      { time: '14:00', title: 'Trauung', description: 'Standesamt', icon: '💒' },
      { time: '15:30', title: 'Sektempfang', description: 'Im Garten', icon: '🥂' },
      { time: '18:00', title: 'Dinner', description: 'Im Festsaal', icon: '🍽️' },
      { time: '21:00', title: 'Party', description: 'Bis in die Nacht', icon: '🎉' },
    ],
  },
  locations: {
    title: 'Die Locations',
    locations: [
      { type: 'Trauung', name: 'Standesamt Mitte', address: 'Musterstraße 1, 20095 Hamburg', time: '14:00 Uhr', image: null },
      { type: 'Feier', name: 'Schloss Traumhaft', address: 'Parkweg 10, 22085 Hamburg', time: '15:30 Uhr', image: null },
    ],
  },
  directions: { title: 'Anfahrt' },
  rsvp: { title: 'RSVP', subtitle: 'Bitte gebt uns bis zum 1. Juni Bescheid', deadline: '2026-06-01' },
  dresscode: {
    title: 'Dresscode',
    subtitle: 'Festlich elegant',
    description: 'Wir freuen uns, wenn ihr in festlicher Kleidung erscheint.',
    colors: ['#1a1a2e', '#16213e', '#e94560'],
  },
  gifts: {
    title: 'Geschenke',
    subtitle: 'Das größte Geschenk ist eure Anwesenheit',
    description: 'Falls ihr uns dennoch etwas schenken möchtet...',
    items: [
      { name: 'Hochzeitsreise', description: 'Unterstützt unsere Flitterwochen', price: null, reserved: false },
      { name: 'Küchenmaschine', description: 'Für gemeinsames Kochen', price: '€299', reserved: false },
    ],
  },
  accommodations: {
    title: 'Übernachtung',
    description: 'Hier könnt ihr übernachten',
    hotels: [
      { name: 'Hotel Beispiel', distance: '500m', price_range: '€€', description: 'Direkt am Veranstaltungsort', url: '#', image: null },
    ],
  },
  witnesses: { title: 'Trauzeugen' },
  gallery: { title: 'Galerie', images: [] },
  musicwishes: { title: 'Musikwünsche', subtitle: 'Welche Songs sollen auf keinen Fall fehlen?' },
  guestbook: { title: 'Gästebuch', subtitle: 'Hinterlasst uns eine Nachricht' },
  faq: {
    title: 'FAQ',
    subtitle: 'Häufige Fragen',
    items: [
      { question: 'Gibt es Parkplätze?', answer: 'Ja, ausreichend Parkplätze sind vorhanden.' },
      { question: 'Sind Kinder willkommen?', answer: 'Natürlich! Wir freuen uns über alle Gäste.' },
      { question: 'Gibt es vegetarisches Essen?', answer: 'Ja, bitte gebt dies bei der RSVP an.' },
    ],
  },
  weddingabc: {
    title: 'Hochzeits-ABC',
    entries: [
      { letter: 'A', title: 'Anfahrt', description: 'Beschreibung zur Anfahrt...' },
      { letter: 'B', title: 'Blumen', description: 'Bitte keine Blumen mitbringen...' },
    ],
  },
  photoupload: { title: 'Eure Fotos', description: 'Teilt eure schönsten Momente mit uns!', max_files: 10 },
  footer: { names: 'Pauli & Mo', tagline: 'Wir freuen uns auf euch!', hashtag: '#PauliUndMo2026' },
};

function DemoProvider({ children }) {
  const value = {
    project: { id: 'demo', slug: '', status: 'live', couple_names: 'Pauli & Mo' },
    content: demoContent,
    isLoading: false,
    error: null,
    getContent: (name) => demoContent[name] || {},
    isComponentActive: () => true, // All components active in demo
    getCustomStyles: () => ({}),
    status: 'live',
    theme: 'editorial',
    coupleNames: 'Pauli & Mo',
    weddingDate: '2026-08-15',
    slug: '',
    projectId: null,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// Override useWedding for demo context
const OriginalWeddingContext = require('./context/WeddingContext').default;

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
// DEMO PAGE (ohne Slug)
// ============================================
const DemoPage = () => {
  const ctx = useContext(DemoContext);
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
      <LoveStory content={demoContent.lovestory} />
      <Timeline content={demoContent.timeline} />
      <Locations content={demoContent.locations} />
      <Directions content={demoContent.directions} />
      <RSVP content={demoContent.rsvp} />
      <Dresscode content={demoContent.dresscode} />
      <Gifts content={demoContent.gifts} />
      <Accommodations content={demoContent.accommodations} />
      <Contact content={demoContent.witnesses} />
      <Gallery content={demoContent.gallery} />
      <MusicWishes content={demoContent.musicwishes} />
      <Guestbook content={demoContent.guestbook} />
      <FAQ content={demoContent.faq} />
      <WeddingABC content={demoContent.weddingabc} />
      <PhotoUpload content={demoContent.photoupload} />
      <Footer coupleNames="Pauli & Mo" content={demoContent.footer} />
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
