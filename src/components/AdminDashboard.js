// src/components/AdminDashboard.js - Complete Admin with All Components
import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../context/WeddingContext';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import {
  getRSVPResponses,
  getGuestbookEntries,
  getMusicWishes,
  getPhotoUploads,
  updateProjectStatus,
  approveGuestbookEntry,
  deleteGuestbookEntry,
  approvePhotoUpload,
  deletePhotoUpload,
  deleteMusicWish,
  updateProjectContent,
} from '../lib/supabase';

// ============================================
// STYLED COMPONENTS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Login
const LoginContainer = styled.div`min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #FAFAFA;`;
const LoginBox = styled.div`background: #FFF; border: 1px solid #E0E0E0; max-width: 420px; width: 90%; padding: 3rem; animation: ${fadeIn} 0.6s ease;`;
const LoginLogo = styled.div`text-align: center; margin-bottom: 2.5rem; h1 { font-family: 'Instrument Serif', serif; font-size: 2rem; color: #000; span { font-style: italic; } } p { font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #999; }`;
const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
const FormGroup = styled.div`margin-bottom: ${p => p.$mb || '0'};`;
const Label = styled.label`display: block; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #000; margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid #E0E0E0; box-sizing: border-box; &:focus { outline: none; border-color: #000; }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid #E0E0E0; min-height: 100px; resize: vertical; box-sizing: border-box; &:focus { outline: none; border-color: #000; }`;
const Select = styled.select`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid #E0E0E0; background: #FFF; box-sizing: border-box; &:focus { outline: none; border-color: #000; }`;
const Checkbox = styled.label`display: flex; align-items: center; gap: 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; cursor: pointer; input { width: 18px; height: 18px; }`;
const LoginButton = styled.button`width: 100%; padding: 1.25rem; font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #FFF; background: #000; border: none; cursor: pointer; &:hover { background: #333; } &:disabled { background: #CCC; cursor: not-allowed; }`;
const LoginError = styled.p`font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #C62828; text-align: center; padding: 1rem; background: #FFEBEE;`;
const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #999; text-decoration: none; cursor: pointer; &:hover { color: #000; }`;

// Dashboard Layout
const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #FAFAFA;`;
const Sidebar = styled.aside`width: 280px; background: #FFF; border-right: 1px solid #E0E0E0; position: fixed; top: 0; left: 0; bottom: 0; padding: 2rem 0; overflow-y: auto; @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; z-index: 100; width: 260px; }`;
const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #F0F0F0; margin-bottom: 1rem;`;
const SidebarLogo = styled.div`font-family: 'Instrument Serif', serif; font-size: 1.25rem; color: #000; span { font-style: italic; }`;
const SidebarSub = styled.p`font-family: 'Inter', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-top: 0.25rem;`;
const NavSection = styled.div`margin-bottom: 0.5rem;`;
const NavSectionTitle = styled.div`padding: 0.75rem 1.5rem 0.5rem; font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #999;`;
const NavItem = styled.button`width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; color: ${p => p.$active ? '#000' : '#666'}; background: ${p => p.$active ? '#F5F5F5' : 'transparent'}; border: none; border-left: 2px solid ${p => p.$active ? '#000' : 'transparent'}; cursor: pointer; text-align: left; &:hover { color: #000; background: #FAFAFA; }`;
const NavBadge = styled.span`margin-left: auto; font-size: 0.6rem; font-weight: 600; padding: 0.15rem 0.4rem; background: ${p => p.$warning ? '#FFF3E0' : '#000'}; color: ${p => p.$warning ? '#E65100' : '#FFF'};`;
const NavDivider = styled.div`height: 1px; background: #F0F0F0; margin: 1rem 1.5rem;`;

const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;
const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E0E0E0; flex-wrap: wrap; gap: 1rem;`;
const PageTitle = styled.h1`font-family: 'Instrument Serif', serif; font-size: 1.75rem; font-weight: 400; color: #000; span { font-style: italic; }`;
const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; left: 1rem; z-index: 101; background: #FFF; border: 1px solid #E0E0E0; padding: 0.75rem; cursor: pointer; @media (max-width: 968px) { display: block; }`;

// Stats & Panels
const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
const StatCard = styled.div`background: #FFF; border: 1px solid #E0E0E0; padding: 1.25rem; text-align: center;`;
const StatNumber = styled.div`font-family: 'Instrument Serif', serif; font-size: 2rem; color: #000;`;
const StatLabel = styled.div`font-family: 'Inter', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666; margin-top: 0.25rem;`;

const Panel = styled.div`background: #FFF; border: 1px solid #E0E0E0; margin-bottom: 1.5rem;`;
const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
const PanelTitle = styled.h3`font-family: 'Instrument Serif', serif; font-size: 1.25rem; color: #000;`;
const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

// Tables & Lists
const Table = styled.table`width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 0.85rem;`;
const Th = styled.th`text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666; border-bottom: 1px solid #E0E0E0;`;
const Td = styled.td`padding: 1rem; border-bottom: 1px solid #F0F0F0; color: #333;`;
const StatusBadge = styled.span`font-size: 0.65rem; font-weight: 600; padding: 0.25rem 0.5rem; background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF3E0'}; color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#E65100'};`;

// Buttons
const Button = styled.button`font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.25rem; cursor: pointer; background: ${p => p.$variant === 'danger' ? '#C62828' : p.$variant === 'success' ? '#2E7D32' : p.$variant === 'secondary' ? '#FFF' : '#000'}; color: ${p => p.$variant === 'secondary' ? '#000' : '#FFF'}; border: ${p => p.$variant === 'secondary' ? '1px solid #E0E0E0' : 'none'}; &:hover { opacity: 0.9; } &:disabled { background: #CCC; cursor: not-allowed; }`;
const SmallButton = styled.button`font-family: 'Inter', sans-serif; font-size: 0.65rem; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid #E0E0E0; background: ${p => p.$variant === 'success' ? '#E8F5E9' : p.$variant === 'danger' ? '#FFEBEE' : '#FFF'}; color: ${p => p.$variant === 'success' ? '#2E7D32' : p.$variant === 'danger' ? '#C62828' : '#666'}; &:hover { opacity: 0.8; }`;
const ButtonGroup = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;

// Misc
const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.75rem 1rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; border: 1px solid #E0E0E0; &:focus { outline: none; border-color: #000; }`;
const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #F0F0F0; &:last-child { border-bottom: none; }`;
const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;`;
const EntryName = styled.span`font-family: 'Inter', sans-serif; font-weight: 500; color: #000;`;
const EntryContent = styled.p`font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #666; margin: 0;`;
const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;`;
const AlertBox = styled.div`padding: 1rem; margin-bottom: 1rem; font-family: 'Inter', sans-serif; font-size: 0.85rem; background: ${p => p.$type === 'success' ? '#E8F5E9' : p.$type === 'warning' ? '#FFF3E0' : p.$type === 'info' ? '#E3F2FD' : '#FFEBEE'}; color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#E65100' : p.$type === 'info' ? '#1565C0' : '#C62828'};`;
const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #E0E0E0; border-top-color: #000; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
const EmptyState = styled.p`text-align: center; color: #999; padding: 2rem; font-family: 'Inter', sans-serif;`;
const HelpText = styled.p`font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #999; margin-top: 0.5rem;`;
const Divider = styled.hr`border: none; border-top: 1px solid #E0E0E0; margin: 1.5rem 0;`;

