// Editorial Theme - Navigation
import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${p => p.scrolled ? 'rgba(255,255,255,0.98)' : 'transparent'};
  backdrop-filter: ${p => p.scrolled ? 'blur(20px)' : 'none'};
  transition: all 0.4s ease;
  animation: ${fadeIn} 0.8s ease forwards;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    right: 5%;
    height: 1px;
    background: #000;
    transform: scaleX(${p => p.scrolled ? 1 : 0});
    transform-origin: left;
    transition: transform 0.6s ease;
  }
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled.a`
  font-family: 'Instrument Serif', serif;
  font-size: 1.8rem;
  color: #000;
  text-decoration: none;
  letter-spacing: -0.02em;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #000;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 3rem;
  list-style: none;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.li`
  a {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: #1A1A1A;
    text-decoration: none;
    position: relative;
    transition: color 0.3s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 1px;
      background: #000;
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: #000;
      &::after { width: 100%; }
    }
  }
`;

const DateBadge = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666;
  padding: 0.5rem 1rem;
  border: 1px solid #E0E0E0;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

// Mobile Menu
const MobileMenuBtn = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  z-index: 1001;
  
  @media (max-width: 968px) {
    display: flex;
  }
  
  span {
    display: block;
    width: 24px;
    height: 2px;
    background: #000;
    transition: all 0.3s ease;
    
    ${p => p.isOpen && css`
      &:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
      &:nth-child(2) { opacity: 0; }
      &:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    `}
  }
`;

const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 968px) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 400px;
    height: 100vh;
    background: #FFF;
    padding: 6rem 2rem 2rem;
    transform: translateX(${p => p.isOpen ? '0' : '100%'});
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${p => p.isOpen ? '-10px 0 30px rgba(0,0,0,0.1)' : 'none'};
    z-index: 999;
  }
`;

const MobileNavLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MobileNavLink = styled.li`
  border-bottom: 1px solid #E0E0E0;
  
  a {
    display: block;
    font-family: 'Instrument Serif', serif;
    font-size: 1.5rem;
    color: #000;
    text-decoration: none;
    padding: 1.25rem 0;
    transition: all 0.3s ease;
    
    &:hover {
      padding-left: 1rem;
      color: #666;
    }
  }
`;

const MobileDateBadge = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #E0E0E0;
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-family: 'Instrument Serif', serif;
    font-size: 1.2rem;
    color: #000;
  }
`;

const Overlay = styled.div`
  display: none;
  
  @media (max-width: 968px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    opacity: ${p => p.isOpen ? 1 : 0};
    visibility: ${p => p.isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 998;
  }
`;

function Navigation({ 
  coupleNames = 'Sarah & Max',
  weddingDate = '15. August 2025',
  links = [
    { label: 'Unser Weg', href: '#story' },
    { label: 'Hochzeit', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ]
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Nav scrolled={scrolled}>
        <NavInner>
          <Logo href="#top">{coupleNames}</Logo>
          
          <NavLinks>
            {links.map((link, i) => (
              <NavLink key={i}>
                <a href={link.href}>{link.label}</a>
              </NavLink>
            ))}
          </NavLinks>
          
          <DateBadge>{weddingDate}</DateBadge>
          
          <MobileMenuBtn 
            isOpen={mobileMenuOpen} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </MobileMenuBtn>
        </NavInner>
      </Nav>
      
      <Overlay isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)} />
      
      <MobileMenu isOpen={mobileMenuOpen}>
        <MobileNavLinks>
          {links.map((link, i) => (
            <MobileNavLink key={i}>
              <a href={link.href} onClick={handleLinkClick}>{link.label}</a>
            </MobileNavLink>
          ))}
        </MobileNavLinks>
        
        <MobileDateBadge>
          <span>Save the Date</span>
          <p>{weddingDate}</p>
        </MobileDateBadge>
      </MobileMenu>
    </>
  );
}

export default Navigation;
