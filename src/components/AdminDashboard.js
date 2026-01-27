// src/components/AdminDashboard.js - Complete Admin v19
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import JSZip from 'jszip';
import { useWedding } from '../context/WeddingContext';
import {
  getRSVPResponses, getGuestbookEntries, getMusicWishes, getPhotoUploads,
  updateProjectStatus, approveGuestbookEntry, deleteGuestbookEntry,
  deleteMusicWish, updateProjectContent,
} from '../lib/supabase';

// ============================================
// STYLED COMPONENTS (Compact)
// ============================================
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const LoginContainer = styled.div`min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #FAFAFA;`;
const LoginBox = styled.div`background: #FFF; border: 1px solid #E0E0E0; max-width: 420px; width: 90%; padding: 3rem;`;
const LoginLogo = styled.div`text-align: center; margin-bottom: 2rem; h1 { font-family: 'Instrument Serif', serif; font-size: 2rem; span { font-style: italic; } } p { font-size: 0.85rem; color: #999; }`;
const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
const FormGroup = styled.div`margin-bottom: ${p => p.$mb || '0'};`;
const Label = styled.label`display: block; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #000; margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid ${p => p.$error ? '#C62828' : '#E0E0E0'}; box-sizing: border-box; &:focus { outline: none; border-color: #000; }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid #E0E0E0; min-height: 100px; resize: vertical; box-sizing: border-box; &:focus { outline: none; border-color: #000; }`;
const Checkbox = styled.label`display: flex; align-items: center; gap: 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; cursor: pointer; input { width: 18px; height: 18px; }`;
const Button = styled.button`font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.25rem; cursor: pointer; background: ${p => p.$variant === 'danger' ? '#C62828' : p.$variant === 'success' ? '#2E7D32' : p.$variant === 'secondary' ? '#FFF' : '#000'}; color: ${p => p.$variant === 'secondary' ? '#000' : '#FFF'}; border: ${p => p.$variant === 'secondary' ? '1px solid #E0E0E0' : 'none'}; &:hover { opacity: 0.9; } &:disabled { background: #CCC; cursor: not-allowed; }`;
const SmallButton = styled.button`font-family: 'Inter', sans-serif; font-size: 0.65rem; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid #E0E0E0; background: ${p => p.$variant === 'success' ? '#E8F5E9' : p.$variant === 'danger' ? '#FFEBEE' : '#FFF'}; color: ${p => p.$variant === 'success' ? '#2E7D32' : p.$variant === 'danger' ? '#C62828' : '#666'}; &:hover { opacity: 0.8; }`;
const LoginButton = styled(Button)`width: 100%; padding: 1.25rem;`;
const LoginError = styled.p`font-size: 0.85rem; color: #C62828; text-align: center; padding: 1rem; background: #FFEBEE;`;
const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #999; text-decoration: none; cursor: pointer; &:hover { color: #000; }`;
const ErrorText = styled.span`font-size: 0.75rem; color: #C62828; margin-top: 0.25rem; display: block;`;

const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #FAFAFA;`;
const Sidebar = styled.aside`width: 280px; background: #FFF; border-right: 1px solid #E0E0E0; position: fixed; top: 0; left: 0; bottom: 0; padding: 2rem 0; overflow-y: auto; z-index: 100; @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; }`;
const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #F0F0F0; margin-bottom: 1rem;`;
const SidebarLogo = styled.div`font-family: 'Instrument Serif', serif; font-size: 1.25rem; span { font-style: italic; }`;
const SidebarSub = styled.p`font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-top: 0.25rem;`;
const NavSection = styled.div`margin-bottom: 0.5rem;`;
const NavSectionTitle = styled.div`padding: 0.75rem 1.5rem 0.5rem; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #999;`;
const NavItem = styled.button`width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; font-size: 0.8rem; color: ${p => p.$active ? '#000' : '#666'}; background: ${p => p.$active ? '#F5F5F5' : 'transparent'}; border: none; border-left: 2px solid ${p => p.$active ? '#000' : 'transparent'}; cursor: pointer; text-align: left; &:hover { background: #FAFAFA; }`;
const NavBadge = styled.span`margin-left: auto; font-size: 0.6rem; font-weight: 600; padding: 0.15rem 0.4rem; background: ${p => p.$warning ? '#FFF3E0' : '#000'}; color: ${p => p.$warning ? '#E65100' : '#FFF'};`;
const NavDivider = styled.div`height: 1px; background: #F0F0F0; margin: 1rem 1.5rem;`;
const Main = styled.main`flex: 1; margin-left: 280px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;
const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E0E0E0;`;
const PageTitle = styled.h1`font-family: 'Instrument Serif', serif; font-size: 1.75rem; font-weight: 400; span { font-style: italic; }`;
const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; right: 1rem; z-index: 101; background: #FFF; border: 1px solid #E0E0E0; padding: 0.75rem; cursor: pointer; @media (max-width: 968px) { display: block; }`;

const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
const StatCard = styled.div`background: #FFF; border: 1px solid #E0E0E0; padding: 1.25rem; text-align: center;`;
const StatNumber = styled.div`font-family: 'Instrument Serif', serif; font-size: 2rem;`;
const StatLabel = styled.div`font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666; margin-top: 0.25rem;`;

const Panel = styled.div`background: #FFF; border: 1px solid #E0E0E0; margin-bottom: 1.5rem;`;
const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;`;
const PanelTitle = styled.h3`font-family: 'Instrument Serif', serif; font-size: 1.25rem;`;
const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

const Table = styled.table`width: 100%; border-collapse: collapse; font-size: 0.85rem;`;
const Th = styled.th`text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666; border-bottom: 1px solid #E0E0E0;`;
const Td = styled.td`padding: 1rem; border-bottom: 1px solid #F0F0F0;`;
const StatusBadge = styled.span`font-size: 0.65rem; font-weight: 600; padding: 0.25rem 0.5rem; background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF3E0'}; color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#E65100'};`;

