import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const clipReveal = keyframes`
  from { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }
  to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
`;

const lineExtend = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const gridReveal = keyframes`
  from { 
    opacity: 0;
    background-size: 0px 0px;
  }
  to { 
    opacity: 1;
    background-size: 80px 80px;
  }
`;

const circleGrow = keyframes`
  from { 
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  to { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${p => p.$backgroundImage ? `url(${p.$backgroundImage}) center/cover` : '#FFFFFF'};
  
  ${p => p.$backgroundImage && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.85);
      z-index: 1;
    }
  `}
`;

const IncludedBadge = styled.div`
  position: absolute;
  top: 100px;
  right: 2rem;
  background: #000;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &::before {
    content: '✓';
    font-size: 0.7rem;
  }
`;

const BackgroundGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
  opacity: 0;
  animation: ${gridReveal} 2s ease forwards;
  animation-delay: 0.2s;
`;

const BackgroundCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 60vw;
  height: 60vw;
  max-width: 800px;
  max-height: 800px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 50%;
  pointer-events: none;
  animation: ${circleGrow} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.5s;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 900px;
  padding: 0 2rem;
`;

const Eyebrow = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.3s;
`;

const Names = styled.h1`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 400;
  color: #000;
  letter-spacing: -0.04em;
  line-height: 0.9;
  margin-bottom: 2rem;
  
  .line { display: block; overflow: hidden; }
  
  .word {
    display: inline-block;
    opacity: 0;
    animation: ${clipReveal} 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
    &:nth-child(1) { animation-delay: 0.5s; }
    &:nth-child(2) { animation-delay: 0.7s; }
    &:nth-child(3) { animation-delay: 0.9s; }
  }
  
  .italic { font-style: italic; }
  .ampersand { font-size: 0.6em; color: #999; margin: 0 0.2em; }
`;

const Divider = styled.div`
  width: 100px;
  height: 1px;
  background: #000;
  margin: 0 auto 2rem;
  transform: scaleX(0);
  transform-origin: center;
  animation: ${lineExtend} 0.8s ease forwards;
  animation-delay: 1s;
`;

const DateText = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: #1A1A1A;
  letter-spacing: 0.05em;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.2s;
  span { font-style: italic; }
`;

const Location = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 1rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.4s;
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.8s;
  
  @media (max-width: 768px) { display: none; }
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #999;
    text-align: center;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 50px;
  background: rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: #000;
    animation: ${float} 1.5s ease-in-out infinite;
  }
`;

function Hero({
  name1 = 'Pauli',
  name2 = 'Mo',
  date = '15. August 2025',
  location = 'Schloss Heidelberg',
  eyebrow = 'Wir heiraten',
  backgroundImage = null,
  showBadge = false,
}) {
  return (
    <Section id="top" $backgroundImage={backgroundImage}>
      {showBadge && <IncludedBadge>Inklusive</IncludedBadge>}
      <BackgroundGrid />
      <BackgroundCircle />
      
      <Content>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Names>
          <span className="line">
            <span className="word">{name1}</span>
            <span className="word ampersand">&</span>
            <span className="word italic">{name2}</span>
          </span>
        </Names>
        <Divider />
        <DateText><span>{date}</span></DateText>
        <Location>{location}</Location>
      </Content>
      
      <ScrollHint>
        <span>Scroll</span>
        <ScrollLine />
      </ScrollHint>
    </Section>
  );
}

export default Hero;
