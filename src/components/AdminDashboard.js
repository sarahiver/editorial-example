// src/components/AdminDashboard.js - Full Admin with Content Editing & Cloudinary
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
const Input = styled.input`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid #E0E0E0; &:focus { outline: none; border-color: #000; }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid #E0E0E0; min-height: 100px; resize: vertical; &:focus { outline: none; border-color: #000; }`;
const LoginButton = styled.button`width: 100%; padding: 1.25rem; font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #FFF; background: #000; border: none; cursor: pointer; &:hover { background: #333; } &:disabled { background: #CCC; cursor: not-allowed; }`;
const LoginError = styled.p`font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #C62828; text-align: center; padding: 1rem; background: #FFEBEE;`;
const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #999; text-decoration: none; cursor: pointer; &:hover { color: #000; }`;

// Dashboard Layout
const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #FAFAFA;`;
const Sidebar = styled.aside`width: 260px; background: #FFF; border-right: 1px solid #E0E0E0; position: fixed; top: 0; left: 0; bottom: 0; padding: 2rem 0; overflow-y: auto; @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; z-index: 100; }`;
const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #F0F0F0; margin-bottom: 1.5rem;`;
const SidebarLogo = styled.div`font-family: 'Instrument Serif', serif; font-size: 1.25rem; color: #000; span { font-style: italic; }`;
const SidebarSub = styled.p`font-family: 'Inter', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-top: 0.25rem;`;
const NavSection = styled.div`margin-bottom: 1rem;`;
const NavSectionTitle = styled.div`padding: 0.5rem 1.5rem; font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #999;`;
const NavItem = styled.button`width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1.5rem; font-family: 'Inter', sans-serif; font-size: 0.85rem; color: ${p => p.$active ? '#000' : '#666'}; background: ${p => p.$active ? '#FAFAFA' : 'transparent'}; border: none; border-left: 2px solid ${p => p.$active ? '#000' : 'transparent'}; cursor: pointer; text-align: left; &:hover { color: #000; background: #FAFAFA; }`;
const NavBadge = styled.span`margin-left: auto; font-size: 0.6rem; font-weight: 600; padding: 0.15rem 0.4rem; background: #000; color: #FFF;`;
const NavDivider = styled.div`height: 1px; background: #F0F0F0; margin: 1rem 1.5rem;`;

const Main = styled.main`flex: 1; margin-left: 260px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;
const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E0E0E0;`;
const PageTitle = styled.h1`font-family: 'Instrument Serif', serif; font-size: 2rem; font-weight: 400; color: #000; span { font-style: italic; }`;
const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; left: 1rem; z-index: 101; background: #FFF; border: 1px solid #E0E0E0; padding: 0.75rem; cursor: pointer; @media (max-width: 968px) { display: block; }`;

// Stats & Panels
const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
const StatCard = styled.div`background: #FFF; border: 1px solid #E0E0E0; padding: 1.5rem; text-align: center;`;
const StatNumber = styled.div`font-family: 'Instrument Serif', serif; font-size: 2.5rem; color: #000;`;
const StatLabel = styled.div`font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666; margin-top: 0.5rem;`;

const Panel = styled.div`background: #FFF; border: 1px solid #E0E0E0; margin-bottom: 1.5rem;`;
const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center;`;
const PanelTitle = styled.h3`font-family: 'Instrument Serif', serif; font-size: 1.25rem; color: #000;`;
const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

// Tables & Lists
const Table = styled.table`width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 0.85rem;`;
const Th = styled.th`text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666; border-bottom: 1px solid #E0E0E0;`;
const Td = styled.td`padding: 1rem; border-bottom: 1px solid #F0F0F0; color: #333;`;
const StatusBadge = styled.span`font-size: 0.65rem; font-weight: 600; padding: 0.25rem 0.5rem; background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF3E0'}; color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#E65100'};`;

// Buttons
const Button = styled.button`font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.25rem; cursor: pointer; background: ${p => p.$variant === 'danger' ? '#C62828' : p.$variant === 'success' ? '#2E7D32' : '#000'}; color: #FFF; border: none; &:hover { opacity: 0.9; } &:disabled { background: #CCC; cursor: not-allowed; }`;
const SmallButton = styled.button`font-family: 'Inter', sans-serif; font-size: 0.65rem; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid #E0E0E0; background: ${p => p.$variant === 'success' ? '#E8F5E9' : p.$variant === 'danger' ? '#FFEBEE' : '#FFF'}; color: ${p => p.$variant === 'success' ? '#2E7D32' : p.$variant === 'danger' ? '#C62828' : '#666'}; &:hover { opacity: 0.8; }`;

