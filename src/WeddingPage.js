import { useState } from "react"

// Alle 20 Komponenten importieren
import Accommodations from "./components/Accommodations"
import AdminDashboard from "./components/AdminDashboard"
import Contact from "./components/Contact"
import Countdown from "./components/Countdown"
import Directions from "./components/Directions"
import Dresscode from "./components/Dresscode"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"
import Gallery from "./components/Gallery"
import Gifts from "./components/Gifts"
import Guestbook from "./components/Guestbook"
import Hero from "./components/Hero"
import Locations from "./components/Locations"
import LoveStory from "./components/LoveStory"
import MusicWishes from "./components/MusicWishes"
import Navigation from "./components/Navigation"
import PhotoUpload from "./components/PhotoUpload"
import RSVP from "./components/RSVP"
import Timeline from "./components/Timeline"
import WeddingABC from "./components/WeddingABC"

function WeddingPage({ weddingData, showBadges = false }) {
  const [showAdmin, setShowAdmin] = useState(false)

  const {
    couple = {},
    wedding = {},
    navLinks = [],
    activeComponents = {},
  } = weddingData || {}

  const { name1 = "Sarah", name2 = "Max" } = couple
  const {
    date = "15. August 2026",
    dateISO = "2026-08-15T14:00:00",
    location = "Schloss Heidelberg",
  } = wedding
  const coupleNames = `${name1} & ${name2}`

  const handleAdminLogin = () => setShowAdmin(true)
  const handleAdminLogout = () => setShowAdmin(false)

  if (showAdmin) {
    return (
      <AdminDashboard
        coupleNames={coupleNames}
        onLogout={handleAdminLogout}
        showBadge={showBadges}
      />
    )
  }

  return (
    <>
      {/* 1. Navigation (inklusive) */}
      <Navigation
        coupleNames={coupleNames}
        weddingDate={date}
        links={navLinks}
        showBadge={showBadges}
      />

      {/* 2. Hero (inklusive) */}
      {activeComponents.hero !== false && (
        <Hero
          name1={name1}
          name2={name2}
          date={date}
          location={location}
          showBadge={showBadges}
        />
      )}

      {/* 3. Countdown */}
      {activeComponents.countdown !== false && (
        <Countdown showBadge={showBadges} weddingDate={dateISO} />
      )}

      {/* 4. Love Story (inklusive) */}
      {activeComponents.loveStory !== false && (
        <LoveStory showBadge={showBadges} />
      )}

      {/* 5. Timeline / Tagesablauf */}
      {activeComponents.timeline !== false && <Timeline />}

      {/* 6. Locations */}
      {activeComponents.locations !== false && <Locations />}

      {/* 7. Anfahrt */}
      {activeComponents.directions !== false && <Directions />}

      {/* 8. RSVP (inklusive) */}
      {activeComponents.rsvp !== false && <RSVP showBadge={showBadges} />}

      {/* 9. Dresscode */}
      {activeComponents.dresscode !== false && <Dresscode />}

      {/* 10. Geschenke */}
      {activeComponents.gifts !== false && <Gifts />}

      {/* 11. Unterkünfte */}
      {activeComponents.accommodations !== false && <Accommodations />}

      {/* 12. Kontakt (Trauzeugen) */}
      {activeComponents.contact !== false && <Contact />}

      {/* 13. Galerie */}
      {activeComponents.gallery !== false && <Gallery />}

      {/* 14. Musikwünsche */}
      {activeComponents.musicWishes !== false && <MusicWishes />}

      {/* 15. Gästebuch */}
      {activeComponents.guestbook !== false && <Guestbook />}

      {/* 16. FAQ */}
      {activeComponents.faq !== false && <FAQ />}

      {/* 17. Hochzeits-ABC */}
      {activeComponents.weddingABC !== false && <WeddingABC />}

      {/* 18. Foto Upload */}
      {activeComponents.photoUpload !== false && <PhotoUpload />}

      {/* 19. Footer (inklusive) */}
      <Footer
        coupleNames={coupleNames}
        onLogin={handleAdminLogin}
        showBadge={showBadges}
      />
    </>
  )
}

export default WeddingPage
