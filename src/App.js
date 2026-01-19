import React from 'react';
import EditorialGlobalStyles from './styles/GlobalStyles';
import WeddingPage from './WeddingPage';

const demoWeddingData = {
  couple: {
    name1: 'Sarah',
    name2: 'Max',
  },
  wedding: {
    date: '15. August 2026',
    dateISO: '2026-08-15T14:00:00',
    location: 'Schloss Heidelberg',
  },
  navLinks: [
    { label: 'Unser Weg', href: '#story' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'Location', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'FAQ', href: '#faq' },
  ],
  // Alle 20 Komponenten aktiv
  activeComponents: {
    hero: true,           // 1. Hero (inklusive)
    countdown: true,      // 2. Countdown
    loveStory: true,      // 3. Love Story (inklusive)
    timeline: true,       // 4. Timeline / Tagesablauf
    locations: true,      // 5. Locations
    directions: true,     // 6. Anfahrt
    rsvp: true,           // 7. RSVP (inklusive)
    dresscode: true,      // 8. Dresscode
    gifts: true,          // 9. Geschenke
    accommodations: true, // 10. Unterkünfte
    contact: true,        // 11. Kontakt (Trauzeugen)
    gallery: true,        // 12. Galerie
    musicWishes: true,    // 13. Musikwünsche
    guestbook: true,      // 14. Gästebuch
    faq: true,            // 15. FAQ
    weddingABC: true,     // 16. Hochzeits-ABC
    photoUpload: true,    // 17. Foto Upload
    // 18. Admin Dashboard (inklusive) - wird über Footer Login aufgerufen
    // 19. Navigation (inklusive) - immer sichtbar
    // 20. Footer (inklusive) - immer sichtbar
  },
};

function App() {
  return (
    <>
      <EditorialGlobalStyles />
      <WeddingPage 
        weddingData={demoWeddingData} 
        showBadges={true}  // Zeigt "Inklusive" Badges bei inklusiven Komponenten
      />
    </>
  );
}

export default App;