// Misc
const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.75rem 1rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; border: 1px solid #E0E0E0; &:focus { outline: none; border-color: #000; }`;
const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #F0F0F0; &:last-child { border-bottom: none; }`;
const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;`;
const EntryName = styled.span`font-family: 'Inter', sans-serif; font-weight: 500; color: #000;`;
const EntryContent = styled.p`font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #666;`;
const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;
const AlertBox = styled.div`padding: 1rem; margin-bottom: 1rem; font-family: 'Inter', sans-serif; font-size: 0.85rem; background: ${p => p.$type === 'success' ? '#E8F5E9' : p.$type === 'warning' ? '#FFF3E0' : '#FFEBEE'}; color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#E65100' : '#C62828'};`;
const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #E0E0E0; border-top-color: #000; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
const EmptyState = styled.p`text-align: center; color: #999; padding: 2rem; font-family: 'Inter', sans-serif;`;

// Image Upload Components
const ImageUploadArea = styled.div`
  border: 2px dashed ${p => p.$hasImage ? '#E0E0E0' : '#CCC'};
  background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#FAFAFA'};
  padding: ${p => p.$hasImage ? '0' : '2rem'};
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #000;
    .overlay { opacity: 1; }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #FFF;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
`;

const ImagePlaceholder = styled.div`
  text-align: center;
  color: #999;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  
  span {
    display: block;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageGridItem = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#E5E5E5'};
  position: relative;
  cursor: pointer;
  
  &:hover .remove { opacity: 1; }
`;

const ImageRemoveBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(198, 40, 40, 0.9);
  color: #FFF;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const AddImageButton = styled.button`
  aspect-ratio: 1;
  background: #FAFAFA;
  border: 2px dashed #E0E0E0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #999;
  transition: all 0.3s ease;
  
  span { font-size: 2rem; margin-bottom: 0.25rem; }
  
  &:hover {
    border-color: #000;
    color: #000;
  }
