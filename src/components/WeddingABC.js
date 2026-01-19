import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

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
  margin-bottom: 3rem;
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
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const AlphabetNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.3s;
`;

const LetterButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Instrument Serif', serif;
  font-size: 1rem;
  color: ${p => p.$active ? '#FFF' : '#000'};
  background: ${p => p.$active ? '#000' : 'transparent'};
  border: 1px solid ${p => p.$active ? '#000' : '#E0E0E0'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { border-color: #000; background: ${p => p.$active ? '#000' : '#F5F5F5'}; }
  &:disabled { color: #CCC; border-color: #F0F0F0; cursor: not-allowed; &:hover { background: transparent; } }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: #FFF;
  padding: 2rem;
  border: 1px solid #E0E0E0;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.4 + p.$index * 0.05}s;
`;

const CardLetter = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 2.5rem;
  font-style: italic;
  color: #E0E0E0;
  line-height: 1;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  grid-column: 1 / -1;
`;

const EmptyText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #999;
`;

function WeddingABC({ title = 'Hochzeits', titleAccent = 'ABC', subtitle = 'Alles Wissenswerte von A bis Z', entries = [] }) {
  const [visible, setVisible] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);
  const sectionRef = useRef(null);

  const defaultEntries = [
    { letter: 'A', title: 'Anreise', text: 'Die Location ist mit dem Auto und öffentlichen Verkehrsmitteln gut erreichbar. Parkplätze sind vorhanden.' },
    { letter: 'B', title: 'Blumen', text: 'Unser Farbkonzept ist Weiß und Grün. Wer uns mit Blumen überraschen möchte, kann sich daran orientieren.' },
    { letter: 'D', title: 'Dresscode', text: 'Elegante Abendgarderobe. Die Herren im Anzug, die Damen im Cocktail- oder Abendkleid.' },
    { letter: 'F', title: 'Fotos', text: 'Während der Trauung verzichtet bitte auf eigene Fotos. Bei der Feier dürft ihr gerne knipsen!' },
    { letter: 'G', title: 'Geschenke', text: 'Das größte Geschenk ist eure Anwesenheit. Wer uns dennoch etwas schenken möchte, findet Infos unter Geschenke.' },
    { letter: 'K', title: 'Kinder', text: 'Wir haben uns für eine Feier nur für Erwachsene entschieden.' },
    { letter: 'P', title: 'Parken', text: 'Kostenlose Parkplätze sind direkt an der Location vorhanden.' },
    { letter: 'T', title: 'Taxi', text: 'Am Ende der Feier werden wir Taxis organisieren. Bitte gebt bei der Anmeldung an, ob ihr eines benötigt.' },
    { letter: 'U', title: 'Übernachtung', text: 'Wir haben Zimmer im Hotel Schlossblick reserviert. Stichwort: Hochzeit Sarah & Max.' },
    { letter: 'W', title: 'Wetter', text: 'Plan A ist draußen, Plan B drinnen. Wir sind auf alles vorbereitet!' },
  ];

  const items = entries.length > 0 ? entries : defaultEntries;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const availableLetters = [...new Set(items.map(e => e.letter.toUpperCase()))];
  const filteredItems = activeLetter ? items.filter(e => e.letter.toUpperCase() === activeLetter) : items;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Infos</Eyebrow>
          <Title $visible={visible}>{title}<span>{titleAccent}</span></Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <AlphabetNav $visible={visible}>
          <LetterButton $active={activeLetter === null} onClick={() => setActiveLetter(null)}>Alle</LetterButton>
          {alphabet.map(letter => (
            <LetterButton key={letter} $active={activeLetter === letter} disabled={!availableLetters.includes(letter)} onClick={() => setActiveLetter(letter)}>
              {letter}
            </LetterButton>
          ))}
        </AlphabetNav>
        
        <Grid>
          {filteredItems.length > 0 ? (
            filteredItems.map((entry, i) => (
              <Card key={i} $index={i} $visible={visible}>
                <CardLetter>{entry.letter}</CardLetter>
                <CardTitle>{entry.title}</CardTitle>
                <CardText>{entry.text}</CardText>
              </Card>
            ))
          ) : (
            <EmptyState><EmptyText>Keine Einträge für diesen Buchstaben.</EmptyText></EmptyState>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
