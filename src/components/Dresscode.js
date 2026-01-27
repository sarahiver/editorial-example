import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #000;
  color: #FFF;
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
  color: #999;
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
`;

const Title = styled.h2`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: #FFF;
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span { font-style: italic; }
`;

const Subtitle = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #999;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 4rem;
  
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid #333;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.3 + p.$index * 0.15}s;
`;

const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 3/4;
  background: ${p => p.$src ? `url(${p.$src}) center/cover` : '#1a1a1a'};
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  ${p => p.$hasImage && 'display: none;'}
`;

const CardTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #FFF;
  margin-bottom: 1rem;
`;

const CardList = styled.ul`
  text-align: left;
  max-width: 280px;
  margin: 0 auto;
`;

const CardItem = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #CCC;
  line-height: 1.8;
  padding-left: 1.5rem;
  position: relative;
  
  &::before {
    content: '—';
    position: absolute;
    left: 0;
    color: #666;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 4rem;
  flex-wrap: wrap;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const ColorSwatch = styled.div`
  width: 60px;
  height: 60px;
  background: ${p => p.$color};
  border: ${p => p.$border ? '1px solid #333' : 'none'};
  position: relative;
  
  &::after {
    content: '${p => p.$name}';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666;
    white-space: nowrap;
  }
`;

const Note = styled.div`
  margin-top: 4rem;
  padding: 2rem;
  border: 1px solid #333;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.7s;
`;

const NoteText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  line-height: 1.7;
  margin: 0;
  
  strong { color: #FFF; }
`;

function Dresscode({ content = {} }) {
  const title = content.title || 'Dresscode';
  const subtitle = content.subtitle || 'Elegant';
  const description = content.description || 'Wir freuen uns auf elegante Abendgarderobe.';
  const imageMale = content.image_male || null;
  const imageFemale = content.image_female || null;
  
  // Support both old format (array of objects) and new format (array of hex strings)
  const rawColors = content.colors || [];
  const colors = rawColors.map(c => typeof c === 'string' ? { color: c, name: '' } : c);

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
    <Section ref={sectionRef} id="dresscode">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Was ihr anzieht</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          {subtitle && <Subtitle $visible={visible}>{subtitle}</Subtitle>}
        </Header>
        
        {description && (
          <Note $visible={visible} style={{ marginTop: 0, marginBottom: '3rem' }}>
            <NoteText>{description}</NoteText>
          </Note>
        )}
        
        <Grid>
          <Card $index={0} $visible={visible}>
            {imageMale ? (
              <CardImage $src={imageMale} />
            ) : (
              <CardIcon>👔</CardIcon>
            )}
            <CardTitle>Für die Herren</CardTitle>
            <CardList>
              <CardItem>Dunkler Anzug</CardItem>
              <CardItem>Hemd mit Krawatte oder Fliege</CardItem>
              <CardItem>Elegante Lederschuhe</CardItem>
            </CardList>
          </Card>
          
          <Card $index={1} $visible={visible}>
            {imageFemale ? (
              <CardImage $src={imageFemale} />
            ) : (
              <CardIcon>👗</CardIcon>
            )}
            <CardTitle>Für die Damen</CardTitle>
            <CardList>
              <CardItem>Cocktail- oder Abendkleid</CardItem>
              <CardItem>Eleganter Jumpsuit</CardItem>
              <CardItem>Bitte kein Weiß oder Creme</CardItem>
            </CardList>
          </Card>
        </Grid>
        
        {colors.length > 0 && (
          <ColorPalette $visible={visible}>
            {colors.map((c, i) => (
              <ColorSwatch key={i} $color={c.color} $name={c.name || ''} $border={c.color?.toLowerCase() === '#ffffff'} />
            ))}
          </ColorPalette>
        )}
      </Container>
    </Section>
  );
}

export default Dresscode;
