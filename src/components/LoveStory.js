// Editorial Theme - Love Story (Unser Weg)
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { height: 0; }
  to { height: 100%; }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFF;
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
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
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #000;
  
  span {
    font-style: italic;
  }
`;

const Timeline = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: ${p => p.visible ? '100%' : '0'};
    background: #E0E0E0;
    transform: translateX(-50%);
    transition: height 1.5s ease;
    transition-delay: 0.3s;
    
    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const Milestone = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.3 + p.index * 0.15}s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr;
    gap: 1.5rem;
  }
  
  ${p => p.index % 2 === 0 ? css`
    .content { text-align: right; order: 1; }
    .marker { order: 2; }
    .spacer { order: 3; }
    
    @media (max-width: 768px) {
      .content { text-align: left; order: 2; }
      .marker { order: 1; }
      .spacer { display: none; }
    }
  ` : css`
    .content { text-align: left; order: 3; }
    .marker { order: 2; }
    .spacer { order: 1; }
    
    @media (max-width: 768px) {
      .content { order: 2; }
      .marker { order: 1; }
      .spacer { display: none; }
    }
  `}
`;

const MilestoneMarker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const MarkerDot = styled.div`
  width: 12px;
  height: 12px;
  background: #FFF;
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
  z-index: 2;
`;

const MarkerYear = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #000;
  margin-top: 0.75rem;
  white-space: nowrap;
`;

const MilestoneContent = styled.div``;

const MilestoneTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.4rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.75rem;
`;

const MilestoneText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
`;

const MilestoneImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: #F5F5F5;
  margin-top: 1.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const Spacer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

function LoveStory({
  title = 'Unser',
  titleAccent = 'Weg',
  milestones = [
    {
      year: '2018',
      title: 'Das erste Treffen',
      text: 'Bei einem gemeinsamen Freund lernten wir uns kennen – und wussten sofort, dass etwas Besonderes beginnt.',
      image: null,
    },
    {
      year: '2019',
      title: 'Der erste Urlaub',
      text: 'Unsere erste gemeinsame Reise nach Italien. Zwischen Pasta und Sonnenuntergängen wuchs unsere Liebe.',
      image: null,
    },
    {
      year: '2021',
      title: 'Zusammengezogen',
      text: 'Endlich unter einem Dach! Unsere kleine Wohnung wurde zum Zuhause voller Lachen und Liebe.',
      image: null,
    },
    {
      year: '2024',
      title: 'Der Antrag',
      text: 'An einem verschneiten Winterabend stellte Max die wichtigste Frage – und Sarah sagte JA!',
      image: null,
    },
  ],
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
    <Section ref={sectionRef} id="story">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Unsere Geschichte</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
        </Header>
        
        <Timeline visible={visible}>
          {milestones.map((milestone, i) => (
            <Milestone key={i} index={i} visible={visible}>
              <MilestoneContent className="content">
                <MilestoneTitle>{milestone.title}</MilestoneTitle>
                <MilestoneText>{milestone.text}</MilestoneText>
                {milestone.image && (
                  <MilestoneImage>
                    <img src={milestone.image} alt={milestone.title} />
                  </MilestoneImage>
                )}
              </MilestoneContent>
              
              <MilestoneMarker className="marker">
                <MarkerDot />
                <MarkerYear>{milestone.year}</MarkerYear>
              </MilestoneMarker>
              
              <Spacer className="spacer" />
            </Milestone>
          ))}
        </Timeline>
      </Container>
    </Section>
  );
}

export default LoveStory;