const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.75rem 1rem; font-size: 0.9rem; border: 1px solid #E0E0E0; &:focus { outline: none; border-color: #000; }`;
const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #F0F0F0; &:last-child { border-bottom: none; }`;
const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`;
const EntryName = styled.span`font-weight: 500;`;
const EntryContent = styled.p`font-size: 0.9rem; color: #666; margin: 0;`;
const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;
const AlertBox = styled.div`padding: 1rem; margin-bottom: 1rem; font-size: 0.85rem; background: ${p => p.$type === 'success' ? '#E8F5E9' : p.$type === 'warning' ? '#FFF3E0' : '#E3F2FD'}; color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#E65100' : '#1565C0'};`;
const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #E0E0E0; border-top-color: #000; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
const EmptyState = styled.p`text-align: center; color: #999; padding: 2rem;`;
const Divider = styled.hr`border: none; border-top: 1px solid #E0E0E0; margin: 1.5rem 0;`;
const ItemCard = styled.div`border: 1px solid #E0E0E0; padding: 1rem; margin-bottom: 1rem; background: #FFF;`;
const ItemHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
const ItemNumber = styled.span`font-size: 0.7rem; font-weight: 600; color: #999;`;
const ColorInput = styled.input`width: 40px; height: 40px; padding: 0; border: 1px solid #E0E0E0; cursor: pointer;`;
const TwoColGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 600px) { grid-template-columns: 1fr; }`;

// Upload Components
const DropZone = styled.div`border: 2px dashed ${p => p.$dragging ? '#000' : p.$hasImage ? '#2E7D32' : '#E0E0E0'}; background: ${p => p.$hasImage ? `url(${p.$image}) center/cover` : '#FAFAFA'}; min-height: 150px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; aspect-ratio: ${p => p.$ratio || 'auto'}; &:hover { border-color: #000; } &:hover .ov { opacity: 1; }`;
const DropOverlay = styled.div`position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: opacity 0.2s;`;
const DropBtn = styled.span`padding: 0.5rem 1rem; font-size: 0.75rem; cursor: pointer; background: ${p => p.$danger ? 'rgba(198,40,40,0.9)' : 'rgba(255,255,255,0.95)'}; color: ${p => p.$danger ? '#FFF' : '#000'};`;
const DropPlaceholder = styled.div`text-align: center; color: #999; font-size: 0.85rem; span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }`;
const HiddenInput = styled.input`display: none;`;
const ProgressBar = styled.div`position: absolute; bottom: 0; left: 0; height: 4px; background: #2E7D32; width: ${p => p.$p}%; transition: width 0.3s;`;
const PhotoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.5rem;`;
const PhotoThumb = styled.div`aspect-ratio: 1; cursor: pointer; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#F0F0F0'}; border: 2px solid ${p => p.$sel ? '#2E7D32' : 'transparent'}; position: relative; &::after { content: '${p => p.$sel ? '✓' : ''}'; position: absolute; top: 4px; right: 4px; width: 18px; height: 18px; background: ${p => p.$sel ? '#2E7D32' : 'rgba(255,255,255,0.8)'}; color: #FFF; font-size: 12px; display: flex; align-items: center; justify-content: center; }`;
const PhotoActions = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center;`;
const ImageGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 1rem;`;
const ImageItem = styled.div`aspect-ratio: 1; background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#E5E5E5'}; position: relative; &:hover button { opacity: 1; }`;
const RemoveBtn = styled.button`position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(198,40,40,0.9); color: #FFF; border: none; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.2s;`;
const AddBtn = styled.button`aspect-ratio: 1; background: #FAFAFA; border: 2px dashed #E0E0E0; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; color: #999; span { font-size: 1.5rem; } &:hover { border-color: #000; color: #000; }`;

// ============================================
// INLINE IMAGE UPLOAD
// ============================================
function InlineUpload({ label, image, onUpload, ratio = '16/9', folder, cloudName, uploadPreset }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);
  const ok = cloudName && uploadPreset;

  const upload = async (file) => {
    if (!ok) return;
    setUploading(true); setProgress(0);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    if (folder) fd.append('folder', folder);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => { if (xhr.status === 200) onUpload(JSON.parse(xhr.responseText).secure_url); setUploading(false); };
    xhr.onerror = () => { alert('Fehler'); setUploading(false); };
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(fd);
  };

  return (
    <FormGroup $mb="1.5rem">
      <Label>{label}</Label>
      <DropZone $dragging={dragging} $hasImage={!!image} $image={image} $ratio={ratio}
        onDrop={(e) => { e.preventDefault(); setDragging(false); e.dataTransfer.files[0] && upload(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
        onClick={() => ref.current?.click()}>
        {image ? <DropOverlay className="ov"><DropBtn>📷 Ändern</DropBtn><DropBtn $danger onClick={(e) => { e.stopPropagation(); onUpload(null); }}>🗑</DropBtn></DropOverlay>
          : <DropPlaceholder><span>📷</span>{ok ? 'Bild hierher ziehen' : '⚠️ Nicht konfiguriert'}</DropPlaceholder>}
        {uploading && <ProgressBar $p={progress} />}
        <HiddenInput ref={ref} type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
      </DropZone>
    </FormGroup>
  );
}

// ============================================
// INLINE MULTI UPLOAD
// ============================================
function MultiUpload({ label, images = [], onAdd, onRemove, folder, cloudName, uploadPreset, max = 20 }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);
  const ok = cloudName && uploadPreset;

  const upload = async (file) => {
    if (!ok) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    if (folder) fd.append('folder', folder);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      onAdd({ url: data.secure_url, publicId: data.public_id });
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const handleChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, max - images.length);
    for (const f of files) await upload(f);
    e.target.value = '';
  };

  return (
    <FormGroup $mb="1.5rem">
      <Label>{label} ({images.length}/{max})</Label>
      <ImageGrid>
        {images.map((img, i) => <ImageItem key={img.url || i} $url={img.url}><RemoveBtn onClick={() => onRemove(i)}>×</RemoveBtn></ImageItem>)}
        {images.length < max && <AddBtn onClick={() => ref.current?.click()}><span>{uploading ? '...' : '+'}</span></AddBtn>}
      </ImageGrid>
      <HiddenInput ref={ref} type="file" accept="image/*" multiple onChange={handleChange} />
    </FormGroup>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
function AdminDashboard() {
  const { project, projectId, coupleNames, content, slug, isComponentActive } = useWedding();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [rsvpData, setRsvpData] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photoUploads, setPhotoUploads] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'live');
  
  // Content states
  const [heroContent, setHeroContent] = useState({});
  const [countdownContent, setCountdownContent] = useState({});
  const [countdownError, setCountdownError] = useState('');
  const [lovestoryContent, setLovestoryContent] = useState({ events: [] });
  const [timelineContent, setTimelineContent] = useState({ events: [] });
  const [locationsContent, setLocationsContent] = useState({ locations: [] });
  const [directionsContent, setDirectionsContent] = useState({ options: [] });
  const [rsvpContent, setRsvpContent] = useState({});
  const [dresscodeContent, setDresscodeContent] = useState({ colors: [] });
  const [giftsContent, setGiftsContent] = useState({ items: [] });
  const [accommodationsContent, setAccommodationsContent] = useState({ hotels: [] });
  const [witnessesContent, setWitnessesContent] = useState({ witnesses: [] });
  const [galleryContent, setGalleryContent] = useState({ images: [] });
  const [faqContent, setFaqContent] = useState({ items: [] });
  const [weddingabcContent, setWeddingabcContent] = useState({ entries: [] });
  const [footerContent, setFooterContent] = useState({});
  
  const ADMIN_PASSWORD = project?.settings?.admin_password || 'admin123';
  const cloudName = project?.settings?.cloudinary_cloud_name || process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = project?.settings?.cloudinary_upload_preset || process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
  const baseFolder = `iverlasting/${project?.slug || 'default'}`;

  useEffect(() => { if (isLoggedIn && projectId) loadData(); }, [isLoggedIn, projectId]);
  useEffect(() => { if (project) setCurrentStatus(project.status); }, [project]);
  useEffect(() => {
    if (content) {
      setHeroContent(content.hero || {});
      setCountdownContent(content.countdown || {});
      setLovestoryContent(content.lovestory || { events: [] });
      setTimelineContent(content.timeline || { events: [] });
      setLocationsContent(content.locations || { locations: [] });
      setDirectionsContent(content.directions || { options: [] });
      setRsvpContent(content.rsvp || {});
      setDresscodeContent(content.dresscode || { colors: [] });
      setGiftsContent(content.gifts || { items: [] });
      setAccommodationsContent(content.accommodations || { hotels: [] });
      setWitnessesContent(content.witnesses || { witnesses: [] });
      setGalleryContent(content.gallery || { images: [] });
      setFaqContent(content.faq || { items: [] });
      setWeddingabcContent(content.weddingabc || { entries: [] });
      setFooterContent(content.footer || {});
    }
  }, [content]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [r, g, m, p] = await Promise.all([getRSVPResponses(projectId), getGuestbookEntries(projectId, false), getMusicWishes(projectId), getPhotoUploads(projectId, false)]);
      setRsvpData(r.data || []); setGuestbookEntries(g.data || []); setMusicWishes(m.data || []); setPhotoUploads(p.data || []);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const handleLogin = (e) => { e.preventDefault(); if (loginPassword === ADMIN_PASSWORD) { setIsLoggedIn(true); setLoginError(''); } else { setLoginError('Falsches Passwort'); } };
  const handleStatusChange = async (s) => { await updateProjectStatus(projectId, s); setCurrentStatus(s); };
  const handleApproveGuestbook = async (id, a) => { await approveGuestbookEntry(id, a); loadData(); };
  const handleDeleteGuestbook = async (id) => { if (window.confirm('Löschen?')) { await deleteGuestbookEntry(id); loadData(); } };
  const handleDeleteMusic = async (id) => { if (window.confirm('Löschen?')) { await deleteMusicWish(id); loadData(); } };

  const saveContent = async (comp, data) => {
    if (comp === 'countdown' && data.target_date && new Date(data.target_date) < new Date()) {
      setCountdownError('Datum darf nicht in der Vergangenheit liegen');
      return;
    }
    setCountdownError('');
    setIsSaving(true); setSaveSuccess(false);
    try { await updateProjectContent(projectId, comp, data); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
    catch (e) { console.error(e); alert('Fehler'); }
    setIsSaving(false);
  };

  const exportCSV = (data, name) => {
    if (!data.length) return;
    const csv = [Object.keys(data[0]).join(','), ...data.map(r => Object.values(r).map(v => `"${v || ''}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `${name}.csv`; a.click();
  };

  const togglePhoto = (id) => { const s = new Set(selectedPhotos); s.has(id) ? s.delete(id) : s.add(id); setSelectedPhotos(s); };
  
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadPhotos = async (photos) => {
    if (photos.length === 0) return;
    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      const folder = zip.folder('gaeste-fotos');
      
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        if (p.cloudinary_url) {
          try {
            const response = await fetch(p.cloudinary_url);
            const blob = await response.blob();
            const ext = p.cloudinary_url.includes('.png') ? 'png' : 'jpg';
            folder.file(`foto_${i + 1}_${p.id}.${ext}`, blob);
          } catch (e) {
            console.error('Failed to fetch image:', e);
          }
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gaeste-fotos_${new Date().toISOString().slice(0,10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('ZIP creation failed:', e);
      alert('Download fehlgeschlagen');
    }
    
    setIsDownloading(false);
  };

  const stats = { confirmed: rsvpData.filter(r => r.attending).length, declined: rsvpData.filter(r => !r.attending).length, guests: rsvpData.filter(r => r.attending).reduce((s, r) => s + (r.persons || 1), 0), pending: guestbookEntries.filter(e => !e.approved).length };

  const navItems = [
    { section: 'Übersicht', items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }] },
    { section: 'Gäste', items: [
      isComponentActive('rsvp') && { id: 'rsvp', label: 'RSVP', icon: '✉️', badge: rsvpData.length },
      isComponentActive('guestbook') && { id: 'guestbook', label: 'Gästebuch', icon: '📝', badge: guestbookEntries.filter(e => !e.approved).length, warning: true },
      isComponentActive('musicwishes') && { id: 'music', label: 'Musik', icon: '🎵', badge: musicWishes.length },
      isComponentActive('photoupload') && { id: 'photos', label: 'Fotos', icon: '📷', badge: photoUploads.length },
    ].filter(Boolean) },
    { section: 'Inhalte', items: [
      { id: 'edit-hero', label: 'Hero', icon: '🖼️' },
      isComponentActive('countdown') && { id: 'edit-countdown', label: 'Countdown', icon: '⏰' },
      isComponentActive('lovestory') && { id: 'edit-lovestory', label: 'Love Story', icon: '💕' },
      isComponentActive('timeline') && { id: 'edit-timeline', label: 'Ablauf', icon: '📅' },
      isComponentActive('locations') && { id: 'edit-locations', label: 'Locations', icon: '📍' },
      isComponentActive('directions') && { id: 'edit-directions', label: 'Anfahrt', icon: '🚗' },
      isComponentActive('rsvp') && { id: 'edit-rsvp', label: 'RSVP', icon: '✏️' },
      isComponentActive('dresscode') && { id: 'edit-dresscode', label: 'Dresscode', icon: '👔' },
      isComponentActive('gifts') && { id: 'edit-gifts', label: 'Geschenke', icon: '🎁' },
      isComponentActive('accommodations') && { id: 'edit-accommodations', label: 'Hotels', icon: '🏨' },
      isComponentActive('witnesses') && { id: 'edit-witnesses', label: 'Trauzeugen', icon: '👫' },
      isComponentActive('gallery') && { id: 'edit-gallery', label: 'Galerie', icon: '🎨' },
      isComponentActive('faq') && { id: 'edit-faq', label: 'FAQ', icon: '❓' },
      isComponentActive('weddingabc') && { id: 'edit-weddingabc', label: 'ABC', icon: '🔤' },
      { id: 'edit-footer', label: 'Footer', icon: '📝' },
    ].filter(Boolean) },
    { section: 'Einstellungen', items: [{ id: 'status', label: 'Status', icon: '⚙️' }] },
  ].filter(s => s.items.length > 0);

  if (!isLoggedIn) return (
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

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    
    switch (activeTab) {
      case 'dashboard': return (<><StatsGrid><StatCard><StatNumber>{stats.confirmed}</StatNumber><StatLabel>Zusagen</StatLabel></StatCard><StatCard><StatNumber>{stats.declined}</StatNumber><StatLabel>Absagen</StatLabel></StatCard><StatCard><StatNumber>{stats.guests}</StatNumber><StatLabel>Gäste</StatLabel></StatCard><StatCard><StatNumber>{stats.pending}</StatNumber><StatLabel>Ausstehend</StatLabel></StatCard></StatsGrid>{(!cloudName || !uploadPreset) && <AlertBox $type="warning">⚠️ Cloudinary nicht konfiguriert</AlertBox>}<Panel><PanelHeader><PanelTitle>Letzte RSVPs</PanelTitle></PanelHeader><PanelContent>{rsvpData.slice(0, 5).map(r => <EntryCard key={r.id}><EntryHeader><EntryName>{r.name}</EntryName><StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>{r.attending ? 'Zusage' : 'Absage'}</StatusBadge></EntryHeader></EntryCard>)}{!rsvpData.length && <EmptyState>Keine RSVPs</EmptyState>}</PanelContent></Panel></>);
      
      case 'rsvp': return (<><div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}><SearchInput placeholder="Suchen..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/><Button onClick={()=>exportCSV(rsvpData,'rsvp')}>Export</Button></div><Panel><PanelContent style={{overflowX:'auto'}}><Table><thead><tr><Th>Name</Th><Th>E-Mail</Th><Th>Personen</Th><Th>Status</Th></tr></thead><tbody>{rsvpData.filter(r=>r.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(r=><tr key={r.id}><Td>{r.name}</Td><Td>{r.email}</Td><Td>{r.persons||1}</Td><Td><StatusBadge $status={r.attending?'confirmed':'declined'}>{r.attending?'Ja':'Nein'}</StatusBadge></Td></tr>)}</tbody></Table></PanelContent></Panel></>);
      
      case 'guestbook': return (<Panel><PanelHeader><PanelTitle>Gästebuch</PanelTitle></PanelHeader><PanelContent $maxHeight="600px">{guestbookEntries.map(e=><EntryCard key={e.id}><EntryHeader><EntryName>{e.name}</EntryName><StatusBadge $status={e.approved?'confirmed':'pending'}>{e.approved?'OK':'?'}</StatusBadge></EntryHeader><EntryContent>{e.message}</EntryContent><EntryActions>{!e.approved&&<SmallButton $variant="success" onClick={()=>handleApproveGuestbook(e.id,true)}>✓</SmallButton>}<SmallButton $variant="danger" onClick={()=>handleDeleteGuestbook(e.id)}>🗑</SmallButton></EntryActions></EntryCard>)}{!guestbookEntries.length&&<EmptyState>Keine Einträge</EmptyState>}</PanelContent></Panel>);
      
      case 'music': return (<><div style={{marginBottom:'1.5rem'}}><Button onClick={()=>exportCSV(musicWishes,'musik')}>Export</Button></div><Panel><PanelContent $maxHeight="600px">{musicWishes.map(w=><EntryCard key={w.id}><EntryHeader><EntryName>🎵 {w.song_title}</EntryName><SmallButton $variant="danger" onClick={()=>handleDeleteMusic(w.id)}>×</SmallButton></EntryHeader><EntryContent>{w.artist}</EntryContent></EntryCard>)}{!musicWishes.length&&<EmptyState>Keine Wünsche</EmptyState>}</PanelContent></Panel></>);
      
      case 'photos': return (<Panel><PanelHeader><PanelTitle>Fotos ({photoUploads.length})</PanelTitle></PanelHeader><PanelContent><PhotoActions><SmallButton onClick={()=>setSelectedPhotos(new Set(photoUploads.map(p=>p.id)))}>Alle</SmallButton><SmallButton onClick={()=>setSelectedPhotos(new Set())}>Keine</SmallButton><span style={{color:'#666',fontSize:'0.8rem'}}>{selectedPhotos.size} ausgewählt</span><div style={{marginLeft:'auto',display:'flex',gap:'0.5rem'}}><Button $variant="secondary" onClick={()=>downloadPhotos(photoUploads.filter(p=>selectedPhotos.has(p.id)))} disabled={!selectedPhotos.size||isDownloading}>{isDownloading?'Lädt...':'Auswahl ↓'}</Button><Button onClick={()=>downloadPhotos(photoUploads)} disabled={!photoUploads.length||isDownloading}>{isDownloading?'Lädt...':'Alle ↓'}</Button></div></PhotoActions><PhotoGrid>{photoUploads.map(p=><PhotoThumb key={p.id} $url={p.cloudinary_url} $sel={selectedPhotos.has(p.id)} onClick={()=>togglePhoto(p.id)}/>)}</PhotoGrid>{!photoUploads.length&&<EmptyState>Keine Fotos</EmptyState>}</PanelContent></Panel>);
      
      case 'edit-hero': return (<Panel><PanelHeader><PanelTitle>Hero</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><InlineUpload label="Hintergrundbild" image={heroContent.background_image} onUpload={url=>setHeroContent({...heroContent,background_image:url})} folder={`${baseFolder}/hero`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="16/9"/><FormGroup $mb="1rem"><Label>Tagline</Label><Input value={heroContent.tagline||''} onChange={e=>setHeroContent({...heroContent,tagline:e.target.value})} placeholder="Wir heiraten"/></FormGroup><FormGroup $mb="1.5rem"><Label>Location</Label><Input value={heroContent.location_short||''} onChange={e=>setHeroContent({...heroContent,location_short:e.target.value})} placeholder="Hamburg"/></FormGroup><Button onClick={()=>saveContent('hero',heroContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-countdown': const minDT=new Date().toISOString().slice(0,16); return (<Panel><PanelHeader><PanelTitle>Countdown</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={countdownContent.title||''} onChange={e=>setCountdownContent({...countdownContent,title:e.target.value})} placeholder="Noch"/></FormGroup><FormGroup $mb="1rem"><Label>Datum & Zeit</Label><Input type="datetime-local" value={countdownContent.target_date?.slice(0,16)||''} onChange={e=>{setCountdownContent({...countdownContent,target_date:e.target.value});setCountdownError('');}} min={minDT} $error={!!countdownError}/>{countdownError&&<ErrorText>{countdownError}</ErrorText>}</FormGroup><FormGroup $mb="1.5rem"><Checkbox><input type="checkbox" checked={countdownContent.show_seconds||false} onChange={e=>setCountdownContent({...countdownContent,show_seconds:e.target.checked})}/>Sekunden</Checkbox></FormGroup><Button onClick={()=>saveContent('countdown',countdownContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-lovestory': return (<Panel><PanelHeader><PanelTitle>Love Story</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={lovestoryContent.title||''} onChange={e=>setLovestoryContent({...lovestoryContent,title:e.target.value})}/></FormGroup><Label>Meilensteine</Label>{(lovestoryContent.events||[]).map((ev,i)=><ItemCard key={i}><ItemHeader><ItemNumber>#{i+1}</ItemNumber><SmallButton $variant="danger" onClick={()=>setLovestoryContent({...lovestoryContent,events:lovestoryContent.events.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><FormGroup $mb="0.75rem"><Input value={ev.date||''} onChange={e=>{const evs=[...lovestoryContent.events];evs[i]={...evs[i],date:e.target.value};setLovestoryContent({...lovestoryContent,events:evs});}} placeholder="Jahr"/></FormGroup><FormGroup $mb="0.75rem"><Input value={ev.title||''} onChange={e=>{const evs=[...lovestoryContent.events];evs[i]={...evs[i],title:e.target.value};setLovestoryContent({...lovestoryContent,events:evs});}} placeholder="Titel"/></FormGroup><FormGroup $mb="0.75rem"><TextArea value={ev.description||''} onChange={e=>{const evs=[...lovestoryContent.events];evs[i]={...evs[i],description:e.target.value};setLovestoryContent({...lovestoryContent,events:evs});}} placeholder="Beschreibung"/></FormGroup><InlineUpload label="Bild" image={ev.image} onUpload={url=>{const evs=[...lovestoryContent.events];evs[i]={...evs[i],image:url};setLovestoryContent({...lovestoryContent,events:evs});}} folder={`${baseFolder}/lovestory`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="4/3"/></ItemCard>)}<SmallButton onClick={()=>setLovestoryContent({...lovestoryContent,events:[...(lovestoryContent.events||[]),{date:'',title:'',description:'',image:null}]})} style={{marginBottom:'1.5rem'}}>+ Meilenstein</SmallButton><Divider/><Button onClick={()=>saveContent('lovestory',lovestoryContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-timeline': return (<Panel><PanelHeader><PanelTitle>Ablauf</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={timelineContent.title||''} onChange={e=>setTimelineContent({...timelineContent,title:e.target.value})}/></FormGroup><Label>Programm</Label>{(timelineContent.events||[]).map((ev,i)=><ItemCard key={i}><ItemHeader><ItemNumber>#{i+1}</ItemNumber><SmallButton $variant="danger" onClick={()=>setTimelineContent({...timelineContent,events:timelineContent.events.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><div style={{display:'grid',gridTemplateColumns:'80px 50px 1fr',gap:'0.75rem',marginBottom:'0.75rem'}}><Input value={ev.time||''} onChange={e=>{const evs=[...timelineContent.events];evs[i]={...evs[i],time:e.target.value};setTimelineContent({...timelineContent,events:evs});}} placeholder="14:00"/><Input value={ev.icon||''} onChange={e=>{const evs=[...timelineContent.events];evs[i]={...evs[i],icon:e.target.value};setTimelineContent({...timelineContent,events:evs});}} placeholder="💒"/><Input value={ev.title||''} onChange={e=>{const evs=[...timelineContent.events];evs[i]={...evs[i],title:e.target.value};setTimelineContent({...timelineContent,events:evs});}} placeholder="Titel"/></div><FormGroup $mb="0.75rem"><Input value={ev.description||''} onChange={e=>{const evs=[...timelineContent.events];evs[i]={...evs[i],description:e.target.value};setTimelineContent({...timelineContent,events:evs});}} placeholder="Beschreibung"/></FormGroup><FormGroup><Input value={ev.location||''} onChange={e=>{const evs=[...timelineContent.events];evs[i]={...evs[i],location:e.target.value};setTimelineContent({...timelineContent,events:evs});}} placeholder="Ort"/></FormGroup></ItemCard>)}<SmallButton onClick={()=>setTimelineContent({...timelineContent,events:[...(timelineContent.events||[]),{time:'',icon:'',title:'',description:'',location:''}]})} style={{marginBottom:'1.5rem'}}>+ Punkt</SmallButton><Divider/><Button onClick={()=>saveContent('timeline',timelineContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-locations': return (<Panel><PanelHeader><PanelTitle>Locations</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={locationsContent.title||''} onChange={e=>setLocationsContent({...locationsContent,title:e.target.value})}/></FormGroup><Label>Orte</Label>{(locationsContent.locations||[]).map((loc,i)=><ItemCard key={i}><ItemHeader><ItemNumber>#{i+1}</ItemNumber><SmallButton $variant="danger" onClick={()=>setLocationsContent({...locationsContent,locations:locationsContent.locations.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><TwoColGrid style={{marginBottom:'0.75rem'}}><Input value={loc.type||''} onChange={e=>{const l=[...locationsContent.locations];l[i]={...l[i],type:e.target.value};setLocationsContent({...locationsContent,locations:l});}} placeholder="Typ"/><Input value={loc.name||''} onChange={e=>{const l=[...locationsContent.locations];l[i]={...l[i],name:e.target.value};setLocationsContent({...locationsContent,locations:l});}} placeholder="Name"/></TwoColGrid><FormGroup $mb="0.75rem"><Input value={loc.address||''} onChange={e=>{const l=[...locationsContent.locations];l[i]={...l[i],address:e.target.value};setLocationsContent({...locationsContent,locations:l});}} placeholder="Adresse"/></FormGroup><TwoColGrid style={{marginBottom:'0.75rem'}}><Input value={loc.time||''} onChange={e=>{const l=[...locationsContent.locations];l[i]={...l[i],time:e.target.value};setLocationsContent({...locationsContent,locations:l});}} placeholder="Uhrzeit"/><Input value={loc.maps_url||''} onChange={e=>{const l=[...locationsContent.locations];l[i]={...l[i],maps_url:e.target.value};setLocationsContent({...locationsContent,locations:l});}} placeholder="Maps URL"/></TwoColGrid><InlineUpload label="Bild" image={loc.image} onUpload={url=>{const l=[...locationsContent.locations];l[i]={...l[i],image:url};setLocationsContent({...locationsContent,locations:l});}} folder={`${baseFolder}/locations`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="16/9"/></ItemCard>)}<SmallButton onClick={()=>setLocationsContent({...locationsContent,locations:[...(locationsContent.locations||[]),{type:'',name:'',address:'',time:'',maps_url:'',image:null}]})} style={{marginBottom:'1.5rem'}}>+ Location</SmallButton><Divider/><Button onClick={()=>saveContent('locations',locationsContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-directions': const defOpts=[{icon:'🚗',title:'Mit dem Auto',description:''},{icon:'🚃',title:'Öffentlich',description:''},{icon:'✈️',title:'Flugzeug',description:''}]; const opts=directionsContent.options?.length?directionsContent.options:defOpts; return (<Panel><PanelHeader><PanelTitle>Anfahrt</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={directionsContent.title||''} onChange={e=>setDirectionsContent({...directionsContent,title:e.target.value})}/></FormGroup><FormGroup $mb="1.5rem"><Label>Einleitung</Label><TextArea value={directionsContent.intro||''} onChange={e=>setDirectionsContent({...directionsContent,intro:e.target.value})} placeholder="So findet ihr uns..."/></FormGroup><Label>Optionen (max. 3)</Label>{opts.map((o,i)=><ItemCard key={i}><ItemHeader><div style={{display:'flex',gap:'0.5rem'}}><Input value={o.icon||''} onChange={e=>{const os=[...opts];os[i]={...os[i],icon:e.target.value};setDirectionsContent({...directionsContent,options:os});}} style={{width:'50px',textAlign:'center'}}/><Input value={o.title||''} onChange={e=>{const os=[...opts];os[i]={...os[i],title:e.target.value};setDirectionsContent({...directionsContent,options:os});}} style={{width:'150px'}}/></div>{opts.length>1&&<SmallButton $variant="danger" onClick={()=>setDirectionsContent({...directionsContent,options:opts.filter((_,idx)=>idx!==i)})}>×</SmallButton>}</ItemHeader><TextArea value={o.description||''} onChange={e=>{const os=[...opts];os[i]={...os[i],description:e.target.value};setDirectionsContent({...directionsContent,options:os});}}/></ItemCard>)}{opts.length<3&&<SmallButton onClick={()=>setDirectionsContent({...directionsContent,options:[...opts,{icon:'',title:'',description:''}]})} style={{marginBottom:'1.5rem'}}>+ Option</SmallButton>}<FormGroup $mb="1.5rem"><Label>Parken</Label><TextArea value={directionsContent.parking||''} onChange={e=>setDirectionsContent({...directionsContent,parking:e.target.value})}/></FormGroup><Button onClick={()=>saveContent('directions',{...directionsContent,options:opts})} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-rsvp': return (<Panel><PanelHeader><PanelTitle>RSVP</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={rsvpContent.title||''} onChange={e=>setRsvpContent({...rsvpContent,title:e.target.value})}/></FormGroup><FormGroup $mb="1rem"><Label>Untertitel</Label><Input value={rsvpContent.subtitle||''} onChange={e=>setRsvpContent({...rsvpContent,subtitle:e.target.value})}/></FormGroup><FormGroup $mb="1.5rem"><Label>Deadline</Label><Input type="date" value={rsvpContent.deadline||''} onChange={e=>setRsvpContent({...rsvpContent,deadline:e.target.value})}/></FormGroup><Divider/><Label style={{marginBottom:'1rem'}}>Formularfelder</Label><FormGroup $mb="0.75rem"><Checkbox><input type="checkbox" checked={rsvpContent.show_menu!==false} onChange={e=>setRsvpContent({...rsvpContent,show_menu:e.target.checked})}/>Menüauswahl</Checkbox></FormGroup><FormGroup $mb="0.75rem"><Checkbox><input type="checkbox" checked={rsvpContent.show_allergies!==false} onChange={e=>setRsvpContent({...rsvpContent,show_allergies:e.target.checked})}/>Allergien</Checkbox></FormGroup><FormGroup $mb="0.75rem"><Checkbox><input type="checkbox" checked={rsvpContent.show_message!==false} onChange={e=>setRsvpContent({...rsvpContent,show_message:e.target.checked})}/>Nachricht</Checkbox></FormGroup><FormGroup $mb="1rem"><Checkbox><input type="checkbox" checked={rsvpContent.show_custom||false} onChange={e=>setRsvpContent({...rsvpContent,show_custom:e.target.checked})}/>Freitextfeld</Checkbox></FormGroup>{rsvpContent.show_custom&&<FormGroup $mb="1.5rem"><Label>Freitext-Label</Label><Input value={rsvpContent.custom_label||''} onChange={e=>setRsvpContent({...rsvpContent,custom_label:e.target.value})} placeholder="z.B. Sonderwünsche"/></FormGroup>}<Divider/><Button onClick={()=>saveContent('rsvp',rsvpContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-dresscode': return (<Panel><PanelHeader><PanelTitle>Dresscode</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={dresscodeContent.title||''} onChange={e=>setDresscodeContent({...dresscodeContent,title:e.target.value})}/></FormGroup><FormGroup $mb="1rem"><Label>Stil</Label><Input value={dresscodeContent.subtitle||''} onChange={e=>setDresscodeContent({...dresscodeContent,subtitle:e.target.value})} placeholder="Festlich elegant"/></FormGroup><FormGroup $mb="1.5rem"><Label>Beschreibung</Label><TextArea value={dresscodeContent.description||''} onChange={e=>setDresscodeContent({...dresscodeContent,description:e.target.value})}/></FormGroup><TwoColGrid style={{marginBottom:'1.5rem'}}><InlineUpload label="Herren (optional)" image={dresscodeContent.image_male} onUpload={url=>setDresscodeContent({...dresscodeContent,image_male:url})} folder={`${baseFolder}/dresscode`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="3/4"/><InlineUpload label="Damen (optional)" image={dresscodeContent.image_female} onUpload={url=>setDresscodeContent({...dresscodeContent,image_female:url})} folder={`${baseFolder}/dresscode`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="3/4"/></TwoColGrid><Label>Farben</Label><div style={{display:'flex',gap:'0.5rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>{(dresscodeContent.colors||[]).map((c,i)=><div key={i} style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}><ColorInput type="color" value={c} onChange={e=>{const cs=[...dresscodeContent.colors];cs[i]=e.target.value;setDresscodeContent({...dresscodeContent,colors:cs});}}/><SmallButton $variant="danger" onClick={()=>setDresscodeContent({...dresscodeContent,colors:dresscodeContent.colors.filter((_,idx)=>idx!==i)})}>×</SmallButton></div>)}<SmallButton onClick={()=>setDresscodeContent({...dresscodeContent,colors:[...(dresscodeContent.colors||[]),'#000000']})}>+</SmallButton></div><Button onClick={()=>saveContent('dresscode',dresscodeContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-gifts': return (<Panel><PanelHeader><PanelTitle>Geschenke</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={giftsContent.title||''} onChange={e=>setGiftsContent({...giftsContent,title:e.target.value})}/></FormGroup><FormGroup $mb="1rem"><Label>Untertitel</Label><Input value={giftsContent.subtitle||''} onChange={e=>setGiftsContent({...giftsContent,subtitle:e.target.value})}/></FormGroup><FormGroup $mb="1.5rem"><Label>Beschreibung</Label><TextArea value={giftsContent.description||''} onChange={e=>setGiftsContent({...giftsContent,description:e.target.value})}/></FormGroup><FormGroup $mb="1.5rem"><Label>Bankverbindung</Label><TextArea value={giftsContent.payment_info||''} onChange={e=>setGiftsContent({...giftsContent,payment_info:e.target.value})} placeholder="IBAN: DE..."/></FormGroup><Label>Wünsche</Label>{(giftsContent.items||[]).map((it,i)=><ItemCard key={i}><ItemHeader><ItemNumber>#{i+1}</ItemNumber><SmallButton $variant="danger" onClick={()=>setGiftsContent({...giftsContent,items:giftsContent.items.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><TwoColGrid style={{marginBottom:'0.75rem'}}><Input value={it.name||''} onChange={e=>{const its=[...giftsContent.items];its[i]={...its[i],name:e.target.value};setGiftsContent({...giftsContent,items:its});}} placeholder="Name"/><Input value={it.price||''} onChange={e=>{const its=[...giftsContent.items];its[i]={...its[i],price:e.target.value};setGiftsContent({...giftsContent,items:its});}} placeholder="Preis"/></TwoColGrid><FormGroup $mb="0.75rem"><Input value={it.description||''} onChange={e=>{const its=[...giftsContent.items];its[i]={...its[i],description:e.target.value};setGiftsContent({...giftsContent,items:its});}} placeholder="Beschreibung"/></FormGroup><FormGroup $mb="0.75rem"><Input value={it.url||''} onChange={e=>{const its=[...giftsContent.items];its[i]={...its[i],url:e.target.value};setGiftsContent({...giftsContent,items:its});}} placeholder="Link"/></FormGroup><InlineUpload label="Bild (optional)" image={it.image} onUpload={url=>{const its=[...giftsContent.items];its[i]={...its[i],image:url};setGiftsContent({...giftsContent,items:its});}} folder={`${baseFolder}/gifts`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="1/1"/></ItemCard>)}<SmallButton onClick={()=>setGiftsContent({...giftsContent,items:[...(giftsContent.items||[]),{name:'',description:'',price:'',url:'',image:null}]})} style={{marginBottom:'1.5rem'}}>+ Wunsch</SmallButton><Divider/><Button onClick={()=>saveContent('gifts',giftsContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-accommodations': return (<Panel><PanelHeader><PanelTitle>Hotels</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={accommodationsContent.title||''} onChange={e=>setAccommodationsContent({...accommodationsContent,title:e.target.value})}/></FormGroup><FormGroup $mb="1.5rem"><Label>Beschreibung</Label><TextArea value={accommodationsContent.description||''} onChange={e=>setAccommodationsContent({...accommodationsContent,description:e.target.value})}/></FormGroup><Label>Hotels</Label>{(accommodationsContent.hotels||[]).map((h,i)=><ItemCard key={i}><ItemHeader><ItemNumber>#{i+1}</ItemNumber><SmallButton $variant="danger" onClick={()=>setAccommodationsContent({...accommodationsContent,hotels:accommodationsContent.hotels.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><FormGroup $mb="0.75rem"><Input value={h.name||''} onChange={e=>{const hs=[...accommodationsContent.hotels];hs[i]={...hs[i],name:e.target.value};setAccommodationsContent({...accommodationsContent,hotels:hs});}} placeholder="Name"/></FormGroup><TwoColGrid style={{marginBottom:'0.75rem'}}><Input value={h.distance||''} onChange={e=>{const hs=[...accommodationsContent.hotels];hs[i]={...hs[i],distance:e.target.value};setAccommodationsContent({...accommodationsContent,hotels:hs});}} placeholder="Entfernung"/><Input value={h.price_range||''} onChange={e=>{const hs=[...accommodationsContent.hotels];hs[i]={...hs[i],price_range:e.target.value};setAccommodationsContent({...accommodationsContent,hotels:hs});}} placeholder="Preis"/></TwoColGrid><FormGroup $mb="0.75rem"><TextArea value={h.description||''} onChange={e=>{const hs=[...accommodationsContent.hotels];hs[i]={...hs[i],description:e.target.value};setAccommodationsContent({...accommodationsContent,hotels:hs});}}/></FormGroup><FormGroup $mb="0.75rem"><Input value={h.url||''} onChange={e=>{const hs=[...accommodationsContent.hotels];hs[i]={...hs[i],url:e.target.value};setAccommodationsContent({...accommodationsContent,hotels:hs});}} placeholder="Website"/></FormGroup><InlineUpload label="Bild" image={h.image} onUpload={url=>{const hs=[...accommodationsContent.hotels];hs[i]={...hs[i],image:url};setAccommodationsContent({...accommodationsContent,hotels:hs});}} folder={`${baseFolder}/hotels`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="16/9"/></ItemCard>)}<SmallButton onClick={()=>setAccommodationsContent({...accommodationsContent,hotels:[...(accommodationsContent.hotels||[]),{name:'',distance:'',price_range:'',description:'',url:'',image:null}]})} style={{marginBottom:'1.5rem'}}>+ Hotel</SmallButton><Divider/><Button onClick={()=>saveContent('accommodations',accommodationsContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-witnesses': return (<Panel><PanelHeader><PanelTitle>Trauzeugen</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={witnessesContent.title||''} onChange={e=>setWitnessesContent({...witnessesContent,title:e.target.value})}/></FormGroup><Label>Personen</Label>{(witnessesContent.witnesses||[]).map((w,i)=><ItemCard key={i}><ItemHeader><ItemNumber>#{i+1}</ItemNumber><SmallButton $variant="danger" onClick={()=>setWitnessesContent({...witnessesContent,witnesses:witnessesContent.witnesses.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><TwoColGrid style={{marginBottom:'0.75rem'}}><Input value={w.name||''} onChange={e=>{const ws=[...witnessesContent.witnesses];ws[i]={...ws[i],name:e.target.value};setWitnessesContent({...witnessesContent,witnesses:ws});}} placeholder="Name"/><Input value={w.role||''} onChange={e=>{const ws=[...witnessesContent.witnesses];ws[i]={...ws[i],role:e.target.value};setWitnessesContent({...witnessesContent,witnesses:ws});}} placeholder="Rolle"/></TwoColGrid><TwoColGrid style={{marginBottom:'0.75rem'}}><Input value={w.phone||''} onChange={e=>{const ws=[...witnessesContent.witnesses];ws[i]={...ws[i],phone:e.target.value};setWitnessesContent({...witnessesContent,witnesses:ws});}} placeholder="Telefon"/><Input value={w.email||''} onChange={e=>{const ws=[...witnessesContent.witnesses];ws[i]={...ws[i],email:e.target.value};setWitnessesContent({...witnessesContent,witnesses:ws});}} placeholder="E-Mail"/></TwoColGrid><InlineUpload label="Foto" image={w.image} onUpload={url=>{const ws=[...witnessesContent.witnesses];ws[i]={...ws[i],image:url};setWitnessesContent({...witnessesContent,witnesses:ws});}} folder={`${baseFolder}/witnesses`} cloudName={cloudName} uploadPreset={uploadPreset} ratio="1/1"/></ItemCard>)}<SmallButton onClick={()=>setWitnessesContent({...witnessesContent,witnesses:[...(witnessesContent.witnesses||[]),{name:'',role:'',phone:'',email:'',image:null}]})} style={{marginBottom:'1.5rem'}}>+ Person</SmallButton><Divider/><Button onClick={()=>saveContent('witnesses',witnessesContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-gallery': return (<Panel><PanelHeader><PanelTitle>Galerie</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={galleryContent.title||''} onChange={e=>setGalleryContent({...galleryContent,title:e.target.value})}/></FormGroup><MultiUpload label="Bilder" images={galleryContent.images||[]} onAdd={img=>setGalleryContent({...galleryContent,images:[...(galleryContent.images||[]),img]})} onRemove={idx=>setGalleryContent({...galleryContent,images:galleryContent.images.filter((_,i)=>i!==idx)})} folder={`${baseFolder}/gallery`} cloudName={cloudName} uploadPreset={uploadPreset} max={30}/><Button onClick={()=>saveContent('gallery',galleryContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-faq': return (<Panel><PanelHeader><PanelTitle>FAQ</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Titel</Label><Input value={faqContent.title||''} onChange={e=>setFaqContent({...faqContent,title:e.target.value})}/></FormGroup><Label>Fragen</Label>{(faqContent.items||[]).map((it,i)=><ItemCard key={i}><ItemHeader><ItemNumber>#{i+1}</ItemNumber><SmallButton $variant="danger" onClick={()=>setFaqContent({...faqContent,items:faqContent.items.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><FormGroup $mb="0.75rem"><Input value={it.question||''} onChange={e=>{const its=[...faqContent.items];its[i]={...its[i],question:e.target.value};setFaqContent({...faqContent,items:its});}} placeholder="Frage"/></FormGroup><FormGroup><TextArea value={it.answer||''} onChange={e=>{const its=[...faqContent.items];its[i]={...its[i],answer:e.target.value};setFaqContent({...faqContent,items:its});}} placeholder="Antwort"/></FormGroup></ItemCard>)}<SmallButton onClick={()=>setFaqContent({...faqContent,items:[...(faqContent.items||[]),{question:'',answer:''}]})} style={{marginBottom:'1.5rem'}}>+ Frage</SmallButton><Divider/><Button onClick={()=>saveContent('faq',faqContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-weddingabc': return (<Panel><PanelHeader><PanelTitle>ABC</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1.5rem"><Label>Titel</Label><Input value={weddingabcContent.title||''} onChange={e=>setWeddingabcContent({...weddingabcContent,title:e.target.value})}/></FormGroup><Label>Einträge</Label>{(weddingabcContent.entries||[]).map((en,i)=><ItemCard key={i}><ItemHeader><ItemNumber>{en.letter||'?'}</ItemNumber><SmallButton $variant="danger" onClick={()=>setWeddingabcContent({...weddingabcContent,entries:weddingabcContent.entries.filter((_,idx)=>idx!==i)})}>×</SmallButton></ItemHeader><div style={{display:'grid',gridTemplateColumns:'60px 1fr',gap:'0.75rem',marginBottom:'0.75rem'}}><Input value={en.letter||''} onChange={e=>{const ens=[...weddingabcContent.entries];ens[i]={...ens[i],letter:e.target.value.toUpperCase()};setWeddingabcContent({...weddingabcContent,entries:ens});}} maxLength={1} style={{textAlign:'center',fontWeight:'bold'}}/><Input value={en.title||''} onChange={e=>{const ens=[...weddingabcContent.entries];ens[i]={...ens[i],title:e.target.value};setWeddingabcContent({...weddingabcContent,entries:ens});}} placeholder="Titel"/></div><FormGroup><TextArea value={en.description||''} onChange={e=>{const ens=[...weddingabcContent.entries];ens[i]={...ens[i],description:e.target.value};setWeddingabcContent({...weddingabcContent,entries:ens});}}/></FormGroup></ItemCard>)}<SmallButton onClick={()=>setWeddingabcContent({...weddingabcContent,entries:[...(weddingabcContent.entries||[]),{letter:'',title:'',description:''}]})} style={{marginBottom:'1.5rem'}}>+ Eintrag</SmallButton><Divider/><Button onClick={()=>saveContent('weddingabc',weddingabcContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'edit-footer': return (<Panel><PanelHeader><PanelTitle>Footer</PanelTitle>{saveSuccess&&<StatusBadge $status="confirmed">✓</StatusBadge>}</PanelHeader><PanelContent><FormGroup $mb="1rem"><Label>Tagline</Label><Input value={footerContent.tagline||''} onChange={e=>setFooterContent({...footerContent,tagline:e.target.value})} placeholder="Wir freuen uns auf euch!"/></FormGroup><FormGroup $mb="1.5rem"><Label>Hashtag</Label><Input value={footerContent.hashtag||''} onChange={e=>setFooterContent({...footerContent,hashtag:e.target.value})} placeholder="#PauliUndMo2026"/></FormGroup><Button onClick={()=>saveContent('footer',footerContent)} disabled={isSaving}>{isSaving?'...':'Speichern'}</Button></PanelContent></Panel>);
      
      case 'status': return (<Panel><PanelHeader><PanelTitle>Status</PanelTitle></PanelHeader><PanelContent><AlertBox $type={currentStatus==='live'?'success':currentStatus==='archiv'?'info':'warning'}>Aktuell: <strong>{currentStatus==='std'?'Save the Date':currentStatus==='live'?'Live':'Archiv'}</strong></AlertBox><div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>{project?.active_components?.includes('std')&&<Button onClick={()=>handleStatusChange('std')} $variant={currentStatus==='std'?undefined:'secondary'}>STD</Button>}<Button onClick={()=>handleStatusChange('live')} $variant={currentStatus==='live'?undefined:'secondary'}>Live</Button>{project?.active_components?.includes('archiv')&&<Button onClick={()=>handleStatusChange('archiv')} $variant={currentStatus==='archiv'?undefined:'secondary'}>Archiv</Button>}</div></PanelContent></Panel>);
      
      default: return <EmptyState>Nicht gefunden</EmptyState>;
    }
  };

  const titles = {'dashboard':'Übersicht','rsvp':'RSVP','guestbook':'Gästebuch','music':'Musik','photos':'Fotos','edit-hero':'Hero','edit-countdown':'Countdown','edit-lovestory':'Love Story','edit-timeline':'Ablauf','edit-locations':'Locations','edit-directions':'Anfahrt','edit-rsvp':'RSVP','edit-dresscode':'Dresscode','edit-gifts':'Geschenke','edit-accommodations':'Hotels','edit-witnesses':'Trauzeugen','edit-gallery':'Galerie','edit-faq':'FAQ','edit-weddingabc':'ABC','edit-footer':'Footer','status':'Status'};

  return (
    <DashboardContainer>
      <MobileMenuToggle onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</MobileMenuToggle>
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader><SidebarLogo>Admin <span>Panel</span></SidebarLogo><SidebarSub>{coupleNames}</SidebarSub></SidebarHeader>
        {navItems.map(s=><NavSection key={s.section}><NavSectionTitle>{s.section}</NavSectionTitle>{s.items.map(i=><NavItem key={i.id} $active={activeTab===i.id} onClick={()=>{setActiveTab(i.id);setSidebarOpen(false);}}>{i.icon} {i.label}{i.badge>0&&<NavBadge $warning={i.warning}>{i.badge}</NavBadge>}</NavItem>)}</NavSection>)}
        <NavDivider/><NavItem onClick={()=>window.location.href=slug?`/${slug}`:'/'}>← Zurück</NavItem>
      </Sidebar>
      <Main><Header><PageTitle>{titles[activeTab]||'Admin'}</PageTitle></Header>{renderContent()}</Main>
    </DashboardContainer>
  );
}

export default AdminDashboard;
