// Editorial Theme - Footer with Admin Login
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

const FooterSection = styled.footer`
  padding: 4rem 2rem 2rem;
  background: #FAFAFA;
  border-top: 1px solid #E0E0E0;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const BrandCol = styled.div``;

const Logo = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 2rem;
  color: #000;
  margin-bottom: 1.5rem;
`;

const Tagline = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
  max-width: 300px;
`;

const Column = styled.div``;

const ColumnTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 1.5rem;
`;

const LinkList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LinkItem = styled.li`
  a {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #000;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #E0E0E0;
  margin-bottom: 2rem;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
`;

const AdminLink = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #000;
  }
`;

const PoweredBy = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #CCC;
  
  a {
    color: #999;
    text-decoration: none;
    
    &:hover {
      color: #000;
    }
  }
`;

// Login Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  opacity: ${p => p.isOpen ? 1 : 0};
  visibility: ${p => p.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const Modal = styled.div`
  background: #FFF;
  width: 100%;
  max-width: 400px;
  padding: 3rem;
  position: relative;
  transform: translateY(${p => p.isOpen ? 0 : '20px'});
  transition: transform 0.3s ease;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid #E0E0E0;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #000;
  }
`;

const ModalTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  
  &:focus {
    outline: none;
    border-color: #000;
    background: #FFF;
  }
`;

const LoginBtn = styled.button`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #CCC;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #D32F2F;
  text-align: center;
  margin-top: 1rem;
`;

function Footer({
  coupleNames = 'Sarah & Max',
  tagline = 'Wir freuen uns, unseren besonderen Tag mit euch zu teilen.',
  weddingDate = '15. August 2025',
  links = [
    { label: 'Unser Weg', href: '#story' },
    { label: 'Hochzeit', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
  ],
  quickLinks = [
    { label: 'Galerie', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontakt', href: 'mailto:hochzeit@email.de' },
  ],
  onLogin = (email, password) => console.log('Login:', email, password),
  adminEmail = 'demo',
  adminPassword = 'demo',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === adminEmail && password === adminPassword) {
      onLogin(email, password);
      setIsModalOpen(false);
      // In real implementation, redirect to admin area
      alert('Login erfolgreich! Weiterleitung zum Admin-Bereich...');
    } else {
      setError('E-Mail oder Passwort ist falsch.');
    }
    
    setLoading(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <FooterSection>
        <Container>
          <FooterGrid>
            <BrandCol>
              <Logo>{coupleNames}</Logo>
              <Tagline>{tagline}</Tagline>
            </BrandCol>
            
            <Column>
              <ColumnTitle>Navigation</ColumnTitle>
              <LinkList>
                {links.map((link, i) => (
                  <LinkItem key={i}>
                    <a href={link.href}>{link.label}</a>
                  </LinkItem>
                ))}
              </LinkList>
            </Column>
            
            <Column>
              <ColumnTitle>Mehr</ColumnTitle>
              <LinkList>
                {quickLinks.map((link, i) => (
                  <LinkItem key={i}>
                    <a href={link.href}>{link.label}</a>
                  </LinkItem>
                ))}
              </LinkList>
            </Column>
          </FooterGrid>
          
          <Divider />
          
          <BottomRow>
            <Copyright>© {currentYear} {coupleNames}. Mit Liebe erstellt.</Copyright>
            
            <AdminLink onClick={() => setIsModalOpen(true)}>
              🔒 Admin-Login
            </AdminLink>
            
            <PoweredBy>
              Made with ❤️ by <a href="https://si-wedding.de" target="_blank" rel="noopener noreferrer">S&I Wedding</a>
            </PoweredBy>
          </BottomRow>
        </Container>
      </FooterSection>
      
      <ModalOverlay isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
        <Modal isOpen={isModalOpen} onClick={e => e.stopPropagation()}>
          <ModalClose onClick={() => setIsModalOpen(false)}>✕</ModalClose>
          
          <ModalTitle>Admin-Bereich</ModalTitle>
          <ModalSubtitle>Melde dich an, um RSVP-Daten und Fotos herunterzuladen.</ModalSubtitle>
          
          <LoginForm onSubmit={handleLogin}>
            <FormGroup>
              <Label>E-Mail</Label>
              <Input
                type="text"
                placeholder="admin@email.de"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Passwort</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            
            <LoginBtn type="submit" disabled={loading}>
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </LoginBtn>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </LoginForm>
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default Footer;
