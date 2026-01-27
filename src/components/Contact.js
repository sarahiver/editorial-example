import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
`;

const Container = styled.div`
  max-width: 1000px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: #FFF;
  padding: 3rem;
  text-align: center;
  border: 1px solid #E0E0E0;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.3 + p.$index * 0.15}s;
`;

const CardImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : '#F0F0F0'};
  margin: 0 auto 1.5rem;
  border: 3px solid #FFF;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const CardRole = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 0.5rem;
`;

const CardName = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.5rem;
`;

const CardRelation = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: 0.95rem;
  font-style: italic;
  color: #666;
  margin-bottom: 1.5rem;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
  transition: color 0.3s ease;
  
  &:hover { color: #000; }
`;

const ContactIcon = styled.span`
  font-size: 1rem;
`;

const InfoBox = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const InfoTitle = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
`;

function Contact({ content = {} }) {
  const title = content.title || 'Eure Ansprechpartner';
  const persons = content.persons || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultWitnesses = [
    {
      role: 'Trauzeugin',
      name: 'Lisa Schneider',
      relation: 'Beste Freundin',
      phone: '+49 170 1234567',
      email: 'lisa@email.de',
      image: null,
    },
    {
      role: 'Trauzeuge',
      name: 'Thomas Weber',
      relation: 'Bester Freund des Bräutigams',
      phone: '+49 171 7654321',
      email: 'thomas@email.de',
      image: null,
    },
  ];

  const items = persons.length > 0 ? persons : defaultWitnesses;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="contact">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Kontakt</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <Grid>
          {items.map((person, i) => (
            <Card key={i} $index={i} $visible={visible}>
              <CardImage $image={person.image} />
              <CardRole>{person.role}</CardRole>
              <CardName>{person.name}</CardName>
              <CardRelation>{person.relation}</CardRelation>
              <ContactList>
                {person.phone && (
                  <ContactItem href={`tel:${person.phone}`}>
                    <ContactIcon>📱</ContactIcon>
                    {person.phone}
                  </ContactItem>
                )}
                {person.email && (
                  <ContactItem href={`mailto:${person.email}`}>
                    <ContactIcon>✉️</ContactIcon>
                    {person.email}
                  </ContactItem>
                )}
              </ContactList>
            </Card>
          ))}
        </Grid>
        
        <InfoBox $visible={visible}>
          <InfoTitle>Überraschungen willkommen!</InfoTitle>
          <InfoText>
            Plant ihr eine Überraschung für das Brautpaar? Sprecht euch gerne mit unseren 
            Trauzeugen ab, damit alles perfekt koordiniert werden kann.
          </InfoText>
        </InfoBox>
      </Container>
    </Section>
  );
}

export default Contact;
