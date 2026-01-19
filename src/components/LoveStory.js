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
  margin-bottom: 5rem;
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
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #E0E0E0;
    transform: translateX(-50%);
    
    @media (max-width: 768px) { left: 40px; }
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  background: #000;
  transform: translateX(-50%);
  height: ${p => p.$progress}%;
  transition: height 0.3s ease;
  
  @media (max-width: 768px) { left: 40px; }
`;

const Milestone = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  
  &:nth-child(even) {
    .content { grid-column: 3; text-align: left; }
    .image-wrapper { grid-column: 1; grid-row: 1; }
  }
  
  &:nth-child(odd) {
    .content { grid-column: 1; text-align: right; }
    .image-wrapper { grid-column: 3; }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: 1.5rem;
    
    &:nth-child(even), &:nth-child(odd) {
      .content { grid-column: 2; text-align: left; }
      .image-wrapper { grid-column: 2; grid-row: 2; }
    }
  }
`;

const Marker = styled.div`
  grid-column: 2;
  width: 12px;
  height: 12px;
  background: ${p => p.$active ? '#000' : '#FFF'};
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    grid-column: 1;
    margin-left: 34px;
  }
`;

const ContentBox = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Year = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 0.75rem;
`;

const MilestoneTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.75rem;
`;

const MilestoneText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
`;

const ImageWrapper = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.15s;
`;

const Image = styled.div`
  width: 100%;
  padding-top: 75%;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : '#F5F5F5'};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid rgba(0,0,0,0.1);
  }
`;

function LoveStory({ title = 'Unser', titleAccent = 'Weg', milestones = [] }) {
  const [visible, setVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);

  const defaultMilestones = [
    { year: '2018', title: 'Das erste Treffen', text: 'Bei einem gemeinsamen Freund haben wir uns zum ersten Mal getroffen. Es hat sofort gefunkt.', image: null },
    { year: '2019', title: 'Der erste Urlaub', text: 'Unsere erste gemeinsame Reise führte uns nach Italien. Unvergessliche Momente am Meer.', image: null },
    { year: '2021', title: 'Zusammenziehen', text: 'Wir haben uns entschieden, den nächsten Schritt zu wagen und zusammenzuziehen.', image: null },
    { year: '2024', title: 'Der Antrag', text: 'An einem romantischen Abend in Paris hat Max die Frage aller Fragen gestellt.', image: null },
  ];

  const items = milestones.length > 0 ? milestones : defaultMilestones;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => [...new Set([...prev, i])]);
            setProgress(((i + 1) / items.length) * 100);
          }
        },
        { threshold: 0.3 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [items.length]);

  return (
    <Section ref={sectionRef} id="story">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Unsere Geschichte</Eyebrow>
          <Title $visible={visible}>{title} <span>{titleAccent}</span></Title>
        </Header>
        
        <TimelineWrapper>
          <TimelineLine $progress={progress} />
          
          {items.map((item, i) => (
            <Milestone key={i} ref={el => itemRefs.current[i] = el}>
              <Marker $active={visibleItems.includes(i)} />
              
              <ContentBox className="content" $visible={visibleItems.includes(i)}>
                <Year>{item.year}</Year>
                <MilestoneTitle>{item.title}</MilestoneTitle>
                <MilestoneText>{item.text}</MilestoneText>
              </ContentBox>
              
              <ImageWrapper className="image-wrapper" $visible={visibleItems.includes(i)}>
                <Image $image={item.image} />
              </ImageWrapper>
            </Milestone>
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  );
}

export default LoveStory;
