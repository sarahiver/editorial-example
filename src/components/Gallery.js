// Editorial Theme - Gallery
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFF;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
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
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #000;
  
  span { font-style: italic; }
`;

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #F5F5F5;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.1 + p.index * 0.1}s;
  
  &:nth-child(3n+1) { grid-row: span 2; }
  
  @media (max-width: 900px) {
    &:nth-child(3n+1) { grid-row: span 1; }
    &:nth-child(4n+1) { grid-row: span 2; }
  }
  
  @media (max-width: 600px) {
    &:nth-child(n) { grid-row: span 1; }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
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

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: #999;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: ${p => p.isOpen ? 1 : 0};
  visibility: ${p => p.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const LightboxImage = styled.div`
  max-width: 90vw;
  max-height: 85vh;
  position: relative;
  
  img {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
  }
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: #FFF;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FFF;
    color: #000;
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: #FFF;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  
  &:hover {
    background: #FFF;
    color: #000;
  }
  
  @media (max-width: 768px) {
    ${p => p.direction === 'prev' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  }
`;

const LightboxCounter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.1em;
`;

function Gallery({
  title = 'Unsere',
  titleAccent = 'Momente',
  images = [
    { src: null, alt: 'Foto 1' },
    { src: null, alt: 'Foto 2' },
    { src: null, alt: 'Foto 3' },
    { src: null, alt: 'Foto 4' },
    { src: null, alt: 'Foto 5' },
    { src: null, alt: 'Foto 6' },
  ],
}) {
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [lightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Galerie</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
        </Header>
        
        <MasonryGrid>
          {images.map((image, i) => (
            <GalleryItem 
              key={i} 
              index={i} 
              visible={visible}
              onClick={() => openLightbox(i)}
            >
              {image.src ? (
                <img src={image.src} alt={image.alt} />
              ) : (
                <PlaceholderImage>
                  <span>Foto {i + 1}</span>
                </PlaceholderImage>
              )}
            </GalleryItem>
          ))}
        </MasonryGrid>
      </Container>
      
      <Lightbox isOpen={lightboxOpen} onClick={() => setLightboxOpen(false)}>
        <LightboxClose onClick={() => setLightboxOpen(false)}>✕</LightboxClose>
        
        {currentIndex > 0 && (
          <LightboxNav direction="prev" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>
            ←
          </LightboxNav>
        )}
        
        <LightboxImage onClick={(e) => e.stopPropagation()}>
          {images[currentIndex]?.src ? (
            <img src={images[currentIndex].src} alt={images[currentIndex].alt} />
          ) : (
            <PlaceholderImage style={{ width: '60vw', height: '60vh' }}>
              <span>Foto {currentIndex + 1}</span>
            </PlaceholderImage>
          )}
        </LightboxImage>
        
        {currentIndex < images.length - 1 && (
          <LightboxNav direction="next" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}>
            →
          </LightboxNav>
        )}
        
        <LightboxCounter>{currentIndex + 1} / {images.length}</LightboxCounter>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
