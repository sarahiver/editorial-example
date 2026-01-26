// src/components/AdminDashboard.js - Neon Theme
// Vollständiges Admin Dashboard
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

// Login Screen Styles
const LoginContainer = styled.div`
  min-height: 100vh;
  background: #FAFAFA;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }
`;

const LoginBox = styled.div`
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(0,255,255,0.3);
  width: 100%;
  max-width: 400px;
  margin: 20px;
  position: relative;
  z-index: 1;
`;

const LoginHeader = styled.div`
  background: rgba(0,255,255,0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0,255,255,0.2);
`;

const LoginDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${p => p.$color};
`;

const LoginTitle = styled.span`
  color: rgba(255,255,255,0.6);
  font-family: 'Inter', monospace;
  font-size: 0.8rem;
  margin-left: 10px;
`;

const LoginBody = styled.div`
  padding: 40px 30px;
`;

const LoginLogo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-family: 'Inter', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #000000;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
    margin-bottom: 5px;
  }
  
  p {
    font-family: 'Inter', monospace;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.4);
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LoginField = styled.div`
  label {
    display: block;
    font-family: 'Inter', monospace;
    font-size: 0.8rem;
    color: #2E7D32;
    margin-bottom: 8px;
    
    &::before {
      content: '$ ';
      color: #000000;
    }
  }
  
  input {
    width: 100%;
    padding: 12px 15px;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(0,255,255,0.3);
    color: #fff;
    font-family: 'Inter', monospace;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    
    &::placeholder {
      color: rgba(255,255,255,0.3);
    }
    
    &:focus {
      outline: none;
      border-color: #000000;
      box-shadow: 0 0 15px rgba(0,255,255,0.3);
    }
  }
`;

const LoginSubmit = styled.button`
  width: 100%;
  padding: 15px;
  background: transparent;
  border: 1px solid #000000;
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background: #000000;
    color: #FAFAFA;
    box-shadow: 0 0 30px rgba(0,255,255,0.5);
  }
`;

const LoginError = styled.div`
  background: rgba(255,0,255,0.1);
  border: 1px solid #666666;
  padding: 12px 15px;
  font-family: 'Inter', monospace;
  font-size: 0.8rem;
  color: #666666;
  animation: ${glitch} 0.3s ease;
  
  &::before {
    content: '[ERROR] ';
  }
`;

const LoginBackLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #000000;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #FAFAFA;
  display: flex;
  
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
    z-index: 0;
  }
`;

const Sidebar = styled.aside`
  width: 280px;
  background: rgba(0,0,0,0.95);
  border-right: 1px solid rgba(0,255,255,0.2);
  padding: 30px 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 968px) {
    transform: translateX(${p => p.$open ? '0' : '-100%'});
    transition: transform 0.3s ease;
    box-shadow: ${p => p.$open ? '0 0 50px rgba(0,0,0,0.8)' : 'none'};
  }
`;

const SidebarBackdrop = styled.div`
  display: none;
  
  @media (max-width: 968px) {
    display: ${p => p.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 999;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 25px 30px;
  border-bottom: 1px solid rgba(0,255,255,0.1);
  margin-bottom: 20px;
`;

const Logo = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #000000;
  text-shadow: 0 0 10px rgba(0,255,255,0.5);
  margin-bottom: 5px;
`;

const LogoSub = styled.div`
  font-family: 'Inter', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  background: ${p => p.$active ? 'rgba(0,255,255,0.1)' : 'transparent'};
  border: none;
  border-left: 3px solid ${p => p.$active ? '#000000' : 'transparent'};
  color: ${p => p.$active ? '#000000' : 'rgba(255,255,255,0.6)'};
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(0,255,255,0.05);
    color: #000000;
  }
  
  svg { width: 20px; height: 20px; flex-shrink: 0; }
`;

const NavBadge = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  padding: 3px 8px;
  background: ${p => p.$color || '#666666'};
  color: #000;
  font-weight: 600;
`;

const NavDivider = styled.div`
  height: 1px;
  background: rgba(0,255,255,0.1);
  margin: 20px 25px;
`;

