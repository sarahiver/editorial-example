// src/components/AdminDashboard.js - Editorial Theme
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============================================
// LOGIN SCREEN - Editorial Style
// ============================================

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFAFA;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }
`;

const LoginBox = styled.div`
  background: #FFF;
  border: 1px solid #E0E0E0;
  max-width: 420px;
  width: 90%;
  padding: 3rem;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease;
`;

const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 2rem;
    font-weight: 400;
    color: #000;
    margin-bottom: 0.5rem;
    
    span { font-style: italic; }
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: #999;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    background: #FFF;
  }
  
  &::placeholder {
    color: #CCC;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: #333;
  }
`;

const LoginError = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #C62828;
  text-align: center;
  padding: 1rem;
  background: #FFEBEE;
  border: 1px solid #FFCDD2;
`;

const BackLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #000;
  }
`;

// ============================================
// DASHBOARD LAYOUT - Editorial Style
// ============================================

const DashboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: #FAFAFA;
`;

const Sidebar = styled.aside`
  width: 260px;
  background: #FFF;
  border-right: 1px solid #E0E0E0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  
  @media (max-width: 968px) {
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    transition: transform 0.3s ease;
    box-shadow: ${p => p.$open ? '10px 0 30px rgba(0,0,0,0.1)' : 'none'};
  }
`;

const SidebarBackdrop = styled.div`
  display: none;
  
  @media (max-width: 968px) {
    display: ${p => p.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 99;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 1.5rem;
`;

const SidebarLogo = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 1.25rem;
  color: #000;
  
  span { font-style: italic; }
`;

const SidebarSub = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
  margin-top: 0.25rem;
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: ${p => p.$active ? '#000' : '#666'};
  background: ${p => p.$active ? '#FAFAFA' : 'transparent'};
  border: none;
  border-left: 2px solid ${p => p.$active ? '#000' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    color: #000;
    background: #FAFAFA;
  }
  
  svg {
    width: 18px;
    height: 18px;
    opacity: ${p => p.$active ? 1 : 0.5};
  }
`;

const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  background: ${p => p.$color || '#000'};
  color: #FFF;
`;

const NavDivider = styled.div`
  height: 1px;
  background: #F0F0F0;
  margin: 1rem 1.5rem;
`;

const Main = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  
  @media (max-width: 968px) {
    margin-left: 0;
    padding: 1.5rem;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 101;
  width: 44px;
  height: 44px;
  background: #FFF;
  border: 1px solid #E0E0E0;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 968px) {
    display: flex;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 968px) {
    margin-top: 3rem;
  }
`;

const PageTitle = styled.h1`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  color: #000;
  
  span { font-style: italic; }
`;

const HeaderTime = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #999;
`;

// ============================================
// DASHBOARD COMPONENTS - Editorial Style
// ============================================

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #FFF;
  padding: 1.5rem;
  border: 1px solid #E0E0E0;
`;

const StatNumber = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 2.5rem;
  color: #000;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #999;
`;

const Panel = styled.div`
  background: #FFF;
  border: 1px solid #E0E0E0;
  margin-bottom: 1.5rem;
`;

const PanelHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
`;

const PanelContent = styled.div`
  padding: 1.5rem;
  max-height: ${p => p.$maxHeight || 'none'};
  overflow-y: ${p => p.$maxHeight ? 'auto' : 'visible'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #999;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #F0F0F0;
  white-space: nowrap;
`;

const Td = styled.td`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #333;
  padding: 1rem;
  border-bottom: 1px solid #F5F5F5;
`;

const StatusBadge = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF8E1'};
  color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#F57F17'};
`;

const Button = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$variant === 'danger' ? '#FFF' : '#FFF'};
  background: ${p => p.$variant === 'danger' ? '#C62828' : '#000'};
  border: none;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${p => p.$variant === 'danger' ? '#B71C1C' : '#333'};
  }
`;

const SearchInput = styled.input`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  padding: 0.75rem 1rem;
  border: 1px solid #E0E0E0;
  background: #FFF;
  width: 250px;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
  
  &::placeholder {
    color: #CCC;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: #E0E0E0;
    transition: 0.3s;
    
    &::before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: #FFF;
      transition: 0.3s;
    }
  }
  
  input:checked + span {
    background: #000;
  }
  
  input:checked + span::before {
    transform: translateX(24px);
  }