`;

// ============================================
// CLOUDINARY IMAGE UPLOAD COMPONENT
// ============================================
function CloudinaryImageUpload({ 
  label, 
  currentImage, 
  onUpload, 
  folder,
  cloudName,
  uploadPreset,
  aspectRatio = '16/9',
}) {
  const { openWidget, isReady } = useCloudinaryUpload({
    cloudName,
    uploadPreset,
    folder,
    maxFiles: 1,
    multiple: false,
    sources: ['local', 'url'],
    cropping: true,
    onSuccess: (result) => {
      onUpload(result.url);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen');
    },
  });

  const isConfigured = cloudName && uploadPreset;

  return (
    <FormGroup $mb="1.5rem">
      <Label>{label}</Label>
      <ImageUploadArea 
        $hasImage={!!currentImage} 
        $image={currentImage}
        style={{ aspectRatio }}
        onClick={() => isConfigured && isReady && openWidget()}
      >
        {currentImage ? (
          <ImageOverlay className="overlay">
            📷 Bild ändern
          </ImageOverlay>
        ) : (
          <ImagePlaceholder>
            <span>📷</span>
            {isConfigured ? 'Klicken zum Hochladen' : '⚠️ Cloudinary nicht konfiguriert'}
          </ImagePlaceholder>
        )}
      </ImageUploadArea>
    </FormGroup>
  );
}

// ============================================
// CLOUDINARY MULTI-IMAGE UPLOAD
// ============================================
function CloudinaryMultiUpload({
  label,
  images = [],
  onAdd,
  onRemove,
  folder,
  cloudName,
  uploadPreset,
  maxImages = 20,
}) {
  const onAddRef = React.useRef(onAdd);
  onAddRef.current = onAdd;
  
  const { openWidget, isReady } = useCloudinaryUpload({
    cloudName,
    uploadPreset,
    folder,
    maxFiles: maxImages,
    multiple: true,
    sources: ['local', 'url'],
    onSuccess: (result) => {
      // Use ref to always get latest callback
      onAddRef.current({ url: result.url, publicId: result.publicId });
    },
    onError: (error) => {
      console.error('Upload error:', error);
    },
  });

  const isConfigured = cloudName && uploadPreset;

  return (
    <FormGroup $mb="1.5rem">
      <Label>{label} ({images.length}/{maxImages})</Label>
      <ImageGrid>
        {images.map((img, index) => (
          <ImageGridItem key={img.url || index} $url={img.url}>
            <ImageRemoveBtn 
              className="remove" 
              onClick={() => onRemove(index)}
            >
              ×
            </ImageRemoveBtn>
          </ImageGridItem>
        ))}
        {images.length < maxImages && (
          <AddImageButton 
            onClick={() => isConfigured && isReady && openWidget()}
            disabled={!isConfigured}
          >
            <span>+</span>
            Hinzufügen
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
  const { project, projectId, coupleNames, content } = useWedding();
  
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
  
  // Data State
  const [rsvpData, setRsvpData] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photoUploads, setPhotoUploads] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'live');
  
  // Content Edit State
  const [heroContent, setHeroContent] = useState({});
  const [galleryContent, setGalleryContent] = useState({});
  const [lovestoryContent, setLovestoryContent] = useState({});
  const [locationsContent, setLocationsContent] = useState({});
  const [accommodationsContent, setAccommodationsContent] = useState({});
  
  const ADMIN_PASSWORD = project?.settings?.admin_password || 'admin123';
  
  // Cloudinary Config
  const cloudName = project?.settings?.cloudinary_cloud_name || process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = project?.settings?.cloudinary_upload_preset || process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
  const baseFolder = `iverlasting/${project?.slug || 'default'}`;

  // Load data on login
  useEffect(() => { 
    if (isLoggedIn && projectId) loadAllData(); 
  }, [isLoggedIn, projectId]);
  
  useEffect(() => { 
    if (project) setCurrentStatus(project.status); 
  }, [project]);
  
  // Initialize content from context
  useEffect(() => {
    if (content) {
      setHeroContent(content.hero || {});
      setGalleryContent(content.gallery || { images: [] });
      setLovestoryContent(content.lovestory || { events: [] });
      setLocationsContent(content.locations || { locations: [] });
      setAccommodationsContent(content.accommodations || { hotels: [] });
    }
  }, [content]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [rsvp, guestbook, music, photos] = await Promise.all([
        getRSVPResponses(projectId),
        getGuestbookEntries(projectId, false),
        getMusicWishes(projectId),
        getPhotoUploads(projectId, false),
      ]);
      setRsvpData(rsvp.data || []);
      setGuestbookEntries(guestbook.data || []);
      setMusicWishes(music.data || []);
      setPhotoUploads(photos.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth handlers
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Falsches Passwort');
    }
  };

  // Status handlers
  const handleStatusChange = async (status) => {
    await updateProjectStatus(projectId, status);
    setCurrentStatus(status);
  };

  // Moderation handlers
  const handleApproveGuestbook = async (id, approved) => {
    await approveGuestbookEntry(id, approved);
    loadAllData();
  };
  
  const handleDeleteGuestbook = async (id) => {
    if (window.confirm('Wirklich löschen?')) {
      await deleteGuestbookEntry(id);
      loadAllData();
    }
  };
  
  const handleApprovePhoto = async (id, approved) => {
    await approvePhotoUpload(id, approved);
    loadAllData();
  };
  
  const handleDeletePhoto = async (id) => {
    if (window.confirm('Wirklich löschen?')) {
      await deletePhotoUpload(id);
      loadAllData();
    }
  };
  
  const handleDeleteMusic = async (id) => {
    if (window.confirm('Wirklich löschen?')) {
      await deleteMusicWish(id);
      loadAllData();
    }
  };

  // Content save handlers
  const saveContent = async (component, data) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProjectContent(projectId, component, data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      alert('Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  // CSV Export
  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(r => Object.values(r).map(v => `"${v || ''}"`).join(','))
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${filename}.csv`;
    a.click();
  };

  // Stats
  const stats = {
    confirmed: rsvpData.filter(r => r.attending).length,
    declined: rsvpData.filter(r => !r.attending).length,
    guests: rsvpData.filter(r => r.attending).reduce((s, r) => s + (r.persons || 1), 0),
    pending: guestbookEntries.filter(e => !e.approved).length + photoUploads.filter(p => !p.approved).length,
  };

  const filteredRsvp = rsvpData.filter(r =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigation items
  const navItems = [
    { section: 'Übersicht', items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    ]},
    { section: 'Gäste', items: [
      { id: 'rsvp', label: 'RSVP', icon: '✉️', badge: rsvpData.length },
      { id: 'guestbook', label: 'Gästebuch', icon: '📝', badge: guestbookEntries.filter(e => !e.approved).length },
      { id: 'music', label: 'Musik', icon: '🎵', badge: musicWishes.length },
      { id: 'photos', label: 'Fotos', icon: '📷', badge: photoUploads.filter(p => !p.approved).length },
    ]},
    { section: 'Inhalte', items: [
      { id: 'edit-hero', label: 'Hero', icon: '🖼️' },
      { id: 'edit-gallery', label: 'Galerie', icon: '🎨' },
      { id: 'edit-lovestory', label: 'Love Story', icon: '💕' },
      { id: 'edit-locations', label: 'Locations', icon: '📍' },
      { id: 'edit-accommodations', label: 'Hotels', icon: '🏨' },
    ]},
    { section: 'Einstellungen', items: [
      { id: 'status', label: 'Status', icon: '⚙️' },
    ]},
  ];

  // Login Screen
  if (!isLoggedIn) {
    return (
      <LoginContainer>
        <LoginBox>
          <LoginLogo>
            <h1>Admin <span>Panel</span></h1>
            <p>{coupleNames || 'Hochzeit'}</p>
          </LoginLogo>
          {loginError && <LoginError>{loginError}</LoginError>}
          <LoginForm onSubmit={handleLogin}>
            <FormGroup>
              <Label>Passwort</Label>
              <Input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Admin-Passwort"
                required
              />
            </FormGroup>
            <LoginButton type="submit">Anmelden</LoginButton>
          </LoginForm>
          <BackLink href="/">← Zurück zur Website</BackLink>
        </LoginBox>
      </LoginContainer>
    );
  }

  // Render Content based on active tab
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
              <StatCard><StatNumber>{stats.guests}</StatNumber><StatLabel>Gäste gesamt</StatLabel></StatCard>
              <StatCard><StatNumber>{stats.pending}</StatNumber><StatLabel>Ausstehend</StatLabel></StatCard>
            </StatsGrid>
            
            {(!cloudName || !uploadPreset) && (
              <AlertBox $type="warning">
                ⚠️ Cloudinary ist nicht konfiguriert. Setze <code>REACT_APP_CLOUDINARY_CLOUD_NAME</code> und <code>REACT_APP_CLOUDINARY_UPLOAD_PRESET</code> in den Umgebungsvariablen für Bild-Uploads.
              </AlertBox>
            )}
            
            <Panel>
              <PanelHeader><PanelTitle>Letzte RSVPs</PanelTitle></PanelHeader>
              <PanelContent>
                {rsvpData.slice(0, 5).map(r => (
                  <EntryCard key={r.id}>
                    <EntryHeader>
                      <EntryName>{r.name}</EntryName>
                      <StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>
                        {r.attending ? 'Zusage' : 'Absage'}
                      </StatusBadge>
                    </EntryHeader>
                    <EntryContent>{r.persons || 1} Person(en)</EntryContent>
                  </EntryCard>
                ))}
                {rsvpData.length === 0 && <EmptyState>Noch keine RSVPs</EmptyState>}
              </PanelContent>
            </Panel>
          </>
        );

      // ============ RSVP ============
      case 'rsvp':
        return (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <SearchInput
                type="text"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Button onClick={() => exportCSV(rsvpData, 'rsvp')}>Export CSV</Button>
            </div>
            <Panel>
              <PanelHeader><PanelTitle>Alle RSVPs ({rsvpData.length})</PanelTitle></PanelHeader>
              <PanelContent style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>E-Mail</Th>
                      <Th>Personen</Th>
                      <Th>Status</Th>
                      <Th>Menü</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRsvp.map(r => (
                      <tr key={r.id}>
                        <Td>{r.name}</Td>
                        <Td>{r.email}</Td>
                        <Td>{r.persons || 1}</Td>
                        <Td>
                          <StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>
                            {r.attending ? 'Ja' : 'Nein'}
                          </StatusBadge>
                        </Td>
                        <Td style={{ maxWidth: '200px', fontSize: '0.8rem' }}>{r.dietary || '-'}</Td>
                      </tr>
                    ))}
                  </tbody>
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
                <EntryCard key={e.id}>
                  <EntryHeader>
                    <EntryName>{e.name}</EntryName>
                    <StatusBadge $status={e.approved ? 'confirmed' : 'pending'}>
                      {e.approved ? 'Freigegeben' : 'Ausstehend'}
                    </StatusBadge>
                  </EntryHeader>
                  <EntryContent>{e.message}</EntryContent>
                  <EntryActions>
                    {!e.approved && (
                      <SmallButton $variant="success" onClick={() => handleApproveGuestbook(e.id, true)}>
                        ✓ Freigeben
                      </SmallButton>
                    )}
                    {e.approved && (
                      <SmallButton onClick={() => handleApproveGuestbook(e.id, false)}>
                        Verstecken
                      </SmallButton>
                    )}
                    <SmallButton $variant="danger" onClick={() => handleDeleteGuestbook(e.id)}>
                      🗑 Löschen
                    </SmallButton>
                  </EntryActions>
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
            <div style={{ marginBottom: '1.5rem' }}>
              <Button onClick={() => exportCSV(musicWishes, 'musikwuensche')}>Export CSV</Button>
            </div>
            <Panel>
              <PanelHeader><PanelTitle>Musikwünsche ({musicWishes.length})</PanelTitle></PanelHeader>
              <PanelContent $maxHeight="600px">
                {musicWishes.map(w => (
                  <EntryCard key={w.id}>
                    <EntryHeader>
                      <EntryName>🎵 {w.song_title}</EntryName>
                      <SmallButton $variant="danger" onClick={() => handleDeleteMusic(w.id)}>×</SmallButton>
                    </EntryHeader>
                    <EntryContent>{w.artist} · von {w.name}</EntryContent>
                  </EntryCard>
                ))}
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
                <EntryCard key={p.id}>
                  <EntryHeader>
                    <EntryName>{p.uploaded_by || 'Anonym'}</EntryName>
                    <StatusBadge $status={p.approved ? 'confirmed' : 'pending'}>
                      {p.approved ? 'Freigegeben' : 'Ausstehend'}
                    </StatusBadge>
                  </EntryHeader>
                  {p.cloudinary_url && (
                    <img src={p.cloudinary_url} alt="" style={{ maxWidth: '200px', marginTop: '0.5rem' }} />
                  )}
                  <EntryActions>
                    {!p.approved && (
                      <SmallButton $variant="success" onClick={() => handleApprovePhoto(p.id, true)}>
                        ✓ Freigeben
                      </SmallButton>
                    )}
                    <SmallButton $variant="danger" onClick={() => handleDeletePhoto(p.id)}>
                      🗑 Löschen
                    </SmallButton>
                  </EntryActions>
                </EntryCard>
              ))}
              {photoUploads.length === 0 && <EmptyState>Keine Fotos hochgeladen</EmptyState>}
            </PanelContent>
          </Panel>
        );

      // ============ EDIT HERO ============
      case 'edit-hero':
        return (
          <Panel>
            <PanelHeader>
              <PanelTitle>Hero bearbeiten</PanelTitle>
              {saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}
            </PanelHeader>
            <PanelContent>
              <CloudinaryImageUpload
                label="Hintergrundbild"
                currentImage={heroContent.background_image}
                onUpload={(url) => setHeroContent({ ...heroContent, background_image: url })}
                folder={`${baseFolder}/hero`}
                cloudName={cloudName}
                uploadPreset={uploadPreset}
                aspectRatio="16/9"
              />
              
              <FormGroup $mb="1.5rem">
                <Label>Tagline</Label>
                <Input
                  value={heroContent.tagline || ''}
                  onChange={(e) => setHeroContent({ ...heroContent, tagline: e.target.value })}
                  placeholder="z.B. Wir heiraten"
                />
              </FormGroup>
              
              <FormGroup $mb="1.5rem">
                <Label>Location (kurz)</Label>
                <Input
                  value={heroContent.location_short || ''}
                  onChange={(e) => setHeroContent({ ...heroContent, location_short: e.target.value })}
                  placeholder="z.B. Hamburg"
                />
              </FormGroup>
              
              <Button 
                onClick={() => saveContent('hero', heroContent)} 
                disabled={isSaving}
              >
                {isSaving ? 'Wird gespeichert...' : 'Speichern'}
              </Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT GALLERY ============
      case 'edit-gallery':
        return (
          <Panel>
            <PanelHeader>
              <PanelTitle>Galerie bearbeiten</PanelTitle>
              {saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}
            </PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem">
                <Label>Titel</Label>
                <Input
                  value={galleryContent.title || ''}
                  onChange={(e) => setGalleryContent({ ...galleryContent, title: e.target.value })}
                  placeholder="z.B. Unsere Momente"
                />
              </FormGroup>
              
              <CloudinaryMultiUpload
                label="Galerie-Bilder"
                images={galleryContent.images || []}
                onAdd={(img) => setGalleryContent({ 
                  ...galleryContent, 
                  images: [...(galleryContent.images || []), img] 
                })}
                onRemove={(index) => setGalleryContent({ 
                  ...galleryContent, 
                  images: galleryContent.images.filter((_, i) => i !== index) 
                })}
                folder={`${baseFolder}/gallery`}
                cloudName={cloudName}
                uploadPreset={uploadPreset}
                maxImages={20}
              />
              
              <Button 
                onClick={() => saveContent('gallery', galleryContent)} 
                disabled={isSaving}
              >
                {isSaving ? 'Wird gespeichert...' : 'Speichern'}
              </Button>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT LOVE STORY ============
      case 'edit-lovestory':
        return (
          <Panel>
            <PanelHeader>
              <PanelTitle>Love Story bearbeiten</PanelTitle>
              {saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}
            </PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem">
                <Label>Titel</Label>
                <Input
                  value={lovestoryContent.title || ''}
                  onChange={(e) => setLovestoryContent({ ...lovestoryContent, title: e.target.value })}
                  placeholder="z.B. Unsere Geschichte"
                />
              </FormGroup>
              
              <Label>Meilensteine</Label>
              {(lovestoryContent.events || []).map((event, index) => (
                <div key={index} style={{ border: '1px solid #E0E0E0', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                      value={event.date || ''}
                      onChange={(e) => {
                        const newEvents = [...lovestoryContent.events];
                        newEvents[index] = { ...newEvents[index], date: e.target.value };
                        setLovestoryContent({ ...lovestoryContent, events: newEvents });
                      }}
                      placeholder="Jahr/Datum"
                    />
                    <Input
                      value={event.title || ''}
                      onChange={(e) => {
                        const newEvents = [...lovestoryContent.events];
                        newEvents[index] = { ...newEvents[index], title: e.target.value };
                        setLovestoryContent({ ...lovestoryContent, events: newEvents });
                      }}
                      placeholder="Titel"
                    />
                  </div>
                  <TextArea
                    value={event.description || ''}
                    onChange={(e) => {
                      const newEvents = [...lovestoryContent.events];
                      newEvents[index] = { ...newEvents[index], description: e.target.value };
                      setLovestoryContent({ ...lovestoryContent, events: newEvents });
                    }}
                    placeholder="Beschreibung"
                    style={{ marginBottom: '1rem' }}
                  />
                  <CloudinaryImageUpload
                    label="Bild"
                    currentImage={event.image}
                    onUpload={(url) => {
                      const newEvents = [...lovestoryContent.events];
                      newEvents[index] = { ...newEvents[index], image: url };
                      setLovestoryContent({ ...lovestoryContent, events: newEvents });
                    }}
                    folder={`${baseFolder}/lovestory`}
                    cloudName={cloudName}
                    uploadPreset={uploadPreset}
                    aspectRatio="4/3"
                  />
                  <SmallButton 
                    $variant="danger" 
                    onClick={() => {
                      const newEvents = lovestoryContent.events.filter((_, i) => i !== index);
                      setLovestoryContent({ ...lovestoryContent, events: newEvents });
                    }}
                  >
                    Meilenstein entfernen
                  </SmallButton>
                </div>
              ))}
              
              <SmallButton 
                onClick={() => {
                  const newEvents = [...(lovestoryContent.events || []), { date: '', title: '', description: '', image: '' }];
                  setLovestoryContent({ ...lovestoryContent, events: newEvents });
                }}
                style={{ marginBottom: '1.5rem' }}
              >
                + Meilenstein hinzufügen
              </SmallButton>
              
              <div>
                <Button 
                  onClick={() => saveContent('lovestory', lovestoryContent)} 
                  disabled={isSaving}
                >
                  {isSaving ? 'Wird gespeichert...' : 'Speichern'}
                </Button>
              </div>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT LOCATIONS ============
      case 'edit-locations':
        return (
          <Panel>
            <PanelHeader>
              <PanelTitle>Locations bearbeiten</PanelTitle>
              {saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}
            </PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem">
                <Label>Titel</Label>
                <Input
                  value={locationsContent.title || ''}
                  onChange={(e) => setLocationsContent({ ...locationsContent, title: e.target.value })}
                  placeholder="z.B. Die Locations"
                />
              </FormGroup>
              
              <Label>Orte</Label>
              {(locationsContent.locations || []).map((loc, index) => (
                <div key={index} style={{ border: '1px solid #E0E0E0', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                      value={loc.type || ''}
                      onChange={(e) => {
                        const newLocs = [...locationsContent.locations];
                        newLocs[index] = { ...newLocs[index], type: e.target.value };
                        setLocationsContent({ ...locationsContent, locations: newLocs });
                      }}
                      placeholder="Typ (z.B. Trauung, Feier)"
                    />
                    <Input
                      value={loc.name || ''}
                      onChange={(e) => {
                        const newLocs = [...locationsContent.locations];
                        newLocs[index] = { ...newLocs[index], name: e.target.value };
                        setLocationsContent({ ...locationsContent, locations: newLocs });
                      }}
                      placeholder="Name"
                    />
                  </div>
                  <Input
                    value={loc.address || ''}
                    onChange={(e) => {
                      const newLocs = [...locationsContent.locations];
                      newLocs[index] = { ...newLocs[index], address: e.target.value };
                      setLocationsContent({ ...locationsContent, locations: newLocs });
                    }}
                    placeholder="Adresse"
                    style={{ marginBottom: '1rem' }}
                  />
                  <Input
                    value={loc.time || ''}
                    onChange={(e) => {
                      const newLocs = [...locationsContent.locations];
                      newLocs[index] = { ...newLocs[index], time: e.target.value };
                      setLocationsContent({ ...locationsContent, locations: newLocs });
                    }}
                    placeholder="Uhrzeit"
                    style={{ marginBottom: '1rem' }}
                  />
                  <CloudinaryImageUpload
                    label="Bild"
                    currentImage={loc.image}
                    onUpload={(url) => {
                      const newLocs = [...locationsContent.locations];
                      newLocs[index] = { ...newLocs[index], image: url };
                      setLocationsContent({ ...locationsContent, locations: newLocs });
                    }}
                    folder={`${baseFolder}/locations`}
                    cloudName={cloudName}
                    uploadPreset={uploadPreset}
                    aspectRatio="16/9"
                  />
                  <SmallButton 
                    $variant="danger" 
                    onClick={() => {
                      const newLocs = locationsContent.locations.filter((_, i) => i !== index);
                      setLocationsContent({ ...locationsContent, locations: newLocs });
                    }}
                  >
                    Location entfernen
                  </SmallButton>
                </div>
              ))}
              
              <SmallButton 
                onClick={() => {
                  const newLocs = [...(locationsContent.locations || []), { type: '', name: '', address: '', time: '', image: '' }];
                  setLocationsContent({ ...locationsContent, locations: newLocs });
                }}
                style={{ marginBottom: '1.5rem' }}
              >
                + Location hinzufügen
              </SmallButton>
              
              <div>
                <Button 
                  onClick={() => saveContent('locations', locationsContent)} 
                  disabled={isSaving}
                >
                  {isSaving ? 'Wird gespeichert...' : 'Speichern'}
                </Button>
              </div>
            </PanelContent>
          </Panel>
        );

      // ============ EDIT ACCOMMODATIONS ============
      case 'edit-accommodations':
        return (
          <Panel>
            <PanelHeader>
              <PanelTitle>Hotels bearbeiten</PanelTitle>
              {saveSuccess && <StatusBadge $status="confirmed">Gespeichert!</StatusBadge>}
            </PanelHeader>
            <PanelContent>
              <FormGroup $mb="1.5rem">
                <Label>Titel</Label>
                <Input
                  value={accommodationsContent.title || ''}
                  onChange={(e) => setAccommodationsContent({ ...accommodationsContent, title: e.target.value })}
                  placeholder="z.B. Übernachtung"
                />
              </FormGroup>
              
              <FormGroup $mb="1.5rem">
                <Label>Beschreibung</Label>
                <TextArea
                  value={accommodationsContent.description || ''}
                  onChange={(e) => setAccommodationsContent({ ...accommodationsContent, description: e.target.value })}
                  placeholder="Einleitungstext..."
                />
              </FormGroup>
              
              <Label>Hotels</Label>
              {(accommodationsContent.hotels || []).map((hotel, index) => (
                <div key={index} style={{ border: '1px solid #E0E0E0', padding: '1rem', marginBottom: '1rem' }}>
                  <Input
                    value={hotel.name || ''}
                    onChange={(e) => {
                      const newHotels = [...accommodationsContent.hotels];
                      newHotels[index] = { ...newHotels[index], name: e.target.value };
                      setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                    }}
                    placeholder="Hotelname"
                    style={{ marginBottom: '1rem' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                      value={hotel.distance || ''}
                      onChange={(e) => {
                        const newHotels = [...accommodationsContent.hotels];
                        newHotels[index] = { ...newHotels[index], distance: e.target.value };
                        setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                      }}
                      placeholder="Entfernung"
                    />
                    <Input
                      value={hotel.price_range || ''}
                      onChange={(e) => {
                        const newHotels = [...accommodationsContent.hotels];
                        newHotels[index] = { ...newHotels[index], price_range: e.target.value };
                        setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                      }}
                      placeholder="Preisbereich"
                    />
                  </div>
                  <TextArea
                    value={hotel.description || ''}
                    onChange={(e) => {
                      const newHotels = [...accommodationsContent.hotels];
                      newHotels[index] = { ...newHotels[index], description: e.target.value };
                      setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                    }}
                    placeholder="Beschreibung"
                    style={{ marginBottom: '1rem' }}
                  />
                  <Input
                    value={hotel.url || ''}
                    onChange={(e) => {
                      const newHotels = [...accommodationsContent.hotels];
                      newHotels[index] = { ...newHotels[index], url: e.target.value };
                      setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                    }}
                    placeholder="Website URL"
                    style={{ marginBottom: '1rem' }}
                  />
                  <CloudinaryImageUpload
                    label="Bild"
                    currentImage={hotel.image}
                    onUpload={(url) => {
                      const newHotels = [...accommodationsContent.hotels];
                      newHotels[index] = { ...newHotels[index], image: url };
                      setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                    }}
                    folder={`${baseFolder}/hotels`}
                    cloudName={cloudName}
                    uploadPreset={uploadPreset}
                    aspectRatio="16/9"
                  />
                  <SmallButton 
                    $variant="danger" 
                    onClick={() => {
                      const newHotels = accommodationsContent.hotels.filter((_, i) => i !== index);
                      setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                    }}
                  >
                    Hotel entfernen
                  </SmallButton>
                </div>
              ))}
              
              <SmallButton 
                onClick={() => {
                  const newHotels = [...(accommodationsContent.hotels || []), { name: '', distance: '', price_range: '', description: '', url: '', image: '' }];
                  setAccommodationsContent({ ...accommodationsContent, hotels: newHotels });
                }}
                style={{ marginBottom: '1.5rem' }}
              >
                + Hotel hinzufügen
              </SmallButton>
              
              <div>
                <Button 
                  onClick={() => saveContent('accommodations', accommodationsContent)} 
                  disabled={isSaving}
                >
                  {isSaving ? 'Wird gespeichert...' : 'Speichern'}
                </Button>
              </div>
            </PanelContent>
          </Panel>
        );

      // ============ STATUS ============
      case 'status':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Website Status</PanelTitle></PanelHeader>
            <PanelContent>
              <AlertBox $type={currentStatus === 'live' ? 'success' : 'warning'}>
                Aktuell: <strong>
                  {currentStatus === 'std' ? 'Save the Date' : currentStatus === 'live' ? 'Live' : 'Archiv'}
                </strong>
              </AlertBox>
              
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                <strong>STD:</strong> Save the Date Seite<br />
                <strong>Live:</strong> Vollständige Hochzeitsseite<br />
                <strong>Archiv:</strong> Nach der Hochzeit mit Fotos & Danke
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button 
                  onClick={() => handleStatusChange('std')} 
                  style={{ background: currentStatus === 'std' ? '#2E7D32' : '#666' }}
                >
                  STD
                </Button>
                <Button 
                  onClick={() => handleStatusChange('live')} 
                  style={{ background: currentStatus === 'live' ? '#2E7D32' : '#666' }}
                >
                  Live
                </Button>
                <Button 
                  onClick={() => handleStatusChange('archiv')} 
                  style={{ background: currentStatus === 'archiv' ? '#2E7D32' : '#666' }}
                >
                  Archiv
                </Button>
              </div>
            </PanelContent>
          </Panel>
        );

      default:
        return <EmptyState>Seite nicht gefunden</EmptyState>;
    }
  };

  // Get page title
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Übersicht';
      case 'rsvp': return <>RSVP <span>Verwaltung</span></>;
      case 'guestbook': return <>Gäste<span>buch</span></>;
      case 'music': return <>Musik<span>wünsche</span></>;
      case 'photos': return <>Foto<span>uploads</span></>;
      case 'edit-hero': return <>Hero <span>bearbeiten</span></>;
      case 'edit-gallery': return <>Galerie <span>bearbeiten</span></>;
      case 'edit-lovestory': return <>Love Story <span>bearbeiten</span></>;
      case 'edit-locations': return <>Locations <span>bearbeiten</span></>;
      case 'edit-accommodations': return <>Hotels <span>bearbeiten</span></>;
      case 'status': return 'Status';
      default: return 'Admin';
    }
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
              <NavItem
                key={item.id}
                $active={activeTab === item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                {item.icon} {item.label}
                {item.badge > 0 && <NavBadge>{item.badge}</NavBadge>}
              </NavItem>
            ))}
          </NavSection>
        ))}
        
        <NavDivider />
        <NavItem onClick={() => window.location.href = '/'}>
          ← Zurück zur Website
        </NavItem>
      </Sidebar>
      
      <Main>
        <Header>
          <PageTitle>{getPageTitle()}</PageTitle>
        </Header>
        {renderContent()}
      </Main>
    </DashboardContainer>
  );
}

export default AdminDashboard;
