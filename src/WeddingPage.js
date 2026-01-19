// Editorial Theme - Wedding Page (Complete Website)
import React, { useState } from 'react';
import styled from 'styled-components';

// Import all components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import LoveStory from './components/LoveStory';
import RSVP from './components/RSVP';
import Gallery from './components/Gallery';
import Locations from './components/Locations';
import Gifts from './components/Gifts';
import Timeline from './components/Timeline';
import FAQ from './components/FAQ';
import WeddingABC from './components/WeddingABC';
import PhotoUpload from './components/PhotoUpload';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
`;

// Default wedding data - würde später aus der Datenbank kommen
const defaultWeddingData = {
  // Couple Info
  couple: {
    name1: 'Sarah',
    name2: 'Max',
    coupleNames: 'Sarah & Max',
  },
  
  // Wedding Details
  wedding: {
    date: '2025-08-15T14:00:00',
    dateFormatted: '15. August 2025',
    location: 'Schloss Heidelberg',
  },
  
  // Navigation Links
  navLinks: [
    { label: 'Unser Weg', href: '#story' },
    { label: 'Hochzeit', href: '#location' },
    { label: 'Ablauf', href: '#timeline' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ],
  
  // Love Story Milestones
  milestones: [
    {
      year: '2018',
      title: 'Das erste Treffen',
      text: 'Bei einem gemeinsamen Freund lernten wir uns kennen – und wussten sofort, dass etwas Besonderes beginnt.',
      image: null,
    },
    {
      year: '2019',
      title: 'Der erste Urlaub',
      text: 'Unsere erste gemeinsame Reise nach Italien. Zwischen Pasta und Sonnenuntergängen wuchs unsere Liebe.',
      image: null,
    },
    {
      year: '2021',
      title: 'Zusammengezogen',
      text: 'Endlich unter einem Dach! Unsere kleine Wohnung wurde zum Zuhause voller Lachen und Liebe.',
      image: null,
    },
    {
      year: '2024',
      title: 'Der Antrag',
      text: 'An einem verschneiten Winterabend stellte Max die wichtigste Frage – und Sarah sagte JA!',
      image: null,
    },
  ],
  
  // Locations
  locations: [
    {
      type: 'Trauung',
      name: 'Schloss Heidelberg',
      address: 'Schlosshof 1, 69117 Heidelberg',
      time: '14:00 Uhr',
      description: 'Die standesamtliche Trauung findet im historischen Königssaal statt.',
      image: null,
      mapUrl: 'https://maps.google.com/?q=Schloss+Heidelberg',
    },
    {
      type: 'Feier',
      name: 'Restaurant Schlossweinstube',
      address: 'Schlosshof 5, 69117 Heidelberg',
      time: '16:00 Uhr',
      description: 'Direkt neben dem Schloss feiern wir bis in die Nacht.',
      image: null,
      mapUrl: 'https://maps.google.com/?q=Schlossweinstube+Heidelberg',
    },
  ],
  
  // Timeline Events
  timelineEvents: [
    { time: '14:00', icon: '💒', title: 'Trauung', description: 'Standesamtliche Trauung im Königssaal', location: 'Schloss Heidelberg', highlight: true },
    { time: '15:00', icon: '🥂', title: 'Sektempfang', description: 'Empfang im Schlossgarten mit Häppchen', location: 'Schlossgarten', highlight: false },
    { time: '16:30', icon: '📸', title: 'Gruppenfoto', description: 'Alle Gäste für ein gemeinsames Foto', location: 'Schlossterrasse', highlight: false },
    { time: '17:30', icon: '🍽️', title: 'Dinner', description: '4-Gänge-Menü im festlichen Ambiente', location: 'Restaurant', highlight: true },
    { time: '20:00', icon: '💃', title: 'Eröffnungstanz', description: 'Der erste Tanz als Ehepaar', location: 'Tanzsaal', highlight: false },
    { time: '21:00', icon: '🎉', title: 'Party', description: 'Feiert mit uns bis in die Nacht!', location: 'Tanzsaal', highlight: false },
  ],
  
  // Gallery Images
  galleryImages: [
    { src: null, alt: 'Foto 1' },
    { src: null, alt: 'Foto 2' },
    { src: null, alt: 'Foto 3' },
    { src: null, alt: 'Foto 4' },
    { src: null, alt: 'Foto 5' },
    { src: null, alt: 'Foto 6' },
  ],
  
  // FAQ
  faqs: [
    { question: 'Gibt es einen Dresscode?', answer: 'Wir freuen uns über festliche Kleidung. Die Herren dürfen gerne im Anzug erscheinen, Damen in eleganten Kleidern.' },
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Aufgrund begrenzter Plätze können wir leider nur die auf der Einladung genannten Personen empfangen.' },
    { question: 'Sind Kinder willkommen?', answer: 'Ja! Wir feiern gerne mit euren Kindern. Es wird eine kleine Spielecke geben.' },
    { question: 'Gibt es Übernachtungsmöglichkeiten?', answer: 'Wir haben Zimmerkontingente in nahegelegenen Hotels reserviert. Bei Buchung "Hochzeit Sarah & Max" angeben.' },
    { question: 'Darf ich Fotos machen?', answer: 'Während der Trauung bitten wir um Smartphone-Verzicht. Bei der Feier dürft ihr gerne fotografieren!' },
    { question: 'Was ist mit Geschenken?', answer: 'Eure Anwesenheit ist das größte Geschenk. Weitere Infos unter "Geschenke".' },
  ],
  
  // Wedding ABC
  abcEntries: [
    { letter: 'A', title: 'Anfahrt', text: 'Das Schloss ist gut mit dem Auto erreichbar. Parkplätze stehen kostenlos zur Verfügung.' },
    { letter: 'B', title: 'Blumen', text: 'Bitte bringt keine Blumen mit, wir haben bereits für Deko gesorgt.' },
    { letter: 'D', title: 'Dresscode', text: 'Festlich elegant. Herren im Anzug, Damen im Kleid.' },
    { letter: 'F', title: 'Fotos', text: 'Während der Trauung Smartphone-Verzicht. Danach freuen wir uns über eure Schnappschüsse!' },
    { letter: 'K', title: 'Kinder', text: 'Herzlich willkommen! Es gibt eine Spielecke.' },
    { letter: 'P', title: 'Parken', text: 'Kostenlose Parkplätze am Schloss, ausgeschildert.' },
    { letter: 'S', title: 'Shuttle', text: 'Zwischen Hotel und Location verkehrt ein kostenloser Shuttle.' },
    { letter: 'W', title: 'Wetter', text: 'Die Feier findet bei jedem Wetter statt. Bei Regen weichen wir aus.' },
  ],
  
  // Gift Details
  gifts: {
    honeymoonText: 'Wir träumen von einer unvergesslichen Hochzeitsreise. Über einen Beitrag würden wir uns sehr freuen.',
    bankDetails: {
      recipient: 'Sarah & Max Mustermann',
      iban: 'DE89 3704 0044 0532 0130 00',
      bic: 'COBADEFFXXX',
      reference: 'Hochzeitsreise',
    },
    wishlistUrl: null,
  },
  
  // RSVP Settings
  rsvp: {
    deadline: '15. Juni 2025',
    menuOptions: ['Fleisch', 'Fisch', 'Vegetarisch', 'Vegan'],
  },
  
  // Contact
  contact: {
    email: 'hochzeit@sarah-und-max.de',
  },
  
  // Active Components (welche Sections angezeigt werden)
  activeComponents: {
    hero: true,
    countdown: true,
    loveStory: true,
    locations: true,
    timeline: true,
    rsvp: true,
    gallery: true,
    gifts: true,
    faq: true,
    weddingABC: true,
    photoUpload: false, // Aktiviert nach der Hochzeit
  },
};

function WeddingPage({ 
  weddingData = defaultWeddingData,
  isAdmin = false,
  onLogout = () => {},
}) {
  const [rsvpResponses, setRsvpResponses] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  
  const data = { ...defaultWeddingData, ...weddingData };
  const { couple, wedding, activeComponents } = data;

  const handleRSVPSubmit = (formData) => {
    const newResponse = {
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: formData.attendance === 'yes' ? 'yes' : 'no',
    };
    setRsvpResponses(prev => [...prev, newResponse]);
    console.log('RSVP submitted:', newResponse);
  };

  const handlePhotoUpload = (files, guestName) => {
    const newPhotos = files.map((file, i) => ({
      id: Date.now() + i,
      url: URL.createObjectURL(file),
      guestName,
      uploadDate: new Date().toISOString().split('T')[0],
    }));
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    console.log('Photos uploaded:', newPhotos);
  };

  const handleLogin = (email, password) => {
    console.log('Login attempt:', email);
    // Hier würde die echte Auth-Logik kommen
  };

  // Admin View
  if (isAdmin) {
    return (
      <PageWrapper>
        <Navigation 
          coupleNames={couple.coupleNames}
          weddingDate={wedding.dateFormatted}
          links={[{ label: '← Zurück zur Website', href: '#' }]}
        />
        <AdminDashboard
          coupleNames={couple.coupleNames}
          rsvpData={rsvpResponses.length > 0 ? rsvpResponses : [
            { name: 'Max Mustermann', email: 'max@email.de', status: 'yes', guests: 2, menu: 'Fleisch', date: '2024-03-15' },
            { name: 'Anna Schmidt', email: 'anna@email.de', status: 'yes', guests: 1, menu: 'Vegetarisch', date: '2024-03-14' },
          ]}
          photos={uploadedPhotos}
          onLogout={onLogout}
        />
      </PageWrapper>
    );
  }

  // Guest View
  return (
    <PageWrapper>
      <Navigation 
        coupleNames={couple.coupleNames}
        weddingDate={wedding.dateFormatted}
        links={data.navLinks}
      />
      
      {activeComponents.hero && (
        <Hero
          name1={couple.name1}
          name2={couple.name2}
          date={wedding.dateFormatted}
          location={wedding.location}
        />
      )}
      
      {activeComponents.countdown && (
        <Countdown
          weddingDate={wedding.date}
          message="Wir können es kaum erwarten, diesen besonderen Tag mit euch zu teilen."
        />
      )}
      
      {activeComponents.loveStory && (
        <LoveStory
          milestones={data.milestones}
        />
      )}
      
      {activeComponents.locations && (
        <Locations
          locations={data.locations}
          infoTitle="Anreise & Parken"
          infoText="Parkplätze sind am Schloss begrenzt verfügbar. Wir empfehlen die Anreise mit öffentlichen Verkehrsmitteln."
        />
      )}
      
      {activeComponents.timeline && (
        <Timeline
          events={data.timelineEvents}
          note="Zeiten können sich leicht verschieben. Wir halten euch auf dem Laufenden!"
        />
      )}
      
      {activeComponents.rsvp && (
        <RSVP
          deadline={data.rsvp.deadline}
          menuOptions={data.rsvp.menuOptions}
          onSubmit={handleRSVPSubmit}
        />
      )}
      
      {activeComponents.gallery && (
        <Gallery
          images={data.galleryImages}
        />
      )}
      
      {activeComponents.gifts && (
        <Gifts
          honeymoonText={data.gifts.honeymoonText}
          bankDetails={data.gifts.bankDetails}
          wishlistUrl={data.gifts.wishlistUrl}
        />
      )}
      
      {activeComponents.faq && (
        <FAQ
          faqs={data.faqs}
          contactEmail={data.contact.email}
        />
      )}
      
      {activeComponents.weddingABC && (
        <WeddingABC
          entries={data.abcEntries}
        />
      )}
      
      {activeComponents.photoUpload && (
        <PhotoUpload
          onUpload={handlePhotoUpload}
          totalPhotos={uploadedPhotos.length}
          totalGuests={new Set(uploadedPhotos.map(p => p.guestName)).size}
        />
      )}
      
      <Footer
        coupleNames={couple.coupleNames}
        weddingDate={wedding.dateFormatted}
        links={data.navLinks.slice(0, 3)}
        quickLinks={data.navLinks.slice(3)}
        onLogin={handleLogin}
      />
    </PageWrapper>
  );
}

export default WeddingPage;
