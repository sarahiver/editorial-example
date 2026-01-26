import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

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
  max-width: 600px;
  margin: 0 auto;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.3 + p.$index * 0.15}s;
`;

const CardImage = styled.div`
  width: 100%;
  padding-top: 60%;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : '#E0E0E0'};
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const RecommendedBadge = styled.div`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  padding: 0.3rem 0.6rem;
  margin-bottom: 1rem;
`;

const CardName = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.4rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.5rem;
`;

const CardDistance = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #999;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const PriceRange = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #000;
  margin-bottom: 1.5rem;
  
  span { color: #666; }
`;

const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000;
  padding-bottom: 2px;
  border-bottom: 1px solid #000;
  transition: all 0.3s ease;
  
  &:hover { color: #666; border-color: #666; }
`;

const Note = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: #FAFAFA;
  border-left: 3px solid #000;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const NoteTitle = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.75rem;
`;

const NoteText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
  
  strong { color: #000; }
`;

function Accommodations({
  title = 'Unter',
  titleAccent = 'künfte',
  subtitle = 'Wir haben für euch einige Hotels in der Nähe der Location zusammengestellt.',
  accommodations = [],
  bookingCode = 'Hochzeit Pauli & Mo',
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultAccommodations = [
    {
      name: 'Hotel Schlossblick',
      distance: '500m zur Location',
      description: 'Unser Top-Tipp! Zimmer mit Blick auf das Schloss. Wir haben ein Kontingent reserviert.',
      priceRange: 'ab 120€ / Nacht',
      url: 'https://example.com',
      image: null,
      recommended: true,
    },
    {
      name: 'Boutique Hotel Am Markt',
      distance: '1,2 km zur Location',
      description: 'Charmantes Boutique-Hotel in der Altstadt mit modernem Design.',
      priceRange: 'ab 95€ / Nacht',
      url: 'https://example.com',
      image: null,
    },
    {
      name: 'Pension Heidelberg',
      distance: '800m zur Location',
      description: 'Gemütliche Pension mit familiärer Atmosphäre und gutem Frühstück.',
      priceRange: 'ab 65€ / Nacht',
      url: 'https://example.com',
      image: null,
    },
  ];

  const items = accommodations.length > 0 ? accommodations : defaultAccommodations;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="accommodations">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Übernachten</Eyebrow>
          <Title $visible={visible}>{title}<span>{titleAccent}</span></Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <Grid>
          {items.map((acc, i) => (
            <Card key={i} $index={i} $visible={visible}>
              <CardImage $image={acc.image} />
              <CardContent>
                {acc.recommended && <RecommendedBadge>Empfehlung</RecommendedBadge>}
                <CardName>{acc.name}</CardName>
                <CardDistance>📍 {acc.distance}</CardDistance>
                <CardDescription>{acc.description}</CardDescription>
                <PriceRange>{acc.priceRange} <span>inkl. Frühstück</span></PriceRange>
                {acc.url && <CardLink href={acc.url} target="_blank" rel="noopener noreferrer">Zur Website →</CardLink>}
              </CardContent>
            </Card>
          ))}
        </Grid>
        
        <Note $visible={visible}>
          <NoteTitle>💡 Buchungs-Tipp</NoteTitle>
          <NoteText>
            Im Hotel Schlossblick haben wir ein Zimmerkontingent bis zum 15. Juni reserviert. 
            Nennt bei der Buchung einfach das Stichwort <strong>"{bookingCode}"</strong> für den Sonderpreis.
          </NoteText>
        </Note>
      </Container>
    </Section>
  );
}

export default Accommodations;
