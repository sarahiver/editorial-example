import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const FooterSection = styled.footer`
  background: #000;
  color: #FFF;
  padding: 5rem 2rem 2rem;
  position: relative;
`;

const IncludedBadge = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: #FFF;
  color: #000;
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &::before {
    content: '✓';
    font-size: 0.7rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
`;

const Brand = styled.div``;

const Logo = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 2rem;
  margin-bottom: 1rem;
  
  span {
    font-style: italic;
  }
`;

const Tagline = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #999;
  line-height: 1.7;
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: none;
    margin: 0 auto;
  }
`;

const NavColumn = styled.div``;

const NavTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 1.5rem;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const NavLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #CCC;
  transition: color 0.3s ease;
  
  &:hover {
    color: #FFF;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #333;
  margin-bottom: 2rem;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #666;
`;

const AdminLink = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #999;
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: #FFF;
  padding: 3rem;
  max-width: 400px;
  width: 90%;
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  
  &:hover {
    color: #000;
  }
`;

const ModalTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
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
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
  }
`;

const ErrorMessage = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #C62828;
  text-align: center;
  margin-top: 1rem;
`;

function Footer({ coupleNames = 'Pauli & Mo', content = {}, showBadge = false, slug = '' }) {
  const hashtag = content.hashtag || '';
  const tagline = content.tagline || 'Wir freuen uns auf euch!';
  
  const defaultLinks = [
    { label: 'Unsere Geschichte', href: '#story' },
    { label: 'Location', href: '#location' },
    { label: 'Ablauf', href: '#timeline' },
  ];

  const defaultQuickLinks = [
    { label: 'RSVP', href: '#rsvp' },
    { label: 'FAQ', href: '#faq' },
  ];

  const navLinks = defaultLinks;
  const quickNavLinks = defaultQuickLinks;

  const handleAdminClick = () => {
    // Use slug for admin link if available
    const adminPath = slug ? `/${slug}/admin` : '/admin';
    window.location.href = adminPath;
  };

  const year = new Date().getFullYear();
  const name1 = coupleNames.split('&')[0]?.trim() || '';
  const name2 = coupleNames.split('&')[1]?.trim() || '';

  return (
    <FooterSection>
      {showBadge && <IncludedBadge>Included</IncludedBadge>}
      
      <Container>
        <Grid>
          <Brand>
            <Logo>
              {name1} <span>&</span> {name2}
            </Logo>
            <Tagline>{tagline}</Tagline>
          </Brand>
          
          <NavColumn>
            <NavTitle>Navigation</NavTitle>
            <NavList>
              {navLinks.map((link, i) => (
                <li key={i}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </NavList>
          </NavColumn>
          
          <NavColumn>
            <NavTitle>Quick Links</NavTitle>
            <NavList>
              {quickNavLinks.map((link, i) => (
                <li key={i}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </NavList>
          </NavColumn>
        </Grid>
        
        <Divider />
        
        <Bottom>
          <Copyright>© {year} {coupleNames}. Made with love.</Copyright>
          <AdminLink onClick={handleAdminClick}>Admin</AdminLink>
        </Bottom>
      </Container>
    </FooterSection>
  );
}

export default Footer;
