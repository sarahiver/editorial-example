import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
`;

const Title = styled.h2`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: #000;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span { font-style: italic; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: #FFF;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => p.$index * 0.15}s;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid rgba(0,0,0,0.1);
    pointer-events: none;
  }
`;

const CardImage = styled.div`
  width: 100%;
  padding-top: 66%;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : '#F0F0F0'};
  transition: transform 0.6s ease;
  
  ${Card}:hover & { transform: scale(1.05); }
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const LocationType = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 0.75rem;
`;

const LocationName = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const DetailIcon = styled.span`
  color: #666;
  font-size: 1rem;
`;

const DetailText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

const MapLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000;
  margin-top: 1.5rem;
  padding-bottom: 2px;
  border-bottom: 1px solid #000;
  transition: all 0.3s ease;
  
  &:hover { color: #666; border-color: #666; }
`;

function Locations({ content = {} }) {
  const title = content.title || 'Die Locations';
  const locations = content.locations || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultLocations = [
    { type: 'Trauung', name: 'Schloss Heidelberg', address: 'Schlosshof 1, 69117 Heidelberg', time: '14:00 Uhr', image: null, maps_url: '#' },
    { type: 'Feier', name: 'Orangerie', address: 'Schlosspark 5, 69117 Heidelberg', time: 'Ab 16:00 Uhr', image: null, maps_url: '#' },
  ];

  const items = locations.length > 0 ? locations : defaultLocations;

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
        <Header>
          <Eyebrow $visible={visible}>Wo wir feiern</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((loc, i) => (
            <Card key={i} $index={i} $visible={visible}>
              <ImageWrapper>
                <CardImage $image={loc.image} />
              </ImageWrapper>
              <CardContent>
                <LocationType>{loc.type}</LocationType>
                <LocationName>{loc.name}</LocationName>
                <DetailRow><DetailIcon>📍</DetailIcon><DetailText>{loc.address}</DetailText></DetailRow>
                <DetailRow><DetailIcon>🕐</DetailIcon><DetailText>{loc.time}</DetailText></DetailRow>
                {loc.maps_url && <MapLink href={loc.maps_url} target="_blank" rel="noopener noreferrer">Route anzeigen →</MapLink>}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default Locations;
