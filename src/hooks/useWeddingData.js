// src/hooks/useWeddingData.js
import { useState, useEffect } from 'react';
import { getProjectBySlugOrDomain, getProjectContent } from '../lib/supabase';

// Default content for components (fallback if not in Supabase)
const defaultContent = {
  hero: {
    background_image: '',
    background_video: '',
    names: 'Name & Name',
    date: '2026-08-15',
    tagline: 'Wir heiraten',
    location_short: 'Location',
  },
  countdown: {
    target_date: '2026-08-15T14:00:00',
    title: '',
    show_seconds: false,
    start_date: '2026-01-01',
  },
  lovestory: {
    title: 'Unsere Geschichte',
    events: [],
  },
  timeline: {
    title: 'Tagesablauf',
    events: [],
  },
  locations: {
    locations: [],
  },
  menu: {
    title: 'Das Menü',
    courses: [],
    drinks_info: '',
  },
  weddingabc: {
    title: 'Das Hochzeits-ABC',
    entries: [],
  },
  musicwishes: {
    title: 'Musikwünsche',
    description: '',
    spotify_playlist: '',
  },
  guestbook: {
    title: 'Gästebuch',
    description: '',
    allow_images: false,
  },
  accommodations: {
    title: 'Übernachtung',
    description: '',
    hotels: [],
  },
  gifts: {
    title: 'Geschenke',
    description: '',
    show_registry: false,
    registry_url: '',
    bank_details: '',
    paypal_link: '',
    items: [],
  },
  photoupload: {
    title: 'Teilt eure Fotos',
    description: '',
    max_files: 10,
    moderation: true,
  },
  witnesses: {
    title: 'Eure Ansprechpartner',
    persons: [],
  },
  faq: {
    title: 'Häufige Fragen',
    questions: [],
  },
  directions: {
    title: 'Anfahrt',
    address: '',
    maps_embed: '',
    parking_info: '',
    public_transport: '',
    taxi_info: '',
  },
  rsvp: {
    title: 'Zusage',
    description: '',
    deadline: '',
    ask_dietary: true,
    ask_allergies: true,
    ask_song_wish: false,
    persons: 1,
  },
  gallery: {
    title: 'Galerie',
    images: [],
    layout: 'grid',
  },
  contact: {
    title: 'Kontakt',
    couple_email: '',
    couple_phone: '',
    show_form: false,
  },
  dresscode: {
    title: 'Dresscode',
    code: '',
    description: '',
    colors: [],
    dos: [],
    donts: [],
    images: [],
  },
  footer: {
    names: 'Name & Name',
    date: '2026-08-15',
    hashtag: '',
    impressum_url: '',
    datenschutz_url: '',
  },
  savethedate: {
    hero_image: '',
    names: 'Name & Name',
    date: '2026-08-15',
    tagline: 'Save the Date',
    location_teaser: '',
    countdown_active: true,
    message: '',
  },
  archive: {
    hero_image: '',
    thank_you_title: 'Danke!',
    thank_you_text: '',
    gallery_active: true,
    gallery_images: [],
    guestbook_active: true,
    photoupload_active: false,
    video_url: '',
  },
};

export function useWeddingData(slugOrDomain) {
  const [project, setProject] = useState(null);
  const [content, setContent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!slugOrDomain) {
        setIsLoading(false);
        setError('No slug or domain provided');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch project
        const { data: projectData, error: projectError } = await getProjectBySlugOrDomain(slugOrDomain);
        
        if (projectError || !projectData) {
          setError('Project not found');
          setIsLoading(false);
          return;
        }

        setProject(projectData);

        // Fetch content
        const { data: contentData, error: contentError } = await getProjectContent(projectData.id);
        
        if (contentError) {
          console.warn('Error fetching content:', contentError);
        }

        // Merge with defaults
        const mergedContent = { ...defaultContent };
        Object.keys(contentData).forEach(component => {
          mergedContent[component] = {
            ...defaultContent[component],
            ...contentData[component],
          };
        });

        setContent(mergedContent);
      } catch (err) {
        console.error('Error fetching wedding data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slugOrDomain]);

  // Helper to get content for a specific component
  const getContent = (componentName) => {
    return content[componentName] || defaultContent[componentName] || {};
  };

  // Check if a component is active
  const isComponentActive = (componentName) => {
    if (!project) return false;
    return project.active_components?.includes(componentName) || false;
  };

  // Get custom styles
  const getCustomStyles = () => {
    return project?.custom_styles || {};
  };

  return {
    project,
    content,
    isLoading,
    error,
    getContent,
    isComponentActive,
    getCustomStyles,
    // Convenience properties
    status: project?.status || 'live',
    theme: project?.theme || 'editorial',
    coupleNames: project?.couple_names || 'Name & Name',
    weddingDate: project?.wedding_date || '2026-08-15',
    slug: project?.slug || '',
    projectId: project?.id || null,
  };
}

// Hook for detecting slug from URL or domain
export function useSlugDetection() {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    // Try to get slug from URL path first (e.g., /demo, /wedding)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    
    // Reserved paths that are not slugs
    const reservedPaths = ['admin', 'std', 'archiv', 'preview'];
    
    if (pathParts.length > 0 && !reservedPaths.includes(pathParts[0])) {
      setSlug(pathParts[0]);
      return;
    }

    // Check for slug query param (legacy support)
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get('slug');
    if (slugParam) {
      setSlug(slugParam);
      return;
    }

    // For localhost/vercel without slug → null (shows landing page)
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.includes('vercel.app')) {
      setSlug(null);
      return;
    }

    // Use custom domain as identifier (e.g., sarahundiver.de)
    setSlug(hostname);
  }, []);

  return slug;
}

export default useWeddingData;
