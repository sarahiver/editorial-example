import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFFFFF;
  position: relative;
`;

const Container = styled.div`
  max-width: 800px;
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

const TimelineWrapper = styled.div`
  position: relative;
  padding-left: 85px;
  
  &::before {
    content: '';
    position: absolute;
    left: 35px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #E0E0E0;
  }
  
  @media (max-width: 600px) {
    padding-left: 60px;
    &::before { left: 25px; }
  }
`;

const Event = styled.div`
  position: relative;
  padding-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => p.$index * 0.1}s;
  
  &:last-child { padding-bottom: 0; }
`;

const Time = styled.div`
  position: absolute;
  left: -85px;
  top: 0;
  width: 50px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #000;
  text-align: right;
  
  @media (max-width: 600px) {
    left: -60px;
    width: 35px;
    font-size: 0.65rem;
  }
`;

const Dot = styled.div`
  position: absolute;
  left: -55px;
  top: 4px;
  width: ${p => p.$highlight ? '12px' : '8px'};
  height: ${p => p.$highlight ? '12px' : '8px'};
  background: ${p => p.$highlight ? '#000' : '#FFF'};
  border: 2px solid #000;
  border-radius: 50%;
  
  @media (max-width: 600px) { left: -40px; }
`;

const EventContent = styled.div``;

const EventIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.75rem;
  vertical-align: middle;
`;

const EventTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.5rem;
  display: inline;
`;

const EventDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0.75rem 0 0 0;
`;

const EventLocation = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Note = styled.div`
  margin-top: 3rem;
  padding: 1.5rem 2rem;
  background: #FAFAFA;
  border-left: 2px solid #000;
  font-family: 'Instrument Serif', serif;
  font-size: 1rem;
  font-style: italic;
  color: #666;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.5s;
`;

function Timeline({ title = 'Der', titleAccent = 'Tagesablauf', events = [], note = '' }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultEvents = [
    { time: '14:00', icon: '💒', title: 'Trauung', description: 'Die standesamtliche Trauung findet in der Schlosskapelle statt.', location: 'Schlosskapelle', highlight: true },
    { time: '15:00', icon: '🥂', title: 'Sektempfang', description: 'Nach der Trauung stoßen wir gemeinsam an.', location: 'Schlossterrasse' },
    { time: '16:30', icon: '📸', title: 'Gruppenfotos', description: 'Zeit für Erinnerungsfotos mit allen Gästen.', location: 'Schlossgarten' },
    { time: '18:00', icon: '🍽️', title: 'Abendessen', description: 'Ein festliches Dinner erwartet euch.', location: 'Orangerie', highlight: true },
    { time: '21:00', icon: '💃', title: 'Eröffnungstanz', description: 'Wir eröffnen das Tanzparkett.', location: 'Festsaal' },
    { time: '22:00', icon: '🎉', title: 'Party', description: 'Lasst uns gemeinsam feiern bis in die Nacht!', location: 'Festsaal' },
  ];

  const items = events.length > 0 ? events : defaultEvents;

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
        <Header>
          <Eyebrow $visible={visible}>So läuft der Tag</Eyebrow>
          <Title $visible={visible}>{title} <span>{titleAccent}</span></Title>
        </Header>
        
        <TimelineWrapper>
          {items.map((event, i) => (
            <Event key={i} $index={i} $visible={visible}>
              <Time>{event.time}</Time>
              <Dot $highlight={event.highlight} />
              <EventContent>
                {event.icon && <EventIcon>{event.icon}</EventIcon>}
                <EventTitle>{event.title}</EventTitle>
                {event.description && <EventDescription>{event.description}</EventDescription>}
                {event.location && <EventLocation>📍 {event.location}</EventLocation>}
              </EventContent>
            </Event>
          ))}
        </TimelineWrapper>
        
        {note && <Note $visible={visible}>{note}</Note>}
      </Container>
    </Section>
  );
}

export default Timeline;