const Main = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 40px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 968px) {
    margin-left: 0;
    padding: 80px 20px 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  
  span {
    color: #000000;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', monospace;
  font-size: 0.85rem;
  color: #2E7D32;
  
  .blink { animation: ${pulse} 1s ease-in-out infinite; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$color}40;
  padding: 25px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%;
    background: ${p => p.$color};
    box-shadow: 0 0 20px ${p => p.$color};
  }
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$color};
  text-shadow: 0 0 20px ${p => p.$color}50;
  line-height: 1;
`;

const Panel = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.2);
  margin-bottom: 30px;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: rgba(0,255,255,0.05);
  border-bottom: 1px solid rgba(0,255,255,0.2);
`;

const Dot = styled.span`
  width: 12px; height: 12px;
  border-radius: 50%;
  background: ${p => p.$color};
`;

const PanelTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  flex: 1;
`;

const PanelContent = styled.div`
  padding: 20px;
  max-height: ${p => p.$maxHeight || 'none'};
  overflow-y: ${p => p.$maxHeight ? 'auto' : 'visible'};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Th = styled.th`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(0,255,255,0.1);
`;

const Td = styled.td`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #fff;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`;

const StatusBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 5px 10px;
  background: ${p => p.$status === 'confirmed' ? 'rgba(0,255,136,0.2)' : p.$status === 'pending' ? 'rgba(255,189,46,0.2)' : 'rgba(255,0,255,0.2)'};
  color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'pending' ? '#ffbd2e' : '#666666'};
  text-transform: uppercase;
`;

const Button = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  padding: ${p => p.$size === 'small' ? '8px 15px' : '12px 25px'};
  background: ${p => p.$variant === 'primary' ? '#000000' : 'transparent'};
  border: 1px solid ${p => p.$variant === 'danger' ? '#666666' : '#000000'};
  color: ${p => p.$variant === 'primary' ? '#FAFAFA' : p.$variant === 'danger' ? '#666666' : '#000000'};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    box-shadow: 0 0 20px ${p => p.$variant === 'danger' ? 'rgba(255,0,255,0.4)' : 'rgba(0,255,255,0.4)'};
    transform: translateY(-2px);
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Toggle = styled.button`
  width: 60px; height: 30px;
  background: ${p => p.$active ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'};
  border: 1px solid ${p => p.$active ? '#2E7D32' : 'rgba(255,255,255,0.2)'};
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${p => p.$active ? '32px' : '3px'};
    width: 22px; height: 22px;
    background: ${p => p.$active ? '#2E7D32' : 'rgba(255,255,255,0.5)'};
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: ${p => p.$active ? '0 0 10px #2E7D32' : 'none'};
  }
`;

const ToggleLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: ${p => p.$active ? '#2E7D32' : 'rgba(255,255,255,0.6)'};
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(0,255,255,0.3);
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #000000;
    background: rgba(0,255,255,0.05);
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid rgba(0,255,255,0.2);
  
  img { width: 100%; height: 100%; object-fit: cover; }
  
  &:hover .overlay { opacity: 1; }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const IconButton = styled.button`
  width: 40px; height: 40px;
  background: rgba(0,255,255,0.2);
  border: 1px solid #000000;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover { background: #000000; color: #FAFAFA; }
`;

const EntryCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.1);
  padding: 20px;
  margin-bottom: 15px;
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const EntryName = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
`;

const EntryDate = styled.div`
  font-family: 'Inter', monospace;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
`;

