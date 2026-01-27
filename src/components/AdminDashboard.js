// src/components/AdminDashboard.js - Editorial Theme with Supabase
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../context/WeddingContext';
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
} from '../lib/supabase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFAFA;
`;

const LoginBox = styled.div`
  background: #FFF;
  border: 1px solid #E0E0E0;
  max-width: 420px;
  width: 90%;
  padding: 3rem;
  animation: ${fadeIn} 0.6s ease;
`;

const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  h1 { font-family: 'Instrument Serif', serif; font-size: 2rem; color: #000; span { font-style: italic; } }
  p { font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #999; }
`;

const LoginForm = styled.form`display: flex; flex-direction: column; gap: 1.5rem;`;
const FormGroup = styled.div``;
const Label = styled.label`display: block; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #000; margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: 'Inter', sans-serif; font-size: 1rem; border: 1px solid #E0E0E0; &:focus { outline: none; border-color: #000; }`;
const LoginButton = styled.button`width: 100%; padding: 1.25rem; font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #FFF; background: #000; border: none; cursor: pointer; &:hover { background: #333; }`;
const LoginError = styled.p`font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #C62828; text-align: center; padding: 1rem; background: #FFEBEE;`;
const BackLink = styled.a`display: block; text-align: center; margin-top: 2rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #999; text-decoration: none; cursor: pointer; &:hover { color: #000; }`;

const DashboardContainer = styled.div`min-height: 100vh; display: flex; background: #FAFAFA;`;
const Sidebar = styled.aside`width: 260px; background: #FFF; border-right: 1px solid #E0E0E0; position: fixed; top: 0; left: 0; bottom: 0; padding: 2rem 0; overflow-y: auto; @media (max-width: 968px) { transform: translateX(${p => p.$open ? '0' : '-100%'}); transition: transform 0.3s ease; z-index: 100; }`;
const SidebarHeader = styled.div`padding: 0 1.5rem 2rem; border-bottom: 1px solid #F0F0F0; margin-bottom: 1.5rem;`;
const SidebarLogo = styled.div`font-family: 'Instrument Serif', serif; font-size: 1.25rem; color: #000; span { font-style: italic; }`;
const SidebarSub = styled.p`font-family: 'Inter', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-top: 0.25rem;`;
const NavItem = styled.button`width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; font-family: 'Inter', sans-serif; font-size: 0.85rem; color: ${p => p.$active ? '#000' : '#666'}; background: ${p => p.$active ? '#FAFAFA' : 'transparent'}; border: none; border-left: 2px solid ${p => p.$active ? '#000' : 'transparent'}; cursor: pointer; text-align: left; &:hover { color: #000; background: #FAFAFA; }`;
const NavBadge = styled.span`margin-left: auto; font-size: 0.6rem; font-weight: 600; padding: 0.15rem 0.4rem; background: #000; color: #FFF;`;
const NavDivider = styled.div`height: 1px; background: #F0F0F0; margin: 1rem 1.5rem;`;

const Main = styled.main`flex: 1; margin-left: 260px; padding: 2rem; @media (max-width: 968px) { margin-left: 0; }`;
const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E0E0E0;`;
const PageTitle = styled.h1`font-family: 'Instrument Serif', serif; font-size: 2rem; font-weight: 400; color: #000; span { font-style: italic; }`;
const MobileMenuToggle = styled.button`display: none; position: fixed; top: 1rem; left: 1rem; z-index: 101; background: #FFF; border: 1px solid #E0E0E0; padding: 0.75rem; cursor: pointer; @media (max-width: 968px) { display: block; }`;

const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;`;
const StatCard = styled.div`background: #FFF; border: 1px solid #E0E0E0; padding: 1.5rem; text-align: center;`;
const StatNumber = styled.div`font-family: 'Instrument Serif', serif; font-size: 2.5rem; color: #000;`;
const StatLabel = styled.div`font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666; margin-top: 0.5rem;`;

const Panel = styled.div`background: #FFF; border: 1px solid #E0E0E0; margin-bottom: 1.5rem;`;
const PanelHeader = styled.div`padding: 1.25rem 1.5rem; border-bottom: 1px solid #F0F0F0;`;
const PanelTitle = styled.h3`font-family: 'Instrument Serif', serif; font-size: 1.25rem; color: #000;`;
const PanelContent = styled.div`padding: 1.5rem; max-height: ${p => p.$maxHeight || 'auto'}; overflow-y: auto;`;

