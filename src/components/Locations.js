// Editorial Theme - Locations
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
  position: relative;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #000;
  
  span { font-style: italic; }
`;

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const LocationCard = styled.div`
  background: #FFF;
  border: 1px solid #E0E0E0;
  overflow: hidden;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.2 + p.index * 0.15}s;
  
  &:hover {
    border-color: #000;
  }
`;

const LocationImage = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  background: #F5F5F5;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  ${LocationCard}:hover & img {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%);
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: #999;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

const LocationContent = styled.div`
  padding: 2rem;
`;

const LocationType = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.75rem;
`;

const LocationName = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
`;

const LocationDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  .icon {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .text {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
  
  a {
    color: #000;
    text-decoration: underline;
    text-underline-offset: 2px;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const MapButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: #000;
  border: 1px solid #000;
  transition: all 0.3s ease;
  
  &:hover {
    background: #000;
    color: #FFF;
  }
`;

const InfoBox = styled.div`
  margin-top: 4rem;
  padding: 2.5rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
  text-align: center;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.5s;
`;

const InfoTitle = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto;
`;

function Locations({
  title = 'Die',
  titleAccent = 'Locations',
  locations = [
    {
      type: 'Trauung',
      name: 'Schloss Heidelberg',
      address: 'Schlosshof 1, 69117 Heidelberg',
      time: '14:00 Uhr',
      description: 'Die standesamtliche Trauung findet im historischen Königssaal statt.',
      image: null,
      mapUrl: 'https://maps.google.com',
    },
    {
      type: 'Feier',
      name: 'Restaurant Schlossweinstube',
      address: 'Schlosshof 5, 69117 Heidelberg',
      time: '16:00 Uhr',
      description: 'Direkt neben dem Schloss feiern wir bis in die Nacht.',
      image: null,
      mapUrl: 'https://maps.google.com',
    },
  ],
  infoTitle = 'Anreise & Parken',
  infoText = 'Parkplätze sind am Schloss begrenzt verfügbar. Wir empfehlen die Anreise mit öffentlichen Verkehrsmitteln oder einen Shuttle-Service, den wir für euch organisiert haben.',
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="location">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Wo wir feiern</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
        </Header>
        
        <LocationsGrid>
          {locations.map((location, i) => (
            <LocationCard key={i} index={i} visible={visible}>
              <LocationImage>
                {location.image ? (
                  <img src={location.image} alt={location.name} />
                ) : (
                  <PlaceholderImage>
                    <span>{location.type}</span>
                  </PlaceholderImage>
                )}
              </LocationImage>
              
              <LocationContent>
                <LocationType>{location.type}</LocationType>
                <LocationName>{location.name}</LocationName>
                
                <LocationDetails>
                  <DetailRow>
                    <span className="icon">📍</span>
                    <span className="text">{location.address}</span>
                  </DetailRow>
                  <DetailRow>
                    <span className="icon">🕐</span>
                    <span className="text">{location.time}</span>
                  </DetailRow>
                  {location.description && (
                    <DetailRow>
                      <span className="icon">ℹ️</span>
                      <span className="text">{location.description}</span>
                    </DetailRow>
                  )}
                </LocationDetails>
                
                {location.mapUrl && (
                  <MapButton href={location.mapUrl} target="_blank" rel="noopener noreferrer">
                    Route planen →
                  </MapButton>
                )}
              </LocationContent>
            </LocationCard>
          ))}
        </LocationsGrid>
        
        {infoText && (
          <InfoBox visible={visible}>
            <InfoTitle>{infoTitle}</InfoTitle>
            <InfoText>{infoText}</InfoText>
          </InfoBox>
        )}
      </Container>
    </Section>
  );
}

export default Locations;
