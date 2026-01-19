import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  background: #FAFAFA;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 400;
  color: #000;
  span { font-style: italic; }
`;

const LogoutButton = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  background: none;
  border: 1px solid #E0E0E0;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { color: #000; border-color: #000; }
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
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #999;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #E0E0E0;
`;

const Tab = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$active ? '#000' : '#999'};
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #000;
    transform: scaleX(${p => p.$active ? 1 : 0});
    transition: transform 0.3s ease;
  }
  
  &:hover { color: #000; }
`;

const Table = styled.table`
  width: 100%;
  background: #FFF;
  border: 1px solid #E0E0E0;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #999;
  text-align: left;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E0E0E0;
  background: #FAFAFA;
`;

const Td = styled.td`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #333;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #F0F0F0;
`;

const StatusBadge = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
  border-radius: 2px;
  background: ${p => p.$status === 'confirmed' ? '#E8F5E9' : p.$status === 'declined' ? '#FFEBEE' : '#FFF8E1'};
  color: ${p => p.$status === 'confirmed' ? '#2E7D32' : p.$status === 'declined' ? '#C62828' : '#F57F17'};
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { background: #333; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
`;

const EmptyText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #999;
`;

function AdminDashboard({ coupleNames = 'Sarah & Max', rsvpData = [], photos = [], onLogout, onDownloadRSVP }) {
  const [activeTab, setActiveTab] = useState('rsvp');

  const defaultRsvpData = [
    { id: 1, name: 'Anna Schmidt', email: 'anna@email.de', guests: 2, menu: 'Fleisch', status: 'confirmed', date: '2025-05-10' },
    { id: 2, name: 'Thomas Müller', email: 'thomas@email.de', guests: 1, menu: 'Vegetarisch', status: 'confirmed', date: '2025-05-11' },
    { id: 3, name: 'Lisa Weber', email: 'lisa@email.de', guests: 2, menu: 'Fisch', status: 'pending', date: '2025-05-12' },
    { id: 4, name: 'Michael Koch', email: 'michael@email.de', guests: 1, menu: '-', status: 'declined', date: '2025-05-13' },
  ];

  const data = rsvpData.length > 0 ? rsvpData : defaultRsvpData;
  
  const stats = {
    confirmed: data.filter(r => r.status === 'confirmed').length,
    totalGuests: data.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.guests, 0),
    pending: data.filter(r => r.status === 'pending').length,
    photos: photos.length,
  };

  return (
    <Section>
      <Container>
        <Header>
          <Title>Admin <span>Dashboard</span></Title>
          <LogoutButton onClick={onLogout}>Abmelden</LogoutButton>
        </Header>
        
        <StatsGrid>
          <StatCard><StatNumber>{stats.confirmed}</StatNumber><StatLabel>Zusagen</StatLabel></StatCard>
          <StatCard><StatNumber>{stats.totalGuests}</StatNumber><StatLabel>Gäste gesamt</StatLabel></StatCard>
          <StatCard><StatNumber>{stats.pending}</StatNumber><StatLabel>Ausstehend</StatLabel></StatCard>
          <StatCard><StatNumber>{stats.photos}</StatNumber><StatLabel>Fotos</StatLabel></StatCard>
        </StatsGrid>
        
        <Tabs>
          <Tab $active={activeTab === 'rsvp'} onClick={() => setActiveTab('rsvp')}>RSVP Übersicht</Tab>
          <Tab $active={activeTab === 'photos'} onClick={() => setActiveTab('photos')}>Fotos</Tab>
        </Tabs>
        
        {activeTab === 'rsvp' && (
          <>
            <ActionBar>
              <ActionButton onClick={onDownloadRSVP}>Als CSV exportieren</ActionButton>
            </ActionBar>
            
            {data.length > 0 ? (
              <Table>
                <thead>
                  <tr><Th>Name</Th><Th>E-Mail</Th><Th>Gäste</Th><Th>Menü</Th><Th>Status</Th><Th>Datum</Th></tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      <Td>{row.name}</Td>
                      <Td>{row.email}</Td>
                      <Td>{row.guests}</Td>
                      <Td>{row.menu}</Td>
                      <Td>
                        <StatusBadge $status={row.status}>
                          {row.status === 'confirmed' ? 'Zugesagt' : row.status === 'declined' ? 'Abgesagt' : 'Ausstehend'}
                        </StatusBadge>
                      </Td>
                      <Td>{row.date}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState><EmptyText>Noch keine Anmeldungen vorhanden.</EmptyText></EmptyState>
            )}
          </>
        )}
        
        {activeTab === 'photos' && (
          <EmptyState><EmptyText>Noch keine Fotos hochgeladen.</EmptyText></EmptyState>
        )}
      </Container>
    </Section>
  );
}

export default AdminDashboard;