const EntryContent = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
`;

const SearchInput = styled.input`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(0,255,255,0.3);
  padding: 10px 15px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  width: 250px;
  
  &::placeholder { color: rgba(255,255,255,0.3); }
  &:focus { outline: none; border-color: #000000; }
`;

const AlertBox = styled.div`
  background: ${p => p.$type === 'success' ? 'rgba(0,255,136,0.1)' : p.$type === 'warning' ? 'rgba(255,189,46,0.1)' : 'rgba(255,0,255,0.1)'};
  border: 1px solid ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#ffbd2e' : '#666666'};
  padding: 15px 20px;
  margin-bottom: 20px;
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: ${p => p.$type === 'success' ? '#2E7D32' : p.$type === 'warning' ? '#ffbd2e' : '#666666'};
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px; left: 20px;
  z-index: 1001;
  width: 50px; height: 50px;
  background: rgba(10,10,15,0.9);
  border: 1px solid #000000;
  color: #000000;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0,255,255,0.3);
  
  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background: #000000;
    color: #FAFAFA;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
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

function AdminDashboard({ config = {}, onArchiveToggle }) {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveActive, setArchiveActive] = useState(false);
  const fileInputRef = useRef(null);
  
  // Demo credentials
  const ADMIN_USER = 'demo';
  const ADMIN_PASS = 'demo';
  
  // Handle Login
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
    { id: 1, name: 'Mo Smith', email: 'jordan@example.com', guests: 2, status: 'confirmed', dietary: 'Keine', menu: 'Fleisch', date: '2025-01-15' },
    { id: 2, name: 'Anna Schmidt', email: 'anna@example.com', guests: 1, status: 'confirmed', dietary: 'Vegetarisch', menu: 'Vegetarisch', date: '2025-01-14' },
    { id: 3, name: 'Peter Weber', email: 'peter@example.com', guests: 3, status: 'pending', dietary: 'Vegan', menu: 'Vegan', date: '2025-01-13' },
    { id: 4, name: 'Lisa Müller', email: 'lisa@example.com', guests: 2, status: 'declined', dietary: '', menu: '', date: '2025-01-12' },
    { id: 5, name: 'Thomas Braun', email: 'thomas@example.com', guests: 4, status: 'confirmed', dietary: 'Glutenfrei', menu: 'Fisch', date: '2025-01-11' },
  ]);
  
  const [guestPhotos, setGuestPhotos] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300', uploader: 'Mo S.' },
    { id: 2, url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300', uploader: 'Anna S.' },
    { id: 3, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300', uploader: 'Peter W.' },
  ]);
  
  const [couplePhotos, setCouplePhotos] = useState([]);
  
  const [musicWishes] = useState([
    { id: 1, name: 'Mo', song: 'Perfect', artist: 'Ed Sheeran', date: '2025-01-15' },
    { id: 2, name: 'Anna', song: 'Thinking Out Loud', artist: 'Ed Sheeran', date: '2025-01-14' },
    { id: 3, name: 'Peter', song: 'Marry You', artist: 'Bruno Mars', date: '2025-01-13' },
  ]);
  
  const [guestbookEntries] = useState([
    { id: 1, name: 'Oma Helga', message: 'Ich freue mich so sehr für euch beide! Alles Gute!', date: '2025-01-15' },
    { id: 2, name: 'Onkel Hans', message: 'Herzlichen Glückwunsch! Wir können es kaum erwarten!', date: '2025-01-14' },
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
  
  // If not logged in, show login screen
  if (!isLoggedIn) {
    return (
      <LoginContainer>
        <LoginBox>
          <LoginHeader>
            <LoginDot $color="#ff5f56" />
            <LoginDot $color="#ffbd2e" />
            <LoginDot $color="#27c93f" />
            <LoginTitle>admin_login.sh</LoginTitle>
          </LoginHeader>
          <LoginBody>
            <LoginLogo>
              <h1>// Admin Panel</h1>
              <p>Authentication required</p>
            </LoginLogo>
            <LoginForm onSubmit={handleLogin}>
              {loginError && <LoginError>{loginError}</LoginError>}
              <LoginField>
                <label>username:</label>
                <input 
                  type="text" 
                  placeholder="Enter username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  autoFocus
                />
              </LoginField>
              <LoginField>
                <label>password:</label>
                <input 
                  type="password" 
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </LoginField>
              <LoginSubmit type="submit">
                Authenticate →
              </LoginSubmit>
            </LoginForm>
            <LoginBackLink onClick={() => window.location.href = '/'}>
              ← Back to website
            </LoginBackLink>
          </LoginBody>
        </LoginBox>
      </LoginContainer>
    );
  }

  // Stats
  const stats = {
    total: rsvpData.length,
    confirmed: rsvpData.filter(r => r.status === 'confirmed').length,
    pending: rsvpData.filter(r => r.status === 'pending').length,
    declined: rsvpData.filter(r => r.status === 'declined').length,
    totalGuests: rsvpData.filter(r => r.status === 'confirmed').reduce((acc, r) => acc + r.guests, 0),
    photos: guestPhotos.length,
    musicWishes: musicWishes.length,
    guestbookEntries: guestbookEntries.length,
  };

  const menuStats = {
    Fleisch: rsvpData.filter(r => r.menu === 'Fleisch' && r.status === 'confirmed').length,
    Fisch: rsvpData.filter(r => r.menu === 'Fisch' && r.status === 'confirmed').length,
    Vegetarisch: rsvpData.filter(r => r.menu === 'Vegetarisch' && r.status === 'confirmed').length,
    Vegan: rsvpData.filter(r => r.menu === 'Vegan' && r.status === 'confirmed').length,
  };

  const filteredRsvps = rsvpData.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = (data, filename) => {
    let csv;
    if (filename.includes('rsvp')) {
      csv = [
        ['Name', 'Email', 'Gäste', 'Status', 'Menü', 'Unverträglichkeiten', 'Datum'].join(','),
        ...data.map(r => [r.name, r.email, r.guests, r.status, r.menu, r.dietary, r.date].join(','))
      ].join('\n');
    } else if (filename.includes('music')) {
      csv = [
        ['Name', 'Song', 'Künstler', 'Datum'].join(','),
        ...data.map(r => [r.name, r.song, r.artist, r.date].join(','))
      ].join('\n');
    } else {
      csv = [
        ['Name', 'Nachricht', 'Datum'].join(','),
        ...data.map(r => [r.name, `"${r.message}"`, r.date].join(','))
      ].join('\n');
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
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
    { id: 'rsvp', label: 'RSVPs', icon: Icons.rsvp, badge: stats.pending, badgeColor: '#ffbd2e' },
    { id: 'couple-photos', label: 'Paar Fotos', icon: Icons.photos },
    { id: 'guest-photos', label: 'Gäste Fotos', icon: Icons.photos, badge: stats.photos, badgeColor: '#000000' },
    { id: 'music', label: 'Musikwünsche', icon: Icons.music, badge: stats.musicWishes, badgeColor: '#666666' },
    { id: 'guestbook', label: 'Gästebuch', icon: Icons.guestbook, badge: stats.guestbookEntries, badgeColor: '#999999' },
    { id: 'archive', label: 'Archiv', icon: Icons.archive },
    { id: 'settings', label: 'Einstellungen', icon: Icons.settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            <StatsGrid>
              <StatCard $color="#000000"><StatLabel>Antworten</StatLabel><StatValue $color="#000000">{stats.total}</StatValue></StatCard>
              <StatCard $color="#2E7D32"><StatLabel>Zusagen</StatLabel><StatValue $color="#2E7D32">{stats.confirmed}</StatValue></StatCard>
              <StatCard $color="#ffbd2e"><StatLabel>Ausstehend</StatLabel><StatValue $color="#ffbd2e">{stats.pending}</StatValue></StatCard>
              <StatCard $color="#666666"><StatLabel>Absagen</StatLabel><StatValue $color="#666666">{stats.declined}</StatValue></StatCard>
              <StatCard $color="#999999"><StatLabel>Gäste gesamt</StatLabel><StatValue $color="#999999">{stats.totalGuests}</StatValue></StatCard>
              <StatCard $color="#000000"><StatLabel>Gäste Fotos</StatLabel><StatValue $color="#000000">{stats.photos}</StatValue></StatCard>
            </StatsGrid>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Menü-Übersicht</PanelTitle></PanelHeader>
              <PanelContent>
                <StatsGrid>
                  {Object.entries(menuStats).map(([menu, count]) => (
                    <StatCard key={menu} $color="#000000"><StatLabel>{menu}</StatLabel><StatValue $color="#000000">{count}</StatValue></StatCard>
                  ))}
                </StatsGrid>
              </PanelContent>
            </Panel>
          </>
        );

      case 'rsvp':
        return (
          <>
            <HeaderActions>
              <SearchInput placeholder="Suche..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Button onClick={() => exportCSV(rsvpData, 'rsvp-export')}>{Icons.download} CSV Export</Button>
            </HeaderActions>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>RSVPs ({filteredRsvps.length})</PanelTitle></PanelHeader>
              <PanelContent>
                <TableWrapper>
                  <Table>
                    <thead><tr><Th>Name</Th><Th>Email</Th><Th>Gäste</Th><Th>Status</Th><Th>Menü</Th><Th>Unverträgl.</Th></tr></thead>
                    <tbody>
                      {filteredRsvps.map(row => (
                        <tr key={row.id}>
                          <Td>{row.name}</Td>
                          <Td>{row.email}</Td>
                          <Td>{row.guests}</Td>
                          <Td><StatusBadge $status={row.status}>{row.status === 'confirmed' ? 'Zugesagt' : row.status === 'pending' ? 'Ausstehend' : 'Abgesagt'}</StatusBadge></Td>
                          <Td>{row.menu || '—'}</Td>
                          <Td>{row.dietary || '—'}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              </PanelContent>
            </Panel>
          </>
        );

      case 'couple-photos':
        return (
          <Panel>
            <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Fotos für Archiv hochladen</PanelTitle></PanelHeader>
            <PanelContent>
              <UploadArea onClick={() => fileInputRef.current?.click()}>
                <div style={{ fontSize: '3rem', marginBottom: 15 }}>📸</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter' }}>Fotos hierher ziehen oder <span style={{ color: '#000000' }}>durchsuchen</span></p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </UploadArea>
              {couplePhotos.length > 0 && (
                <ImageGrid>
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
          <>
            <HeaderActions>
              <Button onClick={() => alert(`Download von ${guestPhotos.length} Fotos...`)}>{Icons.download} Alle herunterladen ({guestPhotos.length})</Button>
            </HeaderActions>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Gäste Fotos ({guestPhotos.length})</PanelTitle></PanelHeader>
              <PanelContent>
                <ImageGrid>
                  {guestPhotos.map(photo => (
                    <ImageCard key={photo.id}>
                      <img src={photo.url} alt="Gästefoto" />
                      <ImageOverlay className="overlay">
                        <IconButton>{Icons.download}</IconButton>
                        <IconButton onClick={() => setGuestPhotos(prev => prev.filter(p => p.id !== photo.id))}>{Icons.delete}</IconButton>
                      </ImageOverlay>
                    </ImageCard>
                  ))}
                </ImageGrid>
              </PanelContent>
            </Panel>
          </>
        );

      case 'music':
        return (
          <>
            <HeaderActions>
              <Button onClick={() => exportCSV(musicWishes, 'musikwuensche')}>{Icons.download} CSV Export</Button>
            </HeaderActions>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Musikwünsche ({musicWishes.length})</PanelTitle></PanelHeader>
              <PanelContent $maxHeight="500px">
                {musicWishes.map(wish => (
                  <EntryCard key={wish.id}>
                    <EntryHeader><EntryName>🎵 {wish.song}</EntryName><EntryDate>{wish.date}</EntryDate></EntryHeader>
                    <EntryContent><strong>{wish.artist}</strong> • Gewünscht von {wish.name}</EntryContent>
                  </EntryCard>
                ))}
              </PanelContent>
            </Panel>
          </>
        );

      case 'guestbook':
        return (
          <>
            <HeaderActions>
              <Button onClick={() => exportCSV(guestbookEntries, 'gaestebuch')}>{Icons.download} CSV Export</Button>
            </HeaderActions>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Gästebuch ({guestbookEntries.length})</PanelTitle></PanelHeader>
              <PanelContent $maxHeight="500px">
                {guestbookEntries.map(entry => (
                  <EntryCard key={entry.id}>
                    <EntryHeader><EntryName>{entry.name}</EntryName><EntryDate>{entry.date}</EntryDate></EntryHeader>
                    <EntryContent>"{entry.message}"</EntryContent>
                  </EntryCard>
                ))}
              </PanelContent>
            </Panel>
          </>
        );

      case 'archive':
        return (
          <>
            <AlertBox $type={archiveActive ? 'success' : 'warning'}>
              <span>{archiveActive ? '✓ Archiv-Modus aktiv. Hauptseite zeigt Archiv.' : '⚠ Archiv-Modus deaktiviert.'}</span>
            </AlertBox>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Archiv-Steuerung</PanelTitle></PanelHeader>
              <PanelContent>
                <ToggleWrapper>
                  <Toggle $active={archiveActive} onClick={handleArchiveToggle} />
                  <ToggleLabel $active={archiveActive}>{archiveActive ? 'Archiv AKTIV' : 'Archiv INAKTIV'}</ToggleLabel>
                </ToggleWrapper>
                <p style={{ marginTop: 20, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter', fontSize: '0.85rem', lineHeight: 1.7 }}>
                  Wenn aktiv, wird die Hauptseite (/) auf die Archiv-Seite umgeleitet.
                </p>
                <div style={{ marginTop: 30 }}>
                  <Button onClick={() => window.open('/archive', '_blank')}>Archiv Vorschau →</Button>
                </div>
              </PanelContent>
            </Panel>
          </>
        );

      case 'settings':
        return (
          <>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Daten exportieren</PanelTitle></PanelHeader>
              <PanelContent>
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                  <Button onClick={() => exportCSV(rsvpData, 'rsvp-komplett')}>{Icons.download} RSVPs</Button>
                  <Button onClick={() => exportCSV(musicWishes, 'musikwuensche')}>{Icons.download} Musikwünsche</Button>
                  <Button onClick={() => exportCSV(guestbookEntries, 'gaestebuch')}>{Icons.download} Gästebuch</Button>
                </div>
              </PanelContent>
            </Panel>
            <Panel>
              <PanelHeader><Dot $color="#ff5f56" /><Dot $color="#ffbd2e" /><Dot $color="#27c93f" /><PanelTitle>Gefahrenzone</PanelTitle></PanelHeader>
              <PanelContent>
                <AlertBox $type="danger"><span>⚠ Diese Aktionen können nicht rückgängig gemacht werden!</span></AlertBox>
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                  <Button $variant="danger">Alle RSVPs löschen</Button>
                  <Button $variant="danger">Alle Fotos löschen</Button>
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
    <Container>
      <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>{Icons.menu}</MobileMenuToggle>
      <SidebarBackdrop $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <Logo>// Admin Panel</Logo>
          <LogoSub>Wedding Dashboard v1.0</LogoSub>
        </SidebarHeader>
        {navItems.map(item => (
          <NavItem key={item.id} $active={activeTab === item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
            {item.icon}
            {item.label}
            {item.badge > 0 && <NavBadge $color={item.badgeColor}>{item.badge}</NavBadge>}
          </NavItem>
        ))}
        <NavDivider />
        <NavItem onClick={() => window.location.href = '/'}>← Zurück zur Website</NavItem>
      </Sidebar>

      <Main>
        <Header>
          <div>
            <Title>
              {activeTab === 'dashboard' && <>Dashboard <span>Overview</span></>}
              {activeTab === 'rsvp' && <>RSVP <span>Verwaltung</span></>}
              {activeTab === 'couple-photos' && <>Paar <span>Fotos</span></>}
              {activeTab === 'guest-photos' && <>Gäste <span>Fotos</span></>}
              {activeTab === 'music' && <>Musik<span>wünsche</span></>}
              {activeTab === 'guestbook' && <>Gäste<span>buch</span></>}
              {activeTab === 'archive' && <>Archiv <span>Steuerung</span></>}
              {activeTab === 'settings' && <>Ein<span>stellungen</span></>}
            </Title>
            <Subtitle>$ system_time={currentTime.toLocaleTimeString('de-DE')} <span className="blink">█</span></Subtitle>
          </div>
        </Header>
        {renderContent()}
      </Main>
    </Container>
  );
}

export default AdminDashboard;
