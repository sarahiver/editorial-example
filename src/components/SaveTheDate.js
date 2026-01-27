import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../context/WeddingContext';
import Countdown from './Countdown';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineExtend = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
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

const Page = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BackgroundGrid = styled.div`
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
  opacity: 0;
  animation: ${gridReveal} 2s ease forwards;
  animation-delay: 0.3s;
`;

const BackgroundCircle = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 70vw;
  height: 70vw;
  max-width: 900px;
  max-height: 900px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 50%;
  pointer-events: none;
  animation: ${circleGrow} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.8s;
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
  margin: 0 auto 2rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.2s;
`;

const CountdownWrapper = styled.div`
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1.4s;
  margin-top: 1rem;
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
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
    color: #999;
    writing-mode: vertical-rl;
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

const GallerySection = styled.section`
  padding: 6rem 2rem;
  background: #FAFAFA;
  position: relative;
  z-index: 10;
`;

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GalleryTitle = styled.h2`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: #000;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GalleryImage = styled.div`
  aspect-ratio: 4/5;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : '#E5E5E5'};
  position: relative;
  cursor: pointer;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.3s ease;
  }
  
  &:hover::after {
    background: rgba(0,0,0,0.1);
  }
`;

const GalleryPlaceholder = styled.div`
  aspect-ratio: 4/5;
  background: #E5E5E5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
`;

function SaveTheDate() {
  const { coupleNames, weddingDate, content } = useWedding();
  const stdContent = content?.savethedate || {};
  const countdownContent = content?.countdown || {};
  const galleryContent = content?.gallery || {};
  
  const names = coupleNames?.split('&') || ['Name', 'Name'];
  const name1 = names[0]?.trim() || 'Name';
  const name2 = names[1]?.trim() || 'Name';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const displayDate = formatDate(weddingDate);
  const location = stdContent.location_teaser || '';
  const message = stdContent.message || 'Wir freuen uns, diesen besonderen Tag mit euch zu teilen. Bitte merkt euch den Termin vor — die offizielle Einladung folgt.';
  const showCountdown = stdContent.countdown_active !== false;
  const showGallery = stdContent.gallery_active !== false;
  const galleryImages = galleryContent.images || [];

  return (
    <Page>
      <BackgroundGrid />
      <BackgroundCircle />
      
      <HeroSection>
        <Content>
          <Eyebrow>Save the Date</Eyebrow>
          
          <Names>
            <span>{name1}</span>
            <span className="ampersand">&</span>
            <span>{name2}</span>
          </Names>
          
          <Divider />
          
          <DateDisplay>
            <DateMain><span>{displayDate}</span></DateMain>
            <Location>{location}</Location>
          </DateDisplay>
          
          <Message>
            {message}
          </Message>
          
          {showCountdown && (
            <CountdownWrapper>
              <Countdown 
                targetDate={countdownContent.target_date || weddingDate}
                title=""
                showSeconds={false}
              />
            </CountdownWrapper>
          )}
        </Content>
        
        {showGallery && (
          <ScrollHint>
            <span>Scroll</span>
            <ScrollLine />
          </ScrollHint>
        )}
      </HeroSection>
      
      {showGallery && (
        <GallerySection>
          <GalleryContainer>
            <GalleryHeader>
              <GalleryTitle>Unsere Momente</GalleryTitle>
            </GalleryHeader>
            
            <GalleryGrid>
              {galleryImages.length > 0 ? (
                galleryImages.slice(0, 6).map((img, i) => (
                  <GalleryImage key={i} $image={img.url} />
                ))
              ) : (
                // Show placeholders if no images
                Array.from({ length: 6 }).map((_, i) => (
                  <GalleryPlaceholder key={i}>
                    Foto {i + 1}
                  </GalleryPlaceholder>
                ))
              )}
            </GalleryGrid>
          </GalleryContainer>
        </GallerySection>
      )}
    </Page>
  );
}

export default SaveTheDate;