`;

const AlertBox = styled.div`
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${p => p.$type === 'success' ? '#C8E6C9' : p.$type === 'warning' ? '#FFE082' : '#FFCDD2'};
  background: ${p => p.$type === 'success' ? '#E8F5E9' : p.$type === 'warning' ? '#FFF8E1' : '#FFEBEE'};
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#F57F17' : '#C62828'};
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const ImageCard = styled.div`
  aspect-ratio: 1;
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: 'Photo';
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #CCC;
    position: absolute;
  }
  
  &:has(img)::after {
    display: none;
  }
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  background: #FFF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #000;
    color: #FFF;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #E0E0E0;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #FAFAFA;
  
  &:hover {
    border-color: #000;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: #666;
  }
`;

const EntryCard = styled.div`
  padding: 1.25rem;
  border: 1px solid #F0F0F0;
  margin-bottom: 1rem;
  background: #FAFAFA;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const EntryName = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #000;
`;

const EntryDate = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  color: #999;
`;

const EntryContent = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
`;

// Icons
const Icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
  rsvp: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  photos: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  music: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  guestbook: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>,
  archive: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5z"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>,
  delete: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>,
};

// ============================================
// MAIN COMPONENT
// ============================================

function AdminDashboard({ config = {}, onArchiveToggle }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveActive, setArchiveActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const ADMIN_USER = 'demo';
  const ADMIN_PASS = 'demo';
  
  const { coupleName = "Pauli & Mo" } = config;
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUsername === ADMIN_USER && loginPassword === ADMIN_PASS) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
      setLoginPassword('');
    }
  };
  
  // Demo Data
  const [rsvpData] = useState([
    { id: 1, name: 'Emma Thompson', email: 'emma@example.com', guests: 2, status: 'confirmed', dietary: 'None', menu: 'Beef', date: '2025-01-15' },
    { id: 2, name: 'James Wilson', email: 'james@example.com', guests: 1, status: 'confirmed', dietary: 'Vegetarian', menu: 'Vegetarian', date: '2025-01-14' },
    { id: 3, name: 'Sophie Chen', email: 'sophie@example.com', guests: 3, status: 'pending', dietary: 'Vegan', menu: 'Vegan', date: '2025-01-13' },
    { id: 4, name: 'Marcus Rivera', email: 'marcus@example.com', guests: 2, status: 'declined', dietary: '', menu: '', date: '2025-01-12' },
    { id: 5, name: 'Olivia Brown', email: 'olivia@example.com', guests: 4, status: 'confirmed', dietary: 'Gluten-free', menu: 'Fish', date: '2025-01-11' },
  ]);
  
  const [guestPhotos, setGuestPhotos] = useState([]);
  const [couplePhotos, setCouplePhotos] = useState([]);
  
  const [musicWishes] = useState([
    { id: 1, name: 'Emma', song: 'Perfect', artist: 'Ed Sheeran', date: '2025-01-15' },
    { id: 2, name: 'James', song: 'Thinking Out Loud', artist: 'Ed Sheeran', date: '2025-01-14' },
    { id: 3, name: 'Sophie', song: 'Marry You', artist: 'Bruno Mars', date: '2025-01-13' },
  ]);
  
  const [guestbookEntries] = useState([
    { id: 1, name: 'Grandma Rose', message: "I'm so happy for you both! Can't wait to celebrate!", date: '2025-01-15' },
    { id: 2, name: 'Uncle Tom', message: 'Congratulations! We're counting down the days!', date: '2025-01-14' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleArchiveToggle = () => {
    const newState = !archiveActive;
    setArchiveActive(newState);
    if (onArchiveToggle) onArchiveToggle(newState);
  };

  const stats = {
    total: rsvpData.length,
    confirmed: rsvpData.filter(r => r.status === 'confirmed').length,
    pending: rsvpData.filter(r => r.status === 'pending').length,
    declined: rsvpData.filter(r => r.status === 'declined').length,
    guests: rsvpData.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.guests, 0),
  };

  const filteredRsvp = rsvpData.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = (data, filename) => {
    let csv = '';
    if (filename === 'rsvp') {
      csv = 'Name,Email,Guests,Status,Menu,Dietary,Date\n';
      data.forEach(r => {
        csv += `"${r.name}","${r.email}",${r.guests},${r.status},"${r.menu}","${r.dietary}",${r.date}\n`;
      });
    } else if (filename === 'music') {
      csv = 'Name,Song,Artist,Date\n';
      data.forEach(r => {
        csv += `"${r.name}","${r.song}","${r.artist}",${r.date}\n`;
      });
    } else if (filename === 'guestbook') {
      csv = 'Name,Message,Date\n';
      data.forEach(r => {
        csv += `"${r.name}","${r.message}",${r.date}\n`;
      });
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCouplePhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: event.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
    { id: 'rsvp', label: 'RSVPs', icon: Icons.rsvp, badge: stats.pending, badgeColor: '#F57F17' },
    { id: 'couple-photos', label: 'Couple Photos', icon: Icons.photos },
    { id: 'guest-photos', label: 'Guest Photos', icon: Icons.photos },
    { id: 'music', label: 'Music Wishes', icon: Icons.music },
    { id: 'guestbook', label: 'Guestbook', icon: Icons.guestbook },
    { id: 'archive', label: 'Archive', icon: Icons.archive },
    { id: 'settings', label: 'Settings', icon: Icons.settings },
  ];

  // ============================================
  // LOGIN SCREEN
  // ============================================
  if (!isLoggedIn) {
    return (
      <LoginContainer>
        <LoginBox>
          <LoginLogo>
            <h1>Admin <span>Dashboard</span></h1>
            <p>Sign in to manage your wedding</p>
          </LoginLogo>
          
          <LoginForm onSubmit={handleLogin}>
            {loginError && <LoginError>{loginError}</LoginError>}
            
            <FormGroup>
              <Label>Username</Label>
              <Input 
                type="text" 
                placeholder="Enter username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                autoFocus
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Password</Label>
              <Input 
                type="password" 
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </FormGroup>
            
            <LoginButton type="submit">Sign In</LoginButton>
          </LoginForm>
          
          <BackLink onClick={() => window.location.href = '/'}>← Back to website</BackLink>
        </LoginBox>
      </LoginContainer>
    );
  }

  // ============================================
  // DASHBOARD CONTENT
  // ============================================
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <StatsGrid>
              <StatCard><StatNumber>{stats.total}</StatNumber><StatLabel>Total Responses</StatLabel></StatCard>
              <StatCard><StatNumber>{stats.confirmed}</StatNumber><StatLabel>Confirmed</StatLabel></StatCard>
              <StatCard><StatNumber>{stats.pending}</StatNumber><StatLabel>Pending</StatLabel></StatCard>
              <StatCard><StatNumber>{stats.guests}</StatNumber><StatLabel>Total Guests</StatLabel></StatCard>
            </StatsGrid>
            
            <Panel>
              <PanelHeader><PanelTitle>Recent Activity</PanelTitle></PanelHeader>
              <PanelContent>
                {rsvpData.slice(0, 3).map(r => (
                  <EntryCard key={r.id}>
                    <EntryHeader>
                      <EntryName>{r.name}</EntryName>
                      <StatusBadge $status={r.status}>
                        {r.status === 'confirmed' ? 'Confirmed' : r.status === 'declined' ? 'Declined' : 'Pending'}
                      </StatusBadge>
                    </EntryHeader>
                    <EntryContent>{r.guests} guest(s) · {r.menu || 'No menu selected'}</EntryContent>
                  </EntryCard>
                ))}
              </PanelContent>
            </Panel>
          </>
        );

      case 'rsvp':
        return (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <SearchInput 
                type="text" 
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={() => exportCSV(rsvpData, 'rsvp')}>{Icons.download} Export CSV</Button>
            </div>
            
            <Panel>
              <PanelHeader><PanelTitle>All RSVPs ({rsvpData.length})</PanelTitle></PanelHeader>
              <PanelContent style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr><Th>Name</Th><Th>Email</Th><Th>Guests</Th><Th>Status</Th><Th>Menu</Th><Th>Date</Th></tr>
                  </thead>
                  <tbody>
                    {filteredRsvp.map(r => (
                      <tr key={r.id}>
                        <Td>{r.name}</Td>
                        <Td>{r.email}</Td>
                        <Td>{r.guests}</Td>
                        <Td><StatusBadge $status={r.status}>{r.status === 'confirmed' ? 'Confirmed' : r.status === 'declined' ? 'Declined' : 'Pending'}</StatusBadge></Td>
                        <Td>{r.menu || '-'}</Td>
                        <Td>{r.date}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </PanelContent>
            </Panel>
          </>
        );

      case 'couple-photos':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Upload Photos for Archive</PanelTitle></PanelHeader>
            <PanelContent>
              <UploadArea onClick={() => fileInputRef.current?.click()}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>📷</div>
                <p>Drag photos here or click to browse</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </UploadArea>
              
              {couplePhotos.length > 0 && (
                <ImageGrid style={{ marginTop: '1.5rem' }}>
                  {couplePhotos.map(photo => (
                    <ImageCard key={photo.id}>
                      <img src={photo.url} alt={photo.name} />
                      <ImageOverlay className="overlay">
                        <IconButton onClick={() => setCouplePhotos(prev => prev.filter(p => p.id !== photo.id))}>{Icons.delete}</IconButton>
                      </ImageOverlay>
                    </ImageCard>
                  ))}
                </ImageGrid>
              )}
            </PanelContent>
          </Panel>
        );

      case 'guest-photos':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Guest Photos</PanelTitle></PanelHeader>
            <PanelContent>
              {guestPhotos.length > 0 ? (
                <ImageGrid>
                  {guestPhotos.map(photo => (
                    <ImageCard key={photo.id}>
                      <img src={photo.url} alt="Guest photo" />
                    </ImageCard>
                  ))}
                </ImageGrid>
              ) : (
                <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: '#999', textAlign: 'center', padding: '2rem' }}>
                  No guest photos uploaded yet.
                </p>
              )}
            </PanelContent>
          </Panel>
        );

      case 'music':
        return (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <Button onClick={() => exportCSV(musicWishes, 'music')}>{Icons.download} Export CSV</Button>
            </div>
            
            <Panel>
              <PanelHeader><PanelTitle>Music Wishes ({musicWishes.length})</PanelTitle></PanelHeader>
              <PanelContent $maxHeight="500px">
                {musicWishes.map(wish => (
                  <EntryCard key={wish.id}>
                    <EntryHeader>
                      <EntryName>{wish.song}</EntryName>
                      <EntryDate>{wish.date}</EntryDate>
                    </EntryHeader>
                    <EntryContent>{wish.artist} · Requested by {wish.name}</EntryContent>
                  </EntryCard>
                ))}
              </PanelContent>
            </Panel>
          </>
        );

      case 'guestbook':
        return (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <Button onClick={() => exportCSV(guestbookEntries, 'guestbook')}>{Icons.download} Export CSV</Button>
            </div>
            
            <Panel>
              <PanelHeader><PanelTitle>Guestbook Entries ({guestbookEntries.length})</PanelTitle></PanelHeader>
              <PanelContent $maxHeight="500px">
                {guestbookEntries.map(entry => (
                  <EntryCard key={entry.id}>
                    <EntryHeader>
                      <EntryName>{entry.name}</EntryName>
                      <EntryDate>{entry.date}</EntryDate>
                    </EntryHeader>
                    <EntryContent>{entry.message}</EntryContent>
                  </EntryCard>
                ))}
              </PanelContent>
            </Panel>
          </>
        );

      case 'archive':
        return (
          <Panel>
            <PanelHeader><PanelTitle>Archive Settings</PanelTitle></PanelHeader>
            <PanelContent>
              <AlertBox $type={archiveActive ? 'success' : 'warning'}>
                <p>{archiveActive ? '✓ Archive mode is ACTIVE. Main page redirects to archive.' : 'Archive mode is inactive. Main page shows wedding information.'}</p>
              </AlertBox>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <ToggleSwitch>
                  <input type="checkbox" checked={archiveActive} onChange={handleArchiveToggle} />
                  <span></span>
                </ToggleSwitch>
                <span style={{ fontFamily: 'Inter', fontSize: '0.85rem' }}>
                  {archiveActive ? 'Archive Active' : 'Archive Inactive'}
                </span>
              </div>
              
              <Button onClick={() => window.open('/archive', '_blank')}>Preview Archive Page</Button>
            </PanelContent>
          </Panel>
        );

      case 'settings':
        return (
          <>
            <Panel>
              <PanelHeader><PanelTitle>Export Data</PanelTitle></PanelHeader>
              <PanelContent>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button onClick={() => exportCSV(rsvpData, 'rsvp')}>{Icons.download} RSVPs</Button>
                  <Button onClick={() => exportCSV(musicWishes, 'music')}>{Icons.download} Music Wishes</Button>
                  <Button onClick={() => exportCSV(guestbookEntries, 'guestbook')}>{Icons.download} Guestbook</Button>
                </div>
              </PanelContent>
            </Panel>
            
            <Panel>
              <PanelHeader><PanelTitle>Danger Zone</PanelTitle></PanelHeader>
              <PanelContent>
                <AlertBox $type="danger"><p>⚠ These actions cannot be undone!</p></AlertBox>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button $variant="danger">Delete All RSVPs</Button>
                  <Button $variant="danger">Delete All Photos</Button>
                </div>
              </PanelContent>
            </Panel>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>{Icons.menu}</MobileMenuToggle>
      <SidebarBackdrop $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <SidebarLogo>Admin <span>Panel</span></SidebarLogo>
          <SidebarSub>{coupleName}</SidebarSub>
        </SidebarHeader>
        
        {navItems.map(item => (
          <NavItem 
            key={item.id} 
            $active={activeTab === item.id} 
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
          >
            {item.icon}
            {item.label}
            {item.badge > 0 && <NavBadge $color={item.badgeColor}>{item.badge}</NavBadge>}
          </NavItem>
        ))}
        
        <NavDivider />
        <NavItem onClick={() => window.location.href = '/'}>← Back to Website</NavItem>
      </Sidebar>

      <Main>
        <Header>
          <PageTitle>
            {activeTab === 'dashboard' && <>Dashboard</>}
            {activeTab === 'rsvp' && <>RSVP <span>Management</span></>}
            {activeTab === 'couple-photos' && <>Couple <span>Photos</span></>}
            {activeTab === 'guest-photos' && <>Guest <span>Photos</span></>}
            {activeTab === 'music' && <>Music <span>Wishes</span></>}
            {activeTab === 'guestbook' && <>Guest<span>book</span></>}
            {activeTab === 'archive' && <>Archive <span>Settings</span></>}
            {activeTab === 'settings' && <>Settings</>}
          </PageTitle>
          <HeaderTime>{currentTime.toLocaleTimeString('en-US')}</HeaderTime>
        </Header>
        
        {renderContent()}
      </Main>
    </DashboardContainer>
  );
}

export default AdminDashboard;
