// src/context/WeddingContext.js
import React, { createContext, useContext } from 'react';
import { useWeddingData, useSlugDetection } from '../hooks/useWeddingData';

const WeddingContext = createContext(null);
const DemoContext = createContext(null);

// Demo content for the demo page
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
    events: [
      { time: '14:00', title: 'Trauung', description: 'Standesamt', icon: '💒', location: 'Kapelle' },
      { time: '15:30', title: 'Sektempfang', description: 'Stoßt mit uns an!', icon: '🥂', location: 'Terrasse' },
      { time: '18:00', title: 'Dinner', description: 'Im Festsaal', icon: '🍽️', location: 'Festsaal' },
      { time: '21:00', title: 'Party', description: 'Bis in die Nacht', icon: '🎉', location: 'Tanzfläche' },
    ],
  },
  locations: {
    title: 'Die Locations',
    locations: [
      { type: 'Trauung', name: 'Standesamt Mitte', address: 'Musterstraße 1, 20095 Hamburg', time: '14:00 Uhr', image: null },
      { type: 'Feier', name: 'Schloss Traumhaft', address: 'Parkweg 10, 22085 Hamburg', time: '15:30 Uhr', image: null },
    ],
  },
  directions: { title: 'Anfahrt', options: [{ icon: '🚗', title: 'Mit dem Auto', description: 'A7 Ausfahrt Hamburg-Mitte' }] },
  rsvp: { title: 'RSVP', subtitle: 'Bitte gebt uns bis zum 1. Juni Bescheid', deadline: '2026-06-01' },
  dresscode: { title: 'Dresscode', subtitle: 'Festlich elegant', description: 'Wir freuen uns auf festliche Kleidung.', colors: ['#1a1a2e', '#16213e', '#e94560'] },
  gifts: { title: 'Geschenke', subtitle: 'Das größte Geschenk ist eure Anwesenheit', items: [] },
  accommodations: { title: 'Übernachtung', description: 'Hotels in der Nähe', hotels: [] },
  witnesses: { title: 'Trauzeugen', witnesses: [] },
  gallery: { title: 'Galerie', images: [] },
  musicwishes: { title: 'Musikwünsche', description: 'Welche Songs dürfen nicht fehlen?' },
  guestbook: { title: 'Gästebuch', description: 'Hinterlasst uns eine Nachricht' },
  faq: { title: 'FAQ', items: [{ question: 'Kann ich jemanden mitbringen?', answer: 'Bitte sprecht uns vorher an.' }] },
  weddingabc: { title: 'Hochzeits-ABC', entries: [] },
  photoupload: { title: 'Eure Fotos', description: 'Teilt eure schönsten Momente!' },
  footer: { names: 'Pauli & Mo', tagline: 'Wir freuen uns auf euch!', hashtag: '#PauliUndMo2026' },
};

export function DemoProvider({ children }) {
  const value = {
    project: { id: 'demo', slug: '', status: 'live', couple_names: 'Pauli & Mo', active_components: ['all'] },
    content: demoContent,
    isLoading: false,
    error: null,
    getContent: (name) => demoContent[name] || {},
    isComponentActive: () => true,
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

export function WeddingProvider({ children, slug: propSlug }) {
  const detectedSlug = useSlugDetection();
  const slug = propSlug || detectedSlug;
  const weddingData = useWeddingData(slug);

  return (
    <WeddingContext.Provider value={weddingData}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const weddingContext = useContext(WeddingContext);
  const demoContext = useContext(DemoContext);
  
  // Use wedding context if available, otherwise demo context
  const context = weddingContext || demoContext;
  
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider or DemoProvider');
  }
  
  return context;
}

export { DemoContext };
export default WeddingContext;
