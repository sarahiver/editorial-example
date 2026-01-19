// Editorial Theme - Demo App
import EditorialGlobalStyles from "./styles/GlobalStyles"
import WeddingPage from "./WeddingPage"

// Custom wedding data for demo
const demoWeddingData = {
  couple: {
    name1: "Sarah",
    name2: "Max",
    coupleNames: "Sarah & Max",
  },

  wedding: {
    date: "2025-08-15T14:00:00",
    dateFormatted: "15. August 2025",
    location: "Schloss Heidelberg",
  },

  navLinks: [
    { label: "Unser Weg", href: "#story" },
    { label: "Hochzeit", href: "#location" },
    { label: "Ablauf", href: "#timeline" },
    { label: "RSVP", href: "#rsvp" },
    { label: "Galerie", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
  ],

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
    photoUpload: false,
  },
}

function App() {
  return (
    <>
      <EditorialGlobalStyles />
      <WeddingPage weddingData={demoWeddingData} />
    </>
  )
}

export default App
