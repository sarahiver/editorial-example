import React from 'react';
import EditorialGlobalStyles from './styles/GlobalStyles';
import WeddingPage from './WeddingPage';

const demoWeddingData = {
  couple: {
    name1: 'Sarah',
    name2: 'Max',
  },
  wedding: {
    date: '15. August 2025',
    dateISO: '2025-08-15T14:00:00',
    location: 'Schloss Heidelberg',
  },
  navLinks: [
    { label: 'Unser Weg', href: '#story' },
    { label: 'Hochzeit', href: '#location' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'FAQ', href: '#faq' },
  ],
  activeComponents: {
    hero: true,
    countdown: true,
    loveStory: true,
    locations: true,
    timeline: true,
    rsvp: true,
    gallery: true,
    faq: true,
    gifts: true,
    weddingABC: true,
    photoUpload: false,
  },
};

function App() {
  return (
    <>
      <EditorialGlobalStyles />
      <WeddingPage weddingData={demoWeddingData} />
    </>
  );
}

export default App;