// Image Upload Components
const ImageUploadArea = styled.div`
  border: 2px dashed ${p => p.$hasImage ? '#E0E0E0' : '#CCC'};
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#FAFAFA'};
  padding: ${p => p.$hasImage ? '0' : '2rem'};
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  &:hover { border-color: #000; .overlay { opacity: 1; } }
`;
const ImageOverlay = styled.div`position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; color: #FFF; font-family: 'Inter', sans-serif; font-size: 0.8rem;`;
const ImagePlaceholder = styled.div`text-align: center; color: #999; font-family: 'Inter', sans-serif; font-size: 0.9rem; span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }`;
const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 1rem;`;
const ImageGridItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#E5E5E5'}; position: relative; cursor: pointer; &:hover .remove { opacity: 1; }`;
const ImageRemoveBtn = styled.button`position: absolute; top: 0.25rem; right: 0.25rem; width: 20px; height: 20px; border-radius: 50%; background: rgba(198, 40, 40, 0.9); color: #FFF; border: none; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.2s ease; display: flex; align-items: center; justify-content: center;`;
const AddImageButton = styled.button`aspect-ratio: 1; background: #FAFAFA; border: 2px dashed #E0E0E0; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #999; transition: all 0.3s ease; span { font-size: 1.5rem; margin-bottom: 0.25rem; } &:hover { border-color: #000; color: #000; }`;

// Item List (for FAQ, Timeline, etc.)
const ItemCard = styled.div`border: 1px solid #E0E0E0; padding: 1rem; margin-bottom: 1rem; background: #FFF;`;
const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;`;
const ItemNumber = styled.span`font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 600; color: #999;`;
const ColorSwatch = styled.div`width: 40px; height: 40px; border-radius: 4px; background: ${p => p.$color || '#CCC'}; border: 1px solid #E0E0E0; cursor: pointer;`;
const ColorInput = styled.input`width: 100%; height: 40px; padding: 0; border: 1px solid #E0E0E0; cursor: pointer;`;

// ============================================
// CLOUDINARY IMAGE UPLOAD COMPONENT
// ============================================
function CloudinaryImageUpload({ label, currentImage, onUpload, folder, cloudName, uploadPreset, aspectRatio = '16/9' }) {
  const { openWidget, isReady } = useCloudinaryUpload({
    cloudName, uploadPreset, folder, maxFiles: 1, multiple: false, sources: ['local', 'url'], cropping: true,
    onSuccess: (result) => onUpload(result.url),
    onError: (error) => { console.error('Upload error:', error); alert('Fehler beim Hochladen'); },
  });
  const isConfigured = cloudName && uploadPreset;
  const handleDelete = (e) => { e.stopPropagation(); if (window.confirm('Bild entfernen?')) onUpload(null); };

  return (
    <FormGroup $mb="1.5rem">
      <Label>{label}</Label>
      <ImageUploadArea $hasImage={!!currentImage} $image={currentImage} style={{ aspectRatio }} onClick={() => isConfigured && isReady && openWidget()}>
        {currentImage ? (
          <ImageOverlay className="overlay">
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.9)', color: '#000', fontSize: '0.75rem' }}>📷 Ändern</span>
              <span onClick={handleDelete} style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: 'rgba(198,40,40,0.9)', color: '#FFF', fontSize: '0.75rem' }}>🗑 Entfernen</span>
            </div>
          </ImageOverlay>
        ) : (
          <ImagePlaceholder><span>📷</span>{isConfigured ? 'Klicken zum Hochladen' : '⚠️ Cloudinary nicht konfiguriert'}</ImagePlaceholder>
        )}
      </ImageUploadArea>
    </FormGroup>
  );
}

// ============================================
// CLOUDINARY MULTI-IMAGE UPLOAD
// ============================================
function CloudinaryMultiUpload({ label, images = [], onAdd, onRemove, folder, cloudName, uploadPreset, maxImages = 20 }) {
  const onAddRef = React.useRef(onAdd);
  onAddRef.current = onAdd;
  const { openWidget, isReady } = useCloudinaryUpload({
    cloudName, uploadPreset, folder, maxFiles: maxImages, multiple: true, sources: ['local', 'url'],
    onSuccess: (result) => onAddRef.current({ url: result.url, publicId: result.publicId }),
    onError: (error) => console.error('Upload error:', error),
  });
  const isConfigured = cloudName && uploadPreset;

  return (
    <FormGroup $mb="1.5rem">
      <Label>{label} ({images.length}/{maxImages})</Label>
      <ImageGrid>
        {images.map((img, index) => (
          <ImageGridItem key={img.url || index} $url={img.url}>
            <ImageRemoveBtn className="remove" onClick={() => onRemove(index)}>×</ImageRemoveBtn>
          </ImageGridItem>
        ))}
        {images.length < maxImages && (
          <AddImageButton onClick={() => isConfigured && isReady && openWidget()} disabled={!isConfigured}>
            <span>+</span>Hinzufügen
          </AddImageButton>
        )}
      </ImageGrid>
    </FormGroup>
  );
}

