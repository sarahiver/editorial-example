// Editorial Theme - Wedding ABC (Hochzeits-ABC)
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
  position: relative;
`;

const Container = styled.div`
  max-width: 1000px;
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
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: #000;
  
  span { font-style: italic; }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-top: 1rem;
`;

const AlphabetNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  opacity: ${p => p.visible ? 1 : 0};
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const AlphabetLetter = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Instrument Serif', serif;
  font-size: 1rem;
  color: ${p => p.active ? '#FFF' : p.hasEntry ? '#000' : '#CCC'};
  background: ${p => p.active ? '#000' : 'transparent'};
  border: 1px solid ${p => p.active ? '#000' : p.hasEntry ? '#E0E0E0' : '#F0F0F0'};
  cursor: ${p => p.hasEntry ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  ${p => p.hasEntry && !p.active && `
    &:hover {
      border-color: #000;
    }
  `}
`;

const ABCGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ABCCard = styled.div`
  background: #FFF;
  padding: 1.5rem;
  border: 1px solid #E0E0E0;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => 0.1 + p.index * 0.05}s;
  
  &:hover {
    border-color: #000;
  }
`;

const CardLetter = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: #E0E0E0;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
`;

function WeddingABC({
  title = 'Hochzeits',
  titleAccent = 'ABC',
  subtitle = 'Alles Wissenswerte von A bis Z',
  entries = [
    { letter: 'A', title: 'Anfahrt', text: 'Das Schloss ist gut mit dem Auto erreichbar. Parkplätze stehen kostenlos zur Verfügung.' },
    { letter: 'B', title: 'Blumen', text: 'Wir würden uns freuen, wenn ihr keine Blumen mitbringt, da wir bereits für ausreichend Deko gesorgt haben.' },
    { letter: 'D', title: 'Dresscode', text: 'Festlich elegant. Herren im Anzug, Damen im Kleid oder festlichen Outfit.' },
    { letter: 'F', title: 'Fotos', text: 'Während der Trauung bitten wir um Smartphone-Verzicht. Danach freuen wir uns über eure Schnappschüsse!' },
    { letter: 'G', title: 'Geschenke', text: 'Das größte Geschenk ist eure Anwesenheit. Weitere Infos findet ihr unter "Geschenke".' },
    { letter: 'H', title: 'Hotels', text: 'Wir haben Kontingente in nahegelegenen Hotels reserviert. Sprecht uns an!' },
    { letter: 'K', title: 'Kinder', text: 'Kinder sind herzlich willkommen! Es wird eine kleine Spielecke geben.' },
    { letter: 'M', title: 'Musik', text: 'Habt ihr Musikwünsche? Schickt uns gerne eure Lieblingssongs!' },
    { letter: 'P', title: 'Parken', text: 'Kostenlose Parkplätze am Schloss. Der Parkplatz ist ausgeschildert.' },
    { letter: 'R', title: 'Reden', text: 'Möchtet ihr eine Rede halten? Meldet euch bis zum 1. August bei uns.' },
    { letter: 'S', title: 'Shuttle', text: 'Zwischen Hotel und Location verkehrt ein kostenloser Shuttle-Bus.' },
    { letter: 'T', title: 'Taxi', text: 'Taxi Heidelberg: +49 6221 12345. Wir helfen gerne bei der Buchung.' },
    { letter: 'U', title: 'Unterkunft', text: 'Buchungen unter dem Stichwort "Hochzeit Sarah & Max" im Hotel Heidelberg.' },
    { letter: 'W', title: 'Wetter', text: 'Die Feier findet bei jedem Wetter statt. Bei Regen weichen wir in den Saal aus.' },
    { letter: 'Z', title: 'Zeitplan', text: 'Den genauen Ablauf findet ihr unter "Tagesablauf". Bitte seid pünktlich!' },
  ],
}) {
  const [visible, setVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const usedLetters = new Set(entries.map(e => e.letter.toUpperCase()));
  
  const filteredEntries = activeFilter 
    ? entries.filter(e => e.letter.toUpperCase() === activeFilter)
    : entries;

  const handleLetterClick = (letter) => {
    if (!usedLetters.has(letter)) return;
    setActiveFilter(activeFilter === letter ? null : letter);
  };

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Infos von A-Z</Eyebrow>
          <Title>{title}<span>{titleAccent}</span></Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>
        
        <AlphabetNav visible={visible}>
          {alphabet.map(letter => (
            <AlphabetLetter
              key={letter}
              hasEntry={usedLetters.has(letter)}
              active={activeFilter === letter}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </AlphabetLetter>
          ))}
        </AlphabetNav>
        
        <ABCGrid>
          {filteredEntries.map((entry, i) => (
            <ABCCard key={i} index={i} visible={visible}>
              <CardLetter>{entry.letter}</CardLetter>
              <CardTitle>{entry.title}</CardTitle>
              <CardText>{entry.text}</CardText>
            </ABCCard>
          ))}
        </ABCGrid>
      </Container>
    </Section>
  );
}

export default WeddingABC;
