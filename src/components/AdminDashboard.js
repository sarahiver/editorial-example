// Editorial Theme - Admin Dashboard
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  background: #FAFAFA;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-family: 'Instrument Serif', serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
`;

const LogoutBtn = styled.button`
  padding: 0.7rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  background: transparent;
  border: 1px solid #E0E0E0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #000;
    color: #000;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: #FFF;
  padding: 2rem;
  border: 1px solid #E0E0E0;
`;

const StatNumber = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 3rem;
  color: #000;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
`;

const Section2 = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DownloadBtn = styled.button`
  padding: 0.6rem 1.2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
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

const Table = styled.table`
  width: 100%;
  background: #FFF;
  border: 1px solid #E0E0E0;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  text-align: left;
  border-bottom: 1px solid #E0E0E0;
  background: #FAFAFA;
`;

const Td = styled.td`
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #333;
  border-bottom: 1px solid #F0F0F0;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 2px;
  
  ${p => p.status === 'yes' && `
    background: #E8F5E9;
    color: #2E7D32;
  `}
  
  ${p => p.status === 'no' && `
    background: #FFEBEE;
    color: #C62828;
  `}
  
  ${p => p.status === 'pending' && `
    background: #FFF8E1;
    color: #F57F17;
  `}
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const PhotoItem = styled.div`
  aspect-ratio: 1;
  background: #E8E8E8;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const PhotoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${PhotoItem}:hover & {
    opacity: 1;
  }
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    color: #FFF;
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background: #FFF;
  border: 1px dashed #E0E0E0;
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #999;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #E0E0E0;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: ${p => p.active ? '#000' : '#666'};
  background: none;
  border: none;
  border-bottom: 2px solid ${p => p.active ? '#000' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: -1px;
  
  &:hover {
    color: #000;
  }
`;

function AdminDashboard({
  coupleNames = 'Sarah & Max',
  rsvpData = [
    { name: 'Max Mustermann', email: 'max@email.de', status: 'yes', guests: 2, menu: 'Fleisch', date: '2024-03-15' },
    { name: 'Anna Schmidt', email: 'anna@email.de', status: 'yes', guests: 1, menu: 'Vegetarisch', date: '2024-03-14' },
    { name: 'Peter Müller', email: 'peter@email.de', status: 'no', guests: 0, menu: '-', date: '2024-03-13' },
    { name: 'Lisa Weber', email: 'lisa@email.de', status: 'pending', guests: 0, menu: '-', date: '-' },
  ],
  photos = [
    { id: 1, url: null, guestName: 'Max M.', uploadDate: '2024-08-15' },
    { id: 2, url: null, guestName: 'Anna S.', uploadDate: '2024-08-15' },
    { id: 3, url: null, guestName: 'Peter M.', uploadDate: '2024-08-15' },
  ],
  onLogout = () => console.log('Logout'),
  onDownloadRSVP = () => console.log('Download RSVP'),
  onDownloadPhotos = () => console.log('Download Photos'),
}) {
  const [activeTab, setActiveTab] = useState('rsvp');

  const stats = {
    totalInvited: rsvpData.length,
    confirmed: rsvpData.filter(r => r.status === 'yes').length,
    declined: rsvpData.filter(r => r.status === 'no').length,
    pending: rsvpData.filter(r => r.status === 'pending').length,
    totalGuests: rsvpData.filter(r => r.status === 'yes').reduce((sum, r) => sum + r.guests, 0),
    photos: photos.length,
  };

  return (
    <Section>
      <Container>
        <Header>
          <HeaderLeft>
            <Title>Admin-Bereich</Title>
            <Subtitle>Willkommen zurück! Hier findet ihr alle Daten eurer Hochzeit.</Subtitle>
          </HeaderLeft>
          <LogoutBtn onClick={onLogout}>Abmelden</LogoutBtn>
        </Header>
        
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.confirmed}</StatNumber>
            <StatLabel>Zusagen</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalGuests}</StatNumber>
            <StatLabel>Gäste gesamt</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.pending}</StatNumber>
            <StatLabel>Ausstehend</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.photos}</StatNumber>
            <StatLabel>Fotos</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <Tabs>
          <Tab active={activeTab === 'rsvp'} onClick={() => setActiveTab('rsvp')}>
            RSVP-Übersicht
          </Tab>
          <Tab active={activeTab === 'photos'} onClick={() => setActiveTab('photos')}>
            Fotos
          </Tab>
        </Tabs>
        
        {activeTab === 'rsvp' && (
          <Section2>
            <SectionTitle>
              Anmeldungen
              <DownloadBtn onClick={onDownloadRSVP}>CSV Download</DownloadBtn>
            </SectionTitle>
            
            {rsvpData.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>E-Mail</Th>
                      <Th>Status</Th>
                      <Th>Gäste</Th>
                      <Th>Menü</Th>
                      <Th>Datum</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpData.map((guest, i) => (
                      <tr key={i}>
                        <Td>{guest.name}</Td>
                        <Td>{guest.email}</Td>
                        <Td>
                          <StatusBadge status={guest.status}>
                            {guest.status === 'yes' ? 'Zugesagt' : guest.status === 'no' ? 'Abgesagt' : 'Ausstehend'}
                          </StatusBadge>
                        </Td>
                        <Td>{guest.guests}</Td>
                        <Td>{guest.menu}</Td>
                        <Td>{guest.date}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <EmptyState>
                <p>Noch keine RSVP-Antworten eingegangen.</p>
              </EmptyState>
            )}
          </Section2>
        )}
        
        {activeTab === 'photos' && (
          <Section2>
            <SectionTitle>
              Hochgeladen von Gästen
              <DownloadBtn onClick={onDownloadPhotos}>Alle herunterladen</DownloadBtn>
            </SectionTitle>
            
            {photos.length > 0 ? (
              <PhotoGrid>
                {photos.map((photo, i) => (
                  <PhotoItem key={photo.id}>
                    {photo.url ? (
                      <img src={photo.url} alt={`Foto von ${photo.guestName}`} />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#F0F0F0'
                      }}>
                        📷
                      </div>
                    )}
                    <PhotoOverlay>
                      <span>von {photo.guestName}</span>
                    </PhotoOverlay>
                  </PhotoItem>
                ))}
              </PhotoGrid>
            ) : (
              <EmptyState>
                <p>Noch keine Fotos hochgeladen.</p>
              </EmptyState>
            )}
          </Section2>
        )}
      </Container>
    </Section>
  );
}

export default AdminDashboard;
