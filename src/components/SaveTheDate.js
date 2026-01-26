import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineExtend = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
`;

const BackgroundCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  height: 70vw;
  max-width: 900px;
  max-height: 900px;
  border: 1px solid rgba(0,0,0,0.04);
  border-radius: 50%;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 700px;
  padding: 3rem 2rem;
`;

const Eyebrow = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 2.5rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.2s;
`;

const Names = styled.h1`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 400;
  color: #000;
  letter-spacing: -0.03em;
  line-height: 0.95;
  margin-bottom: 2.5rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.4s;
  
  span {
    display: block;
  }
  
  .ampersand {
    font-style: italic;
    font-size: 0.5em;
    color: #666;
    display: inline-block;
    margin: 0.5rem 0;
  }
`;

const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: #000;
  margin: 0 auto 2.5rem;
  transform: scaleX(0);
  transform-origin: center;
  animation: ${lineExtend} 0.8s ease forwards;
  animation-delay: 0.8s;
`;

const DateDisplay = styled.div`
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1s;
`;

const DateMain = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: #000;
  letter-spacing: 0.02em;
  margin-bottom: 0.5rem;
  
  span {
    font-style: italic;
  }
`;

const Location = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #666;
  letter-spacing: 0.15em;
  text-transform: uppercase;
`;

const Message = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: #666;
  max-width: 450px;
  margin: 0 auto 3rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.2s;
`;

const CTAButton = styled.a`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  padding: 1.25rem 3rem;
  text-decoration: none;
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.4s;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  width: 200px;
  height: 280px;
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: 'Photo';
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #CCC;
  }
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ImageLeft = styled(ImagePlaceholder)`
  top: 15%;
  left: 5%;
  transform: rotate(-5deg);
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.6s;
`;

const ImageRight = styled(ImagePlaceholder)`
  bottom: 15%;
  right: 5%;
  transform: rotate(5deg);
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.8s;
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 2s;
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #BBB;
  }
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 40px;
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

function SaveTheDate({ config = {} }) {
  const {
    name1 = "Pauli",
    name2 = "Mo",
    weddingDateDisplay = "August 15, 2026",
    location = "Villa Aurora",
  } = config;

  return (
    <Page>
      <BackgroundGrid />
      <BackgroundCircle />
      <ImageLeft />
      <ImageRight />
      
      <Content>
        <Eyebrow>Save the Date</Eyebrow>
        
        <Names>
          <span>{name1}</span>
          <span className="ampersand">&</span>
          <span>{name2}</span>
        </Names>
        
        <Divider />
        
        <DateDisplay>
          <DateMain><span>{weddingDateDisplay}</span></DateMain>
          <Location>{location}</Location>
        </DateDisplay>
        
        <Message>
          We're thrilled to share our special day with you. 
          Please mark your calendar — formal invitation to follow.
        </Message>
        
        <CTAButton href="/">View Website</CTAButton>
      </Content>
      
      <ScrollHint>
        <span>Scroll</span>
        <ScrollLine />
      </ScrollHint>
    </Page>
  );
}

export default SaveTheDate;