const Table = styled.table`width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 0.85rem;`;
const Th = styled.th`text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #666; border-bottom: 1px solid #E0E0E0;`;
const Td = styled.td`padding: 1rem; border-bottom: 1px solid #F0F0F0; color: #333;`;
const StatusBadge = styled.span`font-size: 0.65rem; font-weight: 600; padding: 0.25rem 0.5rem; background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF3E0'}; color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#E65100'};`;
const Button = styled.button`font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.25rem; cursor: pointer; background: ${p => p.$variant === 'danger' ? '#C62828' : '#000'}; color: #FFF; border: none; &:hover { opacity: 0.9; }`;
const SearchInput = styled.input`flex: 1; min-width: 200px; padding: 0.75rem 1rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; border: 1px solid #E0E0E0; &:focus { outline: none; border-color: #000; }`;
const EntryCard = styled.div`padding: 1.25rem; border-bottom: 1px solid #F0F0F0; &:last-child { border-bottom: none; }`;
const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;`;
const EntryName = styled.span`font-family: 'Inter', sans-serif; font-weight: 500; color: #000;`;
const EntryContent = styled.p`font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #666;`;
const EntryActions = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;
const SmallButton = styled.button`font-family: 'Inter', sans-serif; font-size: 0.65rem; padding: 0.4rem 0.8rem; cursor: pointer; border: 1px solid #E0E0E0; background: ${p => p.$variant === 'success' ? '#E8F5E9' : p.$variant === 'danger' ? '#FFEBEE' : '#FFF'}; color: ${p => p.$variant === 'success' ? '#2E7D32' : p.$variant === 'danger' ? '#C62828' : '#666'};`;
const AlertBox = styled.div`padding: 1rem; margin-bottom: 1rem; font-family: 'Inter', sans-serif; font-size: 0.85rem; background: ${p => p.$type === 'success' ? '#E8F5E9' : p.$type === 'warning' ? '#FFF3E0' : '#FFEBEE'}; color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#E65100' : '#C62828'};`;
const LoadingSpinner = styled.div`display: flex; justify-content: center; padding: 2rem; &::after { content: ''; width: 30px; height: 30px; border: 2px solid #E0E0E0; border-top-color: #000; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
const EmptyState = styled.p`text-align: center; color: #999; padding: 2rem; font-family: 'Inter', sans-serif;`;

