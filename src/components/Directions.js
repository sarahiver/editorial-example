import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFFFFF;
`;

const Container = styled.div`
  max-width: 1100px;
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
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span { font-style: italic; }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  background: #F0F0F0;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.3s;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
    
    &:hover {
      filter: grayscale(0%);
    }
  }
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #999;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: #FAFAFA;
  padding: 2rem;
  border: 1px solid #E0E0E0;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.4 + p.$index * 0.15}s;
`;

const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
`;

const CardText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const CardDetail = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #999;
  padding: 0.75rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
  margin-bottom: 0.5rem;
`;

const AddressCard = styled.div`
  background: #000;
  color: #FFF;
  padding: 2.5rem;
  text-align: center;
  margin-top: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const AddressLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 1rem;
`;

const AddressText = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  color: #FFF;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const NavigateButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  background: #FFF;
  padding: 1rem 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #E0E0E0;
  }
`;

function Directions({ content = {} }) {
  const title = content.title || 'Anfahrt';
  const intro = content.intro || '';
  const address = content.address || '';
  const mapsEmbed = content.maps_embed || '';
  const parking = content.parking || '';
  
  // Use options array from admin, or fallback to defaults
  const options = content.options?.length > 0 ? content.options : [
    { icon: '🚗', title: 'Mit dem Auto', description: 'Parkplätze sind vorhanden.' },
    { icon: '🚃', title: 'Öffentlich', description: 'Infos folgen.' },
    { icon: '✈️', title: 'Flugzeug', description: 'Nächster Flughafen: Hamburg' },
  ];
  
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

  // Filter out empty options
  const activeOptions = options.filter(opt => opt.title || opt.description);

  return (
    <Section ref={sectionRef} id="directions">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Der Weg zu uns</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          {intro && <Subtitle $visible={visible}>{intro}</Subtitle>}
        </Header>
        
        {mapsEmbed && (
          <MapContainer $visible={visible}>
            <iframe 
              src={mapsEmbed}
              title="Anfahrtskarte"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </MapContainer>
        )}
        
        <Grid>
          {activeOptions.map((item, i) => (
            <Card key={i} $index={i} $visible={visible}>
              {item.icon && <CardIcon>{item.icon}</CardIcon>}
              <CardTitle>{item.title}</CardTitle>
              <CardText>{item.description}</CardText>
            </Card>
          ))}
        </Grid>
        
        {parking && (
          <Card $index={activeOptions.length} $visible={visible} style={{ marginTop: '2rem' }}>
            <CardIcon>🅿️</CardIcon>
            <CardTitle>Parken</CardTitle>
            <CardText>{parking}</CardText>
          </Card>
        )}
        
        {address && (
          <AddressCard $visible={visible}>
            <AddressLabel>Adresse der Location</AddressLabel>
            <AddressText>{address}</AddressText>
          </AddressCard>
        )}
      </Container>
    </Section>
  );
}

export default Directions;
