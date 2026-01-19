// Editorial Theme - Timeline (Tagesablauf)
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
  position: relative;
`;

const Container = styled.div`
  max-width: 800px;
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

const TimelineList = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 85px;
    top: 0;
    width: 1px;
    height: 100%;
    background: #E0E0E0;
    
    @media (max-width: 600px) {
      left: 50px;
    }
  }
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 70px 30px 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => 0.1 + p.index * 0.1}s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 45px 20px 1fr;
    gap: 0.75rem;
  }
`;

const Time = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #000;
  text-align: right;
  padding-top: 0.25rem;
  
  @media (max-width: 600px) {
    font-size: 0.75rem;
  }
`;

const Marker = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const MarkerDot = styled.div`
  width: 12px;
  height: 12px;
  background: ${p => p.highlight ? '#000' : '#FFF'};
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-top: 0.25rem;
`;

const Content = styled.div`
  background: #FFF;
  padding: 1.5rem;
  border: 1px solid #E0E0E0;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: #000;
  }
`;

const EventIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const EventTitle = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const EventDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
`;

const EventLocation = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Note = styled.div`
  margin-top: 3rem;
  padding: 1.5rem;
  background: #FFF;
  border: 1px dashed #E0E0E0;
  text-align: center;
  opacity: ${p => p.visible ? 1 : 0};
  transition: all 0.8s ease;
  transition-delay: 0.6s;
  
  p {
    font-family: 'Instrument Serif', serif;
    font-size: 1rem;
    font-style: italic;
    color: #666;
    line-height: 1.6;
  }
`;

function Timeline({
  title = 'Der',
  titleAccent = 'Tagesablauf',
  events = [
    {
      time: '14:00',
      icon: '💒',
      title: 'Trauung',
      description: 'Standesamtliche Trauung im Königssaal',
      location: 'Schloss Heidelberg',
      highlight: true,
    },
    {
      time: '15:00',
      icon: '🥂',
      title: 'Sektempfang',
      description: 'Empfang im Schlossgarten mit Häppchen und Getränken',
      location: 'Schlossgarten',
      highlight: false,
    },
    {
      time: '16:30',
      icon: '📸',
      title: 'Gruppenfoto',
      description: 'Wir bitten alle Gäste für ein gemeinsames Foto zusammenzukommen',
      location: 'Schlossterrasse',
      highlight: false,
    },
    {
      time: '17:30',
      icon: '🍽️',
      title: 'Dinner',
      description: '4-Gänge-Menü im festlichen Ambiente',
      location: 'Restaurant Schlossweinstube',
      highlight: true,
    },
    {
      time: '20:00',
      icon: '💃',
      title: 'Eröffnungstanz',
      description: 'Der erste Tanz als verheiratetes Paar',
      location: 'Tanzsaal',
      highlight: false,
    },
    {
      time: '21:00',
      icon: '🎉',
      title: 'Party',
      description: 'Feiert mit uns bis in die Nacht!',
      location: 'Tanzsaal',
      highlight: false,
    },
  ],
  note = 'Zeiten können sich leicht verschieben. Wir halten euch auf dem Laufenden!',
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
    <Section ref={sectionRef} id="timeline">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Programm</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
        </Header>
        
        <TimelineList>
          {events.map((event, i) => (
            <TimelineItem key={i} index={i} visible={visible}>
              <Time>{event.time}</Time>
              <Marker>
                <MarkerDot highlight={event.highlight} />
              </Marker>
              <Content>
                <EventTitle>
                  <EventIcon>{event.icon}</EventIcon>
                  {event.title}
                </EventTitle>
                <EventDescription>{event.description}</EventDescription>
                {event.location && (
                  <EventLocation>
                    <span>📍</span> {event.location}
                  </EventLocation>
                )}
              </Content>
            </TimelineItem>
          ))}
        </TimelineList>
        
        {note && (
          <Note visible={visible}>
            <p>{note}</p>
          </Note>
        )}
      </Container>
    </Section>
  );
}

export default Timeline;