function AdminDashboard() {
  const { project, projectId, coupleNames } = useWedding();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rsvpData, setRsvpData] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [musicWishes, setMusicWishes] = useState([]);
  const [photoUploads, setPhotoUploads] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(project?.status || 'live');
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => { if (isLoggedIn && projectId) loadAllData(); }, [isLoggedIn, projectId]);
  useEffect(() => { if (project) setCurrentStatus(project.status); }, [project]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [rsvp, guestbook, music, photos] = await Promise.all([
        getRSVPResponses(projectId), getGuestbookEntries(projectId, false), getMusicWishes(projectId), getPhotoUploads(projectId, false),
      ]);
      setRsvpData(rsvp.data || []); setGuestbookEntries(guestbook.data || []); setMusicWishes(music.data || []); setPhotoUploads(photos.data || []);
    } catch (err) { console.error('Error:', err); } finally { setIsLoading(false); }
  };

  const handleLogin = (e) => { e.preventDefault(); if (loginPassword === ADMIN_PASSWORD) { setIsLoggedIn(true); setLoginError(''); } else { setLoginError('Falsches Passwort'); } };
  const handleStatusChange = async (s) => { await updateProjectStatus(projectId, s); setCurrentStatus(s); };
  const handleApproveGuestbook = async (id, a) => { await approveGuestbookEntry(id, a); loadAllData(); };
  const handleDeleteGuestbook = async (id) => { if (window.confirm('Löschen?')) { await deleteGuestbookEntry(id); loadAllData(); } };
  const handleApprovePhoto = async (id, a) => { await approvePhotoUpload(id, a); loadAllData(); };
  const handleDeletePhoto = async (id) => { if (window.confirm('Löschen?')) { await deletePhotoUpload(id); loadAllData(); } };
  const handleDeleteMusic = async (id) => { if (window.confirm('Löschen?')) { await deleteMusicWish(id); loadAllData(); } };
  const exportCSV = (data, filename) => { if (!data.length) return; const csv = [Object.keys(data[0]).join(','), ...data.map(r => Object.values(r).map(v => `"${v||''}"`).join(','))].join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `${filename}.csv`; a.click(); };

  const stats = { confirmed: rsvpData.filter(r => r.attending).length, declined: rsvpData.filter(r => !r.attending).length, guests: rsvpData.filter(r => r.attending).reduce((s, r) => s + (r.persons || 1), 0), pending: guestbookEntries.filter(e => !e.approved).length + photoUploads.filter(p => !p.approved).length };
  const filteredRsvp = rsvpData.filter(r => r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  const navItems = [{ id: 'dashboard', label: 'Übersicht', icon: '📊' }, { id: 'rsvp', label: 'RSVP', icon: '✉️', badge: rsvpData.length }, { id: 'guestbook', label: 'Gästebuch', icon: '📝', badge: guestbookEntries.length }, { id: 'music', label: 'Musik', icon: '🎵', badge: musicWishes.length }, { id: 'photos', label: 'Fotos', icon: '📷', badge: photoUploads.length }, { id: 'status', label: 'Status', icon: '⚙️' }];

  if (!isLoggedIn) return (
    <LoginContainer><LoginBox><LoginLogo><h1>Admin <span>Panel</span></h1><p>{coupleNames || 'Hochzeit'}</p></LoginLogo>{loginError && <LoginError>{loginError}</LoginError>}<LoginForm onSubmit={handleLogin}><FormGroup><Label>Passwort</Label><Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Admin-Passwort" required /></FormGroup><LoginButton type="submit">Anmelden</LoginButton></LoginForm><BackLink href="/">← Zurück zur Website</BackLink></LoginBox></LoginContainer>
  );

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    switch (activeTab) {
      case 'dashboard': return (<><StatsGrid><StatCard><StatNumber>{stats.confirmed}</StatNumber><StatLabel>Zusagen</StatLabel></StatCard><StatCard><StatNumber>{stats.declined}</StatNumber><StatLabel>Absagen</StatLabel></StatCard><StatCard><StatNumber>{stats.guests}</StatNumber><StatLabel>Gäste</StatLabel></StatCard><StatCard><StatNumber>{stats.pending}</StatNumber><StatLabel>Ausstehend</StatLabel></StatCard></StatsGrid><Panel><PanelHeader><PanelTitle>Letzte RSVPs</PanelTitle></PanelHeader><PanelContent>{rsvpData.slice(0, 5).map(r => (<EntryCard key={r.id}><EntryHeader><EntryName>{r.name}</EntryName><StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>{r.attending ? 'Zusage' : 'Absage'}</StatusBadge></EntryHeader><EntryContent>{r.persons || 1} Person(en)</EntryContent></EntryCard>))}{rsvpData.length === 0 && <EmptyState>Noch keine RSVPs</EmptyState>}</PanelContent></Panel></>);
      case 'rsvp': return (<><div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}><SearchInput type="text" placeholder="Suchen..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /><Button onClick={() => exportCSV(rsvpData, 'rsvp')}>Export CSV</Button></div><Panel><PanelHeader><PanelTitle>Alle RSVPs ({rsvpData.length})</PanelTitle></PanelHeader><PanelContent style={{ overflowX: 'auto' }}><Table><thead><tr><Th>Name</Th><Th>E-Mail</Th><Th>Personen</Th><Th>Status</Th><Th>Ernährung</Th></tr></thead><tbody>{filteredRsvp.map(r => (<tr key={r.id}><Td>{r.name}</Td><Td>{r.email}</Td><Td>{r.persons || 1}</Td><Td><StatusBadge $status={r.attending ? 'confirmed' : 'declined'}>{r.attending ? 'Ja' : 'Nein'}</StatusBadge></Td><Td>{r.dietary || '-'}</Td></tr>))}</tbody></Table></PanelContent></Panel></>);
      case 'guestbook': return (<Panel><PanelHeader><PanelTitle>Gästebuch ({guestbookEntries.length})</PanelTitle></PanelHeader><PanelContent $maxHeight="500px">{guestbookEntries.map(e => (<EntryCard key={e.id}><EntryHeader><EntryName>{e.name}</EntryName><StatusBadge $status={e.approved ? 'confirmed' : 'pending'}>{e.approved ? 'OK' : '?'}</StatusBadge></EntryHeader><EntryContent>{e.message}</EntryContent><EntryActions>{!e.approved && <SmallButton $variant="success" onClick={() => handleApproveGuestbook(e.id, true)}>✓</SmallButton>}{e.approved && <SmallButton onClick={() => handleApproveGuestbook(e.id, false)}>×</SmallButton>}<SmallButton $variant="danger" onClick={() => handleDeleteGuestbook(e.id)}>🗑</SmallButton></EntryActions></EntryCard>))}{guestbookEntries.length === 0 && <EmptyState>Keine Einträge</EmptyState>}</PanelContent></Panel>);
      case 'music': return (<><div style={{ marginBottom: '1.5rem' }}><Button onClick={() => exportCSV(musicWishes, 'musik')}>Export CSV</Button></div><Panel><PanelHeader><PanelTitle>Musikwünsche ({musicWishes.length})</PanelTitle></PanelHeader><PanelContent $maxHeight="500px">{musicWishes.map(w => (<EntryCard key={w.id}><EntryHeader><EntryName>🎵 {w.song_title}</EntryName><SmallButton $variant="danger" onClick={() => handleDeleteMusic(w.id)}>×</SmallButton></EntryHeader><EntryContent>{w.artist} · von {w.name}</EntryContent></EntryCard>))}{musicWishes.length === 0 && <EmptyState>Keine Wünsche</EmptyState>}</PanelContent></Panel></>);
      case 'photos': return (<Panel><PanelHeader><PanelTitle>Fotos ({photoUploads.length})</PanelTitle></PanelHeader><PanelContent>{photoUploads.map(p => (<EntryCard key={p.id}><EntryHeader><EntryName>{p.uploaded_by || 'Anonym'}</EntryName><StatusBadge $status={p.approved ? 'confirmed' : 'pending'}>{p.approved ? 'OK' : '?'}</StatusBadge></EntryHeader>{p.cloudinary_url && <img src={p.cloudinary_url} alt="" style={{ maxWidth: '200px', marginTop: '0.5rem' }} />}<EntryActions>{!p.approved && <SmallButton $variant="success" onClick={() => handleApprovePhoto(p.id, true)}>✓</SmallButton>}<SmallButton $variant="danger" onClick={() => handleDeletePhoto(p.id)}>🗑</SmallButton></EntryActions></EntryCard>))}{photoUploads.length === 0 && <EmptyState>Keine Fotos</EmptyState>}</PanelContent></Panel>);
      case 'status': return (<Panel><PanelHeader><PanelTitle>Status</PanelTitle></PanelHeader><PanelContent><AlertBox $type={currentStatus === 'live' ? 'success' : 'warning'}>Aktuell: <strong>{currentStatus === 'std' ? 'Save the Date' : currentStatus === 'live' ? 'Live' : 'Archiv'}</strong></AlertBox><div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}><Button onClick={() => handleStatusChange('std')} style={{ background: currentStatus === 'std' ? '#2E7D32' : '#666' }}>STD</Button><Button onClick={() => handleStatusChange('live')} style={{ background: currentStatus === 'live' ? '#2E7D32' : '#666' }}>Live</Button><Button onClick={() => handleStatusChange('archiv')} style={{ background: currentStatus === 'archiv' ? '#2E7D32' : '#666' }}>Archiv</Button></div></PanelContent></Panel>);
      default: return null;
    }
  };

  return (
    <DashboardContainer>
      <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>☰</MobileMenuToggle>
      <Sidebar $open={sidebarOpen}><SidebarHeader><SidebarLogo>Admin <span>Panel</span></SidebarLogo><SidebarSub>{coupleNames}</SidebarSub></SidebarHeader>{navItems.map(i => (<NavItem key={i.id} $active={activeTab === i.id} onClick={() => { setActiveTab(i.id); setSidebarOpen(false); }}>{i.icon} {i.label}{i.badge > 0 && <NavBadge>{i.badge}</NavBadge>}</NavItem>))}<NavDivider /><NavItem onClick={() => window.location.href = '/'}>← Zurück</NavItem></Sidebar>
      <Main><Header><PageTitle>{activeTab === 'dashboard' && 'Übersicht'}{activeTab === 'rsvp' && <>RSVP <span>Verwaltung</span></>}{activeTab === 'guestbook' && <>Gäste<span>buch</span></>}{activeTab === 'music' && <>Musik<span>wünsche</span></>}{activeTab === 'photos' && <>Foto<span>uploads</span></>}{activeTab === 'status' && 'Status'}</PageTitle></Header>{renderContent()}</Main>
    </DashboardContainer>
  );
}

export default AdminDashboard;