// ============================================
// MAIN ADMIN DASHBOARD
// ============================================
function AdminDashboard() {
  const { project, projectId, coupleNames, content, slug, isComponentActive } = useWedding();
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Guest Data State
  const [rsvpData, setRsvpData] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photoUploads, setPhotoUploads] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'live');
  
  // Content State - All Components
  const [heroContent, setHeroContent] = useState({});
  const [countdownContent, setCountdownContent] = useState({});
  const [lovestoryContent, setLovestoryContent] = useState({});
  const [timelineContent, setTimelineContent] = useState({});
  const [locationsContent, setLocationsContent] = useState({});
  const [directionsContent, setDirectionsContent] = useState({});
  const [rsvpContent, setRsvpContent] = useState({});
  const [dresscodeContent, setDresscodeContent] = useState({});
  const [giftsContent, setGiftsContent] = useState({});
  const [accommodationsContent, setAccommodationsContent] = useState({});
  const [witnessesContent, setWitnessesContent] = useState({});
  const [galleryContent, setGalleryContent] = useState({});
  const [musicwishesContent, setMusicwishesContent] = useState({});
  const [guestbookContent, setGuestbookContent] = useState({});
  const [faqContent, setFaqContent] = useState({});
  const [weddingabcContent, setWeddingabcContent] = useState({});
  const [photouploadContent, setPhotouploadContent] = useState({});
  const [footerContent, setFooterContent] = useState({});
  
  const ADMIN_PASSWORD = project?.settings?.admin_password || 'admin123';
  
  // Cloudinary Config
  const cloudName = project?.settings?.cloudinary_cloud_name || process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = project?.settings?.cloudinary_upload_preset || process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
  const baseFolder = `iverlasting/${project?.slug || 'default'}`;

  // Get base URL for links (custom domain or current host)
  const getBaseUrl = () => {
    if (project?.custom_domain) return `https://${project.custom_domain}`;
    if (slug) return `/${slug}`;
    return '';
  };

  // Load data on login
  useEffect(() => { if (isLoggedIn && projectId) loadAllData(); }, [isLoggedIn, projectId]);
  useEffect(() => { if (project) setCurrentStatus(project.status); }, [project]);
  
  // Initialize content from context
  useEffect(() => {
    if (content) {
      setHeroContent(content.hero || {});
      setCountdownContent(content.countdown || {});
      setLovestoryContent(content.lovestory || { events: [] });
      setTimelineContent(content.timeline || { events: [] });
      setLocationsContent(content.locations || { locations: [] });
      setDirectionsContent(content.directions || {});
      setRsvpContent(content.rsvp || {});
      setDresscodeContent(content.dresscode || { colors: [] });
      setGiftsContent(content.gifts || { items: [] });
      setAccommodationsContent(content.accommodations || { hotels: [] });
      setWitnessesContent(content.witnesses || { witnesses: [] });
      setGalleryContent(content.gallery || { images: [] });
      setMusicwishesContent(content.musicwishes || {});
      setGuestbookContent(content.guestbook || {});
      setFaqContent(content.faq || { items: [] });
      setWeddingabcContent(content.weddingabc || { entries: [] });
      setPhotouploadContent(content.photoupload || {});
      setFooterContent(content.footer || {});
    }
  }, [content]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [rsvp, guestbook, music, photos] = await Promise.all([
        getRSVPResponses(projectId), getGuestbookEntries(projectId, false), getMusicWishes(projectId), getPhotoUploads(projectId, false),
      ]);
      setRsvpData(rsvp.data || []); setGuestbookEntries(guestbook.data || []); setMusicWishes(music.data || []); setPhotoUploads(photos.data || []);
    } catch (err) { console.error('Error:', err); } finally { setIsLoading(false); }
  };

  // Auth handlers
  const handleLogin = (e) => { e.preventDefault(); if (loginPassword === ADMIN_PASSWORD) { setIsLoggedIn(true); setLoginError(''); } else { setLoginError('Falsches Passwort'); } };
  const handleStatusChange = async (s) => { await updateProjectStatus(projectId, s); setCurrentStatus(s); };
  
  // Moderation handlers
  const handleApproveGuestbook = async (id, a) => { await approveGuestbookEntry(id, a); loadAllData(); };
  const handleDeleteGuestbook = async (id) => { if (window.confirm('Löschen?')) { await deleteGuestbookEntry(id); loadAllData(); } };
  const handleApprovePhoto = async (id, a) => { await approvePhotoUpload(id, a); loadAllData(); };
  const handleDeletePhoto = async (id) => { if (window.confirm('Löschen?')) { await deletePhotoUpload(id); loadAllData(); } };
  const handleDeleteMusic = async (id) => { if (window.confirm('Löschen?')) { await deleteMusicWish(id); loadAllData(); } };
  
  // Content save
  const saveContent = async (component, data) => {
    setIsSaving(true); setSaveSuccess(false);
    try {
      await updateProjectContent(projectId, component, data);
      setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { console.error('Error saving:', err); alert('Fehler beim Speichern'); }
    finally { setIsSaving(false); }
  };

  // CSV Export
  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const csv = [Object.keys(data[0]).join(','), ...data.map(r => Object.values(r).map(v => `"${v || ''}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `${filename}.csv`; a.click();
  };

  // Stats
  const stats = {
    confirmed: rsvpData.filter(r => r.attending).length,
    declined: rsvpData.filter(r => !r.attending).length,
    guests: rsvpData.filter(r => r.attending).reduce((s, r) => s + (r.persons || 1), 0),
    pending: guestbookEntries.filter(e => !e.approved).length + photoUploads.filter(p => !p.approved).length,
  };

  const filteredRsvp = rsvpData.filter(r => r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Build navigation based on active components
  const buildNavItems = () => {
    const items = [
      { section: 'Übersicht', items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }] },
    ];

    // Guest section - always show if any guest features are active
    const guestItems = [];
    if (isComponentActive('rsvp')) guestItems.push({ id: 'rsvp', label: 'RSVP', icon: '✉️', badge: rsvpData.length });
    if (isComponentActive('guestbook')) guestItems.push({ id: 'guestbook', label: 'Gästebuch', icon: '📝', badge: guestbookEntries.filter(e => !e.approved).length, warning: true });
    if (isComponentActive('musicwishes')) guestItems.push({ id: 'music', label: 'Musik', icon: '🎵', badge: musicWishes.length });
    if (isComponentActive('photoupload')) guestItems.push({ id: 'photos', label: 'Fotos', icon: '📷', badge: photoUploads.filter(p => !p.approved).length, warning: true });
    if (guestItems.length > 0) items.push({ section: 'Gäste', items: guestItems });

    // Content section
    const contentItems = [];
    contentItems.push({ id: 'edit-hero', label: 'Hero', icon: '🖼️' }); // Always available
    if (isComponentActive('countdown')) contentItems.push({ id: 'edit-countdown', label: 'Countdown', icon: '⏰' });
    if (isComponentActive('lovestory')) contentItems.push({ id: 'edit-lovestory', label: 'Love Story', icon: '💕' });
    if (isComponentActive('timeline')) contentItems.push({ id: 'edit-timeline', label: 'Tagesablauf', icon: '📅' });
    if (isComponentActive('locations')) contentItems.push({ id: 'edit-locations', label: 'Locations', icon: '📍' });
    if (isComponentActive('directions')) contentItems.push({ id: 'edit-directions', label: 'Anfahrt', icon: '🚗' });
    if (isComponentActive('rsvp')) contentItems.push({ id: 'edit-rsvp', label: 'RSVP Texte', icon: '✏️' });
    if (isComponentActive('dresscode')) contentItems.push({ id: 'edit-dresscode', label: 'Dresscode', icon: '👔' });
    if (isComponentActive('gifts')) contentItems.push({ id: 'edit-gifts', label: 'Geschenke', icon: '🎁' });
    if (isComponentActive('accommodations')) contentItems.push({ id: 'edit-accommodations', label: 'Hotels', icon: '🏨' });
    if (isComponentActive('witnesses')) contentItems.push({ id: 'edit-witnesses', label: 'Trauzeugen', icon: '👫' });
    if (isComponentActive('gallery')) contentItems.push({ id: 'edit-gallery', label: 'Galerie', icon: '🎨' });
    if (isComponentActive('faq')) contentItems.push({ id: 'edit-faq', label: 'FAQ', icon: '❓' });
    if (isComponentActive('weddingabc')) contentItems.push({ id: 'edit-weddingabc', label: 'Hochzeits-ABC', icon: '🔤' });
    contentItems.push({ id: 'edit-footer', label: 'Footer', icon: '📝' }); // Always available
    items.push({ section: 'Inhalte', items: contentItems });

    // Settings
    items.push({ section: 'Einstellungen', items: [{ id: 'status', label: 'Status', icon: '⚙️' }] });

    return items;
  };

  const navItems = buildNavItems();

  // Login Screen
  if (!isLoggedIn) {
    return (
      <LoginContainer>
        <LoginBox>
          <LoginLogo><h1>Admin <span>Panel</span></h1><p>{coupleNames || 'Hochzeit'}</p></LoginLogo>
          {loginError && <LoginError>{loginError}</LoginError>}
          <LoginForm onSubmit={handleLogin}>
            <FormGroup><Label>Passwort</Label><Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Admin-Passwort" required /></FormGroup>
            <LoginButton type="submit">Anmelden</LoginButton>
          </LoginForm>
          <BackLink href={slug ? `/${slug}` : '/'}>← Zurück zur Website</BackLink>
        </LoginBox>
      </LoginContainer>
    );
  }

  // Render content
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;

    switch (activeTab) {
      // ============ DASHBOARD ============
      case 'dashboard':
        return (
          <>
            <StatsGrid>
              <StatCard><StatNumber>{stats.confirmed}</StatNumber><StatLabel>Zusagen</StatLabel></StatCard>
              <StatCard><StatNumber>{stats.declined}</StatNumber><StatLabel>Absagen</StatLabel></StatCard>
              <StatCard><StatNumber>{stats.guests}</StatNumber><StatLabel>Gäste</StatLabel></StatCard>
              <StatCard><StatNumber>{stats.pending}</StatNumber><StatLabel>Ausstehend</StatLabel></StatCard>
            </StatsGrid>
            {(!cloudName || !uploadPreset) && <AlertBox $type="warning">⚠️ Cloudinary nicht konfiguriert. Bild-Uploads sind deaktiviert.</AlertBox>}
            {project?.custom_domain && <AlertBox $type="info">🌐 Custom Domain: <strong>{project.custom_domain}</strong></AlertBox>}
            <Panel>
              <PanelHeader><PanelTitle>Letzte RSVPs</PanelTitle></PanelHeader>
              <PanelContent>
                {rsvpData.slice(0, 5).map(r => (
                  <EntryCard key={r.id}><EntryHeader><EntryName>{r.name}</EntryName><StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>{r.attending ? 'Zusage' : 'Absage'}</StatusBadge></EntryHeader><EntryContent>{r.persons || 1} Person(en)</EntryContent></EntryCard>
                ))}
                {rsvpData.length === 0 && <EmptyState>Noch keine RSVPs</EmptyState>}
              </PanelContent>
            </Panel>
          </>
        );

      // ============ RSVP LIST ============
      case 'rsvp':
        return (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <SearchInput type="text" placeholder="Suchen..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <Button onClick={() => exportCSV(rsvpData, 'rsvp')}>Export CSV</Button>
            </div>
            <Panel>
              <PanelHeader><PanelTitle>Alle RSVPs ({rsvpData.length})</PanelTitle></PanelHeader>
              <PanelContent style={{ overflowX: 'auto' }}>
                <Table><thead><tr><Th>Name</Th><Th>E-Mail</Th><Th>Personen</Th><Th>Status</Th><Th>Menü</Th></tr></thead>
                  <tbody>{filteredRsvp.map(r => (<tr key={r.id}><Td>{r.name}</Td><Td>{r.email}</Td><Td>{r.persons || 1}</Td><Td><StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>{r.attending ? 'Ja' : 'Nein'}</StatusBadge></Td><Td style={{ maxWidth: '150px', fontSize: '0.8rem' }}>{r.dietary || '-'}</Td></tr>))}</tbody>
                </Table>
              </PanelContent>
            </Panel>
          </>
        );

      // ============ GUESTBOOK ============
      case 'guestbook':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Gästebuch ({guestbookEntries.length})</PanelTitle></PanelHeader>
            <PanelContent $maxHeight="600px">
              {guestbookEntries.map(e => (
                <EntryCard key={e.id}><EntryHeader><EntryName>{e.name}</EntryName><StatusBadge $status={e.approved ? 'confirmed' : 'pending'}>{e.approved ? 'Freigegeben' : 'Ausstehend'}</StatusBadge></EntryHeader><EntryContent>{e.message}</EntryContent>
                  <EntryActions>{!e.approved && <SmallButton $variant="success" onClick={() => handleApproveGuestbook(e.id, true)}>✓ Freigeben</SmallButton>}{e.approved && <SmallButton onClick={() => handleApproveGuestbook(e.id, false)}>Verstecken</SmallButton>}<SmallButton $variant="danger" onClick={() => handleDeleteGuestbook(e.id)}>🗑</SmallButton></EntryActions>
                </EntryCard>
              ))}
              {guestbookEntries.length === 0 && <EmptyState>Keine Einträge</EmptyState>}
            </PanelContent>
          </Panel>
        );

      // ============ MUSIC ============
      case 'music':
        return (
          <>
            <div style={{ marginBottom: '1.5rem' }}><Button onClick={() => exportCSV(musicWishes, 'musik')}>Export CSV</Button></div>
            <Panel>
              <PanelHeader><PanelTitle>Musikwünsche ({musicWishes.length})</PanelTitle></PanelHeader>
              <PanelContent $maxHeight="600px">
                {musicWishes.map(w => (<EntryCard key={w.id}><EntryHeader><EntryName>🎵 {w.song_title}</EntryName><SmallButton $variant="danger" onClick={() => handleDeleteMusic(w.id)}>×</SmallButton></EntryHeader><EntryContent>{w.artist} · von {w.name}</EntryContent></EntryCard>))}
                {musicWishes.length === 0 && <EmptyState>Keine Musikwünsche</EmptyState>}
              </PanelContent>
            </Panel>
          </>
        );

      // ============ PHOTOS ============
      case 'photos':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Gästefotos ({photoUploads.length})</PanelTitle></PanelHeader>
            <PanelContent $maxHeight="600px">
              {photoUploads.map(p => (
                <EntryCard key={p.id}><EntryHeader><EntryName>{p.uploaded_by || 'Anonym'}</EntryName><StatusBadge $status={p.approved ? 'confirmed' : 'pending'}>{p.approved ? 'OK' : '?'}</StatusBadge></EntryHeader>
                  {p.cloudinary_url && <img src={p.cloudinary_url} alt="" style={{ maxWidth: '150px', marginTop: '0.5rem' }} />}
                  <EntryActions>{!p.approved && <SmallButton $variant="success" onClick={() => handleApprovePhoto(p.id, true)}>✓</SmallButton>}<SmallButton $variant="danger" onClick={() => handleDeletePhoto(p.id)}>🗑</SmallButton></EntryActions>
                </EntryCard>
              ))}
              {photoUploads.length === 0 && <EmptyState>Keine Fotos</EmptyState>}
            </PanelContent>
          </Panel>
        );

      // ============ EDIT HERO ============
      case 'edit-hero':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Hero</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <CloudinaryImageUpload label="Hintergrundbild" currentImage={heroContent.background_image} onUpload={(url) => setHeroContent({ ...heroContent, background_image: url })} folder={`${baseFolder}/hero`} cloudName={cloudName} uploadPreset={uploadPreset} aspectRatio="16/9" />
              <FormGroup $mb="1rem"><Label>Tagline</Label><Input value={heroContent.tagline || ''} onChange={(e) => setHeroContent({ ...heroContent, tagline: e.target.value })} placeholder="z.B. Wir heiraten" /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Location (kurz)</Label><Input value={heroContent.location_short || ''} onChange={(e) => setHeroContent({ ...heroContent, location_short: e.target.value })} placeholder="z.B. Hamburg" /></FormGroup>
              <Button onClick={() => saveContent('hero', heroContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT COUNTDOWN ============
      case 'edit-countdown':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Countdown</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={countdownContent.title || ''} onChange={(e) => setCountdownContent({ ...countdownContent, title: e.target.value })} placeholder="z.B. Noch" /></FormGroup>
              <FormGroup $mb="1rem"><Label>Zieldatum & Zeit</Label><Input type="datetime-local" value={countdownContent.target_date?.slice(0, 16) || ''} onChange={(e) => setCountdownContent({ ...countdownContent, target_date: e.target.value })} /></FormGroup>
              <FormGroup $mb="1.5rem"><Checkbox><input type="checkbox" checked={countdownContent.show_seconds || false} onChange={(e) => setCountdownContent({ ...countdownContent, show_seconds: e.target.checked })} />Sekunden anzeigen</Checkbox></FormGroup>
              <Button onClick={() => saveContent('countdown', countdownContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT LOVESTORY ============
      case 'edit-lovestory':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Love Story</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={lovestoryContent.title || ''} onChange={(e) => setLovestoryContent({ ...lovestoryContent, title: e.target.value })} placeholder="Unsere Geschichte" /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Untertitel</Label><Input value={lovestoryContent.subtitle || ''} onChange={(e) => setLovestoryContent({ ...lovestoryContent, subtitle: e.target.value })} placeholder="Wie alles begann" /></FormGroup>
              <Label>Meilensteine</Label>
              {(lovestoryContent.events || []).map((event, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>#{i + 1}</ItemNumber><SmallButton $variant="danger" onClick={() => setLovestoryContent({ ...lovestoryContent, events: lovestoryContent.events.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <FormGroup $mb="0.75rem"><Input value={event.date || ''} onChange={(e) => { const ev = [...lovestoryContent.events]; ev[i] = { ...ev[i], date: e.target.value }; setLovestoryContent({ ...lovestoryContent, events: ev }); }} placeholder="Jahr/Datum" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={event.title || ''} onChange={(e) => { const ev = [...lovestoryContent.events]; ev[i] = { ...ev[i], title: e.target.value }; setLovestoryContent({ ...lovestoryContent, events: ev }); }} placeholder="Titel" /></FormGroup>
                  <FormGroup $mb="0.75rem"><TextArea value={event.description || ''} onChange={(e) => { const ev = [...lovestoryContent.events]; ev[i] = { ...ev[i], description: e.target.value }; setLovestoryContent({ ...lovestoryContent, events: ev }); }} placeholder="Beschreibung" /></FormGroup>
                  <CloudinaryImageUpload label="Bild" currentImage={event.image} onUpload={(url) => { const ev = [...lovestoryContent.events]; ev[i] = { ...ev[i], image: url }; setLovestoryContent({ ...lovestoryContent, events: ev }); }} folder={`${baseFolder}/lovestory`} cloudName={cloudName} uploadPreset={uploadPreset} aspectRatio="4/3" />
                </ItemCard>
              ))}
              <SmallButton onClick={() => setLovestoryContent({ ...lovestoryContent, events: [...(lovestoryContent.events || []), { date: '', title: '', description: '', image: null }] })} style={{ marginBottom: '1.5rem' }}>+ Meilenstein</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('lovestory', lovestoryContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT TIMELINE ============
      case 'edit-timeline':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Tagesablauf</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={timelineContent.title || ''} onChange={(e) => setTimelineContent({ ...timelineContent, title: e.target.value })} placeholder="Tagesablauf" /></FormGroup>
              <Label>Programmpunkte</Label>
              {(timelineContent.events || []).map((event, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>#{i + 1}</ItemNumber><SmallButton $variant="danger" onClick={() => setTimelineContent({ ...timelineContent, events: timelineContent.events.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Input value={event.time || ''} onChange={(e) => { const ev = [...timelineContent.events]; ev[i] = { ...ev[i], time: e.target.value }; setTimelineContent({ ...timelineContent, events: ev }); }} placeholder="14:00" />
                    <Input value={event.icon || ''} onChange={(e) => { const ev = [...timelineContent.events]; ev[i] = { ...ev[i], icon: e.target.value }; setTimelineContent({ ...timelineContent, events: ev }); }} placeholder="💒" />
                    <Input value={event.title || ''} onChange={(e) => { const ev = [...timelineContent.events]; ev[i] = { ...ev[i], title: e.target.value }; setTimelineContent({ ...timelineContent, events: ev }); }} placeholder="Titel" />
                  </div>
                  <FormGroup $mb="0.75rem"><Input value={event.description || ''} onChange={(e) => { const ev = [...timelineContent.events]; ev[i] = { ...ev[i], description: e.target.value }; setTimelineContent({ ...timelineContent, events: ev }); }} placeholder="Beschreibung" /></FormGroup>
                  <FormGroup><Input value={event.location || ''} onChange={(e) => { const ev = [...timelineContent.events]; ev[i] = { ...ev[i], location: e.target.value }; setTimelineContent({ ...timelineContent, events: ev }); }} placeholder="Ort" /></FormGroup>
                </ItemCard>
              ))}
              <SmallButton onClick={() => setTimelineContent({ ...timelineContent, events: [...(timelineContent.events || []), { time: '', icon: '', title: '', description: '', location: '' }] })} style={{ marginBottom: '1.5rem' }}>+ Programmpunkt</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('timeline', timelineContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT LOCATIONS ============
      case 'edit-locations':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Locations</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={locationsContent.title || ''} onChange={(e) => setLocationsContent({ ...locationsContent, title: e.target.value })} placeholder="Die Locations" /></FormGroup>
              <Label>Orte</Label>
              {(locationsContent.locations || []).map((loc, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>#{i + 1}</ItemNumber><SmallButton $variant="danger" onClick={() => setLocationsContent({ ...locationsContent, locations: locationsContent.locations.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Input value={loc.type || ''} onChange={(e) => { const l = [...locationsContent.locations]; l[i] = { ...l[i], type: e.target.value }; setLocationsContent({ ...locationsContent, locations: l }); }} placeholder="Typ (Trauung, Feier)" />
                    <Input value={loc.name || ''} onChange={(e) => { const l = [...locationsContent.locations]; l[i] = { ...l[i], name: e.target.value }; setLocationsContent({ ...locationsContent, locations: l }); }} placeholder="Name" />
                  </div>
                  <FormGroup $mb="0.75rem"><Input value={loc.address || ''} onChange={(e) => { const l = [...locationsContent.locations]; l[i] = { ...l[i], address: e.target.value }; setLocationsContent({ ...locationsContent, locations: l }); }} placeholder="Adresse" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={loc.time || ''} onChange={(e) => { const l = [...locationsContent.locations]; l[i] = { ...l[i], time: e.target.value }; setLocationsContent({ ...locationsContent, locations: l }); }} placeholder="Uhrzeit" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={loc.maps_url || ''} onChange={(e) => { const l = [...locationsContent.locations]; l[i] = { ...l[i], maps_url: e.target.value }; setLocationsContent({ ...locationsContent, locations: l }); }} placeholder="Google Maps URL" /></FormGroup>
                  <CloudinaryImageUpload label="Bild" currentImage={loc.image} onUpload={(url) => { const l = [...locationsContent.locations]; l[i] = { ...l[i], image: url }; setLocationsContent({ ...locationsContent, locations: l }); }} folder={`${baseFolder}/locations`} cloudName={cloudName} uploadPreset={uploadPreset} aspectRatio="16/9" />
                </ItemCard>
              ))}
              <SmallButton onClick={() => setLocationsContent({ ...locationsContent, locations: [...(locationsContent.locations || []), { type: '', name: '', address: '', time: '', maps_url: '', image: null }] })} style={{ marginBottom: '1.5rem' }}>+ Location</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('locations', locationsContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT DIRECTIONS ============
      case 'edit-directions':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Anfahrt</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={directionsContent.title || ''} onChange={(e) => setDirectionsContent({ ...directionsContent, title: e.target.value })} placeholder="Anfahrt" /></FormGroup>
              <FormGroup $mb="1rem"><Label>Beschreibung</Label><TextArea value={directionsContent.description || ''} onChange={(e) => setDirectionsContent({ ...directionsContent, description: e.target.value })} placeholder="So findet ihr uns..." /></FormGroup>
              <FormGroup $mb="1rem"><Label>Auto</Label><TextArea value={directionsContent.by_car || ''} onChange={(e) => setDirectionsContent({ ...directionsContent, by_car: e.target.value })} placeholder="Anfahrt mit dem Auto..." /></FormGroup>
              <FormGroup $mb="1rem"><Label>Öffentliche Verkehrsmittel</Label><TextArea value={directionsContent.by_public || ''} onChange={(e) => setDirectionsContent({ ...directionsContent, by_public: e.target.value })} placeholder="Anfahrt mit Bus & Bahn..." /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Parken</Label><TextArea value={directionsContent.parking || ''} onChange={(e) => setDirectionsContent({ ...directionsContent, parking: e.target.value })} placeholder="Parkplätze..." /></FormGroup>
              <Button onClick={() => saveContent('directions', directionsContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT RSVP CONTENT ============
      case 'edit-rsvp':
        return (
          <Panel>
            <PanelHeader><PanelTitle>RSVP Texte</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={rsvpContent.title || ''} onChange={(e) => setRsvpContent({ ...rsvpContent, title: e.target.value })} placeholder="RSVP" /></FormGroup>
              <FormGroup $mb="1rem"><Label>Untertitel</Label><Input value={rsvpContent.subtitle || ''} onChange={(e) => setRsvpContent({ ...rsvpContent, subtitle: e.target.value })} placeholder="Bitte gebt uns bis zum..." /></FormGroup>
              <FormGroup $mb="1rem"><Label>Deadline</Label><Input type="date" value={rsvpContent.deadline || ''} onChange={(e) => setRsvpContent({ ...rsvpContent, deadline: e.target.value })} /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Zusätzliche Fragen (optional)</Label><TextArea value={rsvpContent.additional_questions || ''} onChange={(e) => setRsvpContent({ ...rsvpContent, additional_questions: e.target.value })} placeholder="z.B. Allergien, Musikwünsche..." /></FormGroup>
              <Button onClick={() => saveContent('rsvp', rsvpContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT DRESSCODE ============
      case 'edit-dresscode':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Dresscode</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={dresscodeContent.title || ''} onChange={(e) => setDresscodeContent({ ...dresscodeContent, title: e.target.value })} placeholder="Dresscode" /></FormGroup>
              <FormGroup $mb="1rem"><Label>Stil</Label><Input value={dresscodeContent.subtitle || ''} onChange={(e) => setDresscodeContent({ ...dresscodeContent, subtitle: e.target.value })} placeholder="z.B. Festlich elegant" /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Beschreibung</Label><TextArea value={dresscodeContent.description || ''} onChange={(e) => setDresscodeContent({ ...dresscodeContent, description: e.target.value })} placeholder="Wir freuen uns, wenn ihr..." /></FormGroup>
              <Label>Farbpalette</Label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {(dresscodeContent.colors || []).map((color, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <ColorInput type="color" value={color} onChange={(e) => { const c = [...dresscodeContent.colors]; c[i] = e.target.value; setDresscodeContent({ ...dresscodeContent, colors: c }); }} />
                    <SmallButton $variant="danger" onClick={() => setDresscodeContent({ ...dresscodeContent, colors: dresscodeContent.colors.filter((_, idx) => idx !== i) })} style={{ padding: '0.2rem 0.4rem', fontSize: '0.6rem' }}>×</SmallButton>
                  </div>
                ))}
                <SmallButton onClick={() => setDresscodeContent({ ...dresscodeContent, colors: [...(dresscodeContent.colors || []), '#000000'] })} style={{ height: '40px' }}>+ Farbe</SmallButton>
              </div>
              <Button onClick={() => saveContent('dresscode', dresscodeContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT GIFTS ============
      case 'edit-gifts':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Geschenke</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={giftsContent.title || ''} onChange={(e) => setGiftsContent({ ...giftsContent, title: e.target.value })} placeholder="Geschenke" /></FormGroup>
              <FormGroup $mb="1rem"><Label>Untertitel</Label><Input value={giftsContent.subtitle || ''} onChange={(e) => setGiftsContent({ ...giftsContent, subtitle: e.target.value })} placeholder="Das größte Geschenk..." /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Beschreibung</Label><TextArea value={giftsContent.description || ''} onChange={(e) => setGiftsContent({ ...giftsContent, description: e.target.value })} placeholder="Falls ihr uns etwas schenken möchtet..." /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>PayPal/Bankverbindung (optional)</Label><TextArea value={giftsContent.payment_info || ''} onChange={(e) => setGiftsContent({ ...giftsContent, payment_info: e.target.value })} placeholder="IBAN: DE..." /></FormGroup>
              <Label>Wunschliste</Label>
              {(giftsContent.items || []).map((item, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>#{i + 1}</ItemNumber><SmallButton $variant="danger" onClick={() => setGiftsContent({ ...giftsContent, items: giftsContent.items.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <FormGroup $mb="0.75rem"><Input value={item.name || ''} onChange={(e) => { const it = [...giftsContent.items]; it[i] = { ...it[i], name: e.target.value }; setGiftsContent({ ...giftsContent, items: it }); }} placeholder="Name" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={item.description || ''} onChange={(e) => { const it = [...giftsContent.items]; it[i] = { ...it[i], description: e.target.value }; setGiftsContent({ ...giftsContent, items: it }); }} placeholder="Beschreibung" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={item.price || ''} onChange={(e) => { const it = [...giftsContent.items]; it[i] = { ...it[i], price: e.target.value }; setGiftsContent({ ...giftsContent, items: it }); }} placeholder="Preis (optional)" /></FormGroup>
                  <FormGroup><Input value={item.url || ''} onChange={(e) => { const it = [...giftsContent.items]; it[i] = { ...it[i], url: e.target.value }; setGiftsContent({ ...giftsContent, items: it }); }} placeholder="Link (optional)" /></FormGroup>
                </ItemCard>
              ))}
              <SmallButton onClick={() => setGiftsContent({ ...giftsContent, items: [...(giftsContent.items || []), { name: '', description: '', price: '', url: '' }] })} style={{ marginBottom: '1.5rem' }}>+ Geschenkwunsch</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('gifts', giftsContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT ACCOMMODATIONS ============
      case 'edit-accommodations':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Hotels</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={accommodationsContent.title || ''} onChange={(e) => setAccommodationsContent({ ...accommodationsContent, title: e.target.value })} placeholder="Übernachtung" /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Beschreibung</Label><TextArea value={accommodationsContent.description || ''} onChange={(e) => setAccommodationsContent({ ...accommodationsContent, description: e.target.value })} placeholder="Hier könnt ihr übernachten..." /></FormGroup>
              <Label>Hotels</Label>
              {(accommodationsContent.hotels || []).map((hotel, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>#{i + 1}</ItemNumber><SmallButton $variant="danger" onClick={() => setAccommodationsContent({ ...accommodationsContent, hotels: accommodationsContent.hotels.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <FormGroup $mb="0.75rem"><Input value={hotel.name || ''} onChange={(e) => { const h = [...accommodationsContent.hotels]; h[i] = { ...h[i], name: e.target.value }; setAccommodationsContent({ ...accommodationsContent, hotels: h }); }} placeholder="Hotelname" /></FormGroup>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Input value={hotel.distance || ''} onChange={(e) => { const h = [...accommodationsContent.hotels]; h[i] = { ...h[i], distance: e.target.value }; setAccommodationsContent({ ...accommodationsContent, hotels: h }); }} placeholder="Entfernung" />
                    <Input value={hotel.price_range || ''} onChange={(e) => { const h = [...accommodationsContent.hotels]; h[i] = { ...h[i], price_range: e.target.value }; setAccommodationsContent({ ...accommodationsContent, hotels: h }); }} placeholder="Preisbereich" />
                  </div>
                  <FormGroup $mb="0.75rem"><TextArea value={hotel.description || ''} onChange={(e) => { const h = [...accommodationsContent.hotels]; h[i] = { ...h[i], description: e.target.value }; setAccommodationsContent({ ...accommodationsContent, hotels: h }); }} placeholder="Beschreibung" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={hotel.url || ''} onChange={(e) => { const h = [...accommodationsContent.hotels]; h[i] = { ...h[i], url: e.target.value }; setAccommodationsContent({ ...accommodationsContent, hotels: h }); }} placeholder="Website" /></FormGroup>
                  <CloudinaryImageUpload label="Bild" currentImage={hotel.image} onUpload={(url) => { const h = [...accommodationsContent.hotels]; h[i] = { ...h[i], image: url }; setAccommodationsContent({ ...accommodationsContent, hotels: h }); }} folder={`${baseFolder}/hotels`} cloudName={cloudName} uploadPreset={uploadPreset} aspectRatio="16/9" />
                </ItemCard>
              ))}
              <SmallButton onClick={() => setAccommodationsContent({ ...accommodationsContent, hotels: [...(accommodationsContent.hotels || []), { name: '', distance: '', price_range: '', description: '', url: '', image: null }] })} style={{ marginBottom: '1.5rem' }}>+ Hotel</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('accommodations', accommodationsContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT WITNESSES ============
      case 'edit-witnesses':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Trauzeugen</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={witnessesContent.title || ''} onChange={(e) => setWitnessesContent({ ...witnessesContent, title: e.target.value })} placeholder="Trauzeugen" /></FormGroup>
              <Label>Personen</Label>
              {(witnessesContent.witnesses || []).map((w, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>#{i + 1}</ItemNumber><SmallButton $variant="danger" onClick={() => setWitnessesContent({ ...witnessesContent, witnesses: witnessesContent.witnesses.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <FormGroup $mb="0.75rem"><Input value={w.name || ''} onChange={(e) => { const ws = [...witnessesContent.witnesses]; ws[i] = { ...ws[i], name: e.target.value }; setWitnessesContent({ ...witnessesContent, witnesses: ws }); }} placeholder="Name" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={w.role || ''} onChange={(e) => { const ws = [...witnessesContent.witnesses]; ws[i] = { ...ws[i], role: e.target.value }; setWitnessesContent({ ...witnessesContent, witnesses: ws }); }} placeholder="Rolle (z.B. Trauzeuge Braut)" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={w.phone || ''} onChange={(e) => { const ws = [...witnessesContent.witnesses]; ws[i] = { ...ws[i], phone: e.target.value }; setWitnessesContent({ ...witnessesContent, witnesses: ws }); }} placeholder="Telefon" /></FormGroup>
                  <FormGroup $mb="0.75rem"><Input value={w.email || ''} onChange={(e) => { const ws = [...witnessesContent.witnesses]; ws[i] = { ...ws[i], email: e.target.value }; setWitnessesContent({ ...witnessesContent, witnesses: ws }); }} placeholder="E-Mail" /></FormGroup>
                  <CloudinaryImageUpload label="Foto" currentImage={w.image} onUpload={(url) => { const ws = [...witnessesContent.witnesses]; ws[i] = { ...ws[i], image: url }; setWitnessesContent({ ...witnessesContent, witnesses: ws }); }} folder={`${baseFolder}/witnesses`} cloudName={cloudName} uploadPreset={uploadPreset} aspectRatio="1/1" />
                </ItemCard>
              ))}
              <SmallButton onClick={() => setWitnessesContent({ ...witnessesContent, witnesses: [...(witnessesContent.witnesses || []), { name: '', role: '', phone: '', email: '', image: null }] })} style={{ marginBottom: '1.5rem' }}>+ Person</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('witnesses', witnessesContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT GALLERY ============
      case 'edit-gallery':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Galerie</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={galleryContent.title || ''} onChange={(e) => setGalleryContent({ ...galleryContent, title: e.target.value })} placeholder="Galerie" /></FormGroup>
              <CloudinaryMultiUpload label="Bilder" images={galleryContent.images || []} onAdd={(img) => setGalleryContent({ ...galleryContent, images: [...(galleryContent.images || []), img] })} onRemove={(idx) => setGalleryContent({ ...galleryContent, images: galleryContent.images.filter((_, i) => i !== idx) })} folder={`${baseFolder}/gallery`} cloudName={cloudName} uploadPreset={uploadPreset} maxImages={30} />
              <Button onClick={() => saveContent('gallery', galleryContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT FAQ ============
      case 'edit-faq':
        return (
          <Panel>
            <PanelHeader><PanelTitle>FAQ</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Titel</Label><Input value={faqContent.title || ''} onChange={(e) => setFaqContent({ ...faqContent, title: e.target.value })} placeholder="Häufige Fragen" /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Untertitel</Label><Input value={faqContent.subtitle || ''} onChange={(e) => setFaqContent({ ...faqContent, subtitle: e.target.value })} placeholder="Falls ihr Fragen habt..." /></FormGroup>
              <Label>Fragen & Antworten</Label>
              {(faqContent.items || []).map((item, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>#{i + 1}</ItemNumber><SmallButton $variant="danger" onClick={() => setFaqContent({ ...faqContent, items: faqContent.items.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <FormGroup $mb="0.75rem"><Input value={item.question || ''} onChange={(e) => { const it = [...faqContent.items]; it[i] = { ...it[i], question: e.target.value }; setFaqContent({ ...faqContent, items: it }); }} placeholder="Frage" /></FormGroup>
                  <FormGroup><TextArea value={item.answer || ''} onChange={(e) => { const it = [...faqContent.items]; it[i] = { ...it[i], answer: e.target.value }; setFaqContent({ ...faqContent, items: it }); }} placeholder="Antwort" /></FormGroup>
                </ItemCard>
              ))}
              <SmallButton onClick={() => setFaqContent({ ...faqContent, items: [...(faqContent.items || []), { question: '', answer: '' }] })} style={{ marginBottom: '1.5rem' }}>+ Frage</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('faq', faqContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT WEDDING ABC ============
      case 'edit-weddingabc':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Hochzeits-ABC</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={weddingabcContent.title || ''} onChange={(e) => setWeddingabcContent({ ...weddingabcContent, title: e.target.value })} placeholder="Hochzeits-ABC" /></FormGroup>
              <Label>Einträge</Label>
              {(weddingabcContent.entries || []).map((entry, i) => (
                <ItemCard key={i}>
                  <ItemHeader><ItemNumber>{entry.letter || '?'}</ItemNumber><SmallButton $variant="danger" onClick={() => setWeddingabcContent({ ...weddingabcContent, entries: weddingabcContent.entries.filter((_, idx) => idx !== i) })}>Entfernen</SmallButton></ItemHeader>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Input value={entry.letter || ''} onChange={(e) => { const en = [...weddingabcContent.entries]; en[i] = { ...en[i], letter: e.target.value.toUpperCase() }; setWeddingabcContent({ ...weddingabcContent, entries: en }); }} placeholder="A" maxLength={1} style={{ textAlign: 'center', fontWeight: 'bold' }} />
                    <Input value={entry.title || ''} onChange={(e) => { const en = [...weddingabcContent.entries]; en[i] = { ...en[i], title: e.target.value }; setWeddingabcContent({ ...weddingabcContent, entries: en }); }} placeholder="Titel" />
                  </div>
                  <FormGroup><TextArea value={entry.description || ''} onChange={(e) => { const en = [...weddingabcContent.entries]; en[i] = { ...en[i], description: e.target.value }; setWeddingabcContent({ ...weddingabcContent, entries: en }); }} placeholder="Beschreibung" /></FormGroup>
                </ItemCard>
              ))}
              <SmallButton onClick={() => setWeddingabcContent({ ...weddingabcContent, entries: [...(weddingabcContent.entries || []), { letter: '', title: '', description: '' }] })} style={{ marginBottom: '1.5rem' }}>+ Eintrag</SmallButton>
              <Divider />
              <Button onClick={() => saveContent('weddingabc', weddingabcContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT FOOTER ============
      case 'edit-footer':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Footer</PanelTitle>{saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}</PanelHeader>
            <PanelContent>
              <FormGroup $mb="1rem"><Label>Tagline</Label><Input value={footerContent.tagline || ''} onChange={(e) => setFooterContent({ ...footerContent, tagline: e.target.value })} placeholder="Wir freuen uns auf euch!" /></FormGroup>
              <FormGroup $mb="1.5rem"><Label>Hashtag</Label><Input value={footerContent.hashtag || ''} onChange={(e) => setFooterContent({ ...footerContent, hashtag: e.target.value })} placeholder="#PauliUndMo2026" /></FormGroup>
              <Button onClick={() => saveContent('footer', footerContent)} disabled={isSaving}>{isSaving ? 'Speichern...' : 'Speichern'}</Button>
            </PanelContent>
          </Panel>
        );

      // ============ STATUS ============
      case 'status':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Website Status</PanelTitle></PanelHeader>
            <PanelContent>
              <AlertBox $type={currentStatus === 'live' ? 'success' : currentStatus === 'archiv' ? 'info' : 'warning'}>
                Aktuell: <strong>{currentStatus === 'std' ? 'Save the Date' : currentStatus === 'live' ? 'Live' : 'Archiv'}</strong>
              </AlertBox>
              <HelpText style={{ marginBottom: '1.5rem' }}>
                <strong>STD:</strong> Save the Date (vor Einladung)<br />
                <strong>Live:</strong> Vollständige Hochzeitsseite<br />
                <strong>Archiv:</strong> Nach der Hochzeit
              </HelpText>
              <ButtonGroup>
                {project?.active_components?.includes('std') && <Button onClick={() => handleStatusChange('std')} $variant={currentStatus === 'std' ? undefined : 'secondary'}>Save the Date</Button>}
                <Button onClick={() => handleStatusChange('live')} $variant={currentStatus === 'live' ? undefined : 'secondary'}>Live</Button>
                {project?.active_components?.includes('archiv') && <Button onClick={() => handleStatusChange('archiv')} $variant={currentStatus === 'archiv' ? undefined : 'secondary'}>Archiv</Button>}
              </ButtonGroup>
            </PanelContent>
          </Panel>
        );

      default:
        return <EmptyState>Seite nicht gefunden</EmptyState>;
    }
  };

  // Page title
  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Übersicht', 'rsvp': <>RSVP <span>Verwaltung</span></>, 'guestbook': <>Gäste<span>buch</span></>,
      'music': <>Musik<span>wünsche</span></>, 'photos': <>Foto<span>uploads</span></>, 'edit-hero': 'Hero',
      'edit-countdown': 'Countdown', 'edit-lovestory': 'Love Story', 'edit-timeline': 'Tagesablauf',
      'edit-locations': 'Locations', 'edit-directions': 'Anfahrt', 'edit-rsvp': 'RSVP Texte',
      'edit-dresscode': 'Dresscode', 'edit-gifts': 'Geschenke', 'edit-accommodations': 'Hotels',
      'edit-witnesses': 'Trauzeugen', 'edit-gallery': 'Galerie', 'edit-faq': 'FAQ',
      'edit-weddingabc': 'Hochzeits-ABC', 'edit-footer': 'Footer', 'status': 'Status',
    };
    return titles[activeTab] || 'Admin';
  };

  return (
    <DashboardContainer>
      <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>☰</MobileMenuToggle>
      
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <SidebarLogo>Admin <span>Panel</span></SidebarLogo>
          <SidebarSub>{coupleNames}</SidebarSub>
        </SidebarHeader>
        
        {navItems.map(section => (
          <NavSection key={section.section}>
            <NavSectionTitle>{section.section}</NavSectionTitle>
            {section.items.map(item => (
              <NavItem key={item.id} $active={activeTab === item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
                {item.icon} {item.label}
                {item.badge > 0 && <NavBadge $warning={item.warning}>{item.badge}</NavBadge>}
              </NavItem>
            ))}
          </NavSection>
        ))}
        
        <NavDivider />
        <NavItem onClick={() => window.location.href = slug ? `/${slug}` : '/'}>← Zurück zur Website</NavItem>
      </Sidebar>
      
      <Main>
        <Header><PageTitle>{getPageTitle()}</PageTitle></Header>
        {renderContent()}
      </Main>
    </DashboardContainer>
  );
}

export default AdminDashboard;
