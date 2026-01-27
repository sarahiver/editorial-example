import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFFFFF;
`;

const Container = styled.div`
  max-width: 1400px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => p.$index * 0.1}s;
  
  &:nth-child(3n+1) { grid-row: span 2; }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.3s ease;
  }
  
  &:hover::after { background: rgba(0,0,0,0.2); }
`;

const Image = styled.div`
  width: 100%;
  padding-top: ${p => p.$tall ? '150%' : '100%'};
  background: ${p => p.$src ? `url(${p.$src}) center/cover` : '#F0F0F0'};
  transition: transform 0.6s ease;
  
  ${ImageWrapper}:hover & { transform: scale(1.05); }
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  color: #FFF;
  cursor: pointer;
  font-size: 2rem;
  &:hover { color: #999; }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  color: #FFF;
  cursor: pointer;
  font-size: 2rem;
  &:hover { color: #999; }
`;

const Placeholder = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: #FAFAFA;
  border: 1px dashed #E0E0E0;
`;

const PlaceholderText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #999;
`;

function Gallery({ content = {} }) {
  const title = content.title || 'Galerie';
  const images = content.images || [];
  
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

  const defaultImages = Array(6).fill(null).map((_, i) => ({ url: null, alt: `Bild ${i + 1}` }));
  const galleryImages = images.length > 0 ? images : defaultImages;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigate = useCallback((direction) => {
    if (direction === 'prev') {
      setCurrentIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1);
    } else {
      setCurrentIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1);
    }
  }, [galleryImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, navigate]);

  const hasImages = galleryImages.some(img => img.url);

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Galerie</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        {hasImages ? (
          <Grid>
            {galleryImages.map((img, i) => (
              <ImageWrapper key={i} $index={i} $visible={visible} onClick={() => img.url && openLightbox(i)}>
                <Image $src={img.url} $tall={i % 3 === 0} />
              </ImageWrapper>
            ))}
          </Grid>
        ) : (
          <Placeholder>
            <PlaceholderText>Hier werden bald unsere gemeinsamen Fotos erscheinen.</PlaceholderText>
          </Placeholder>
        )}
        
        <Lightbox $open={lightboxOpen} onClick={closeLightbox}>
          <LightboxClose onClick={closeLightbox}>×</LightboxClose>
          <LightboxNav $direction="prev" onClick={(e) => { e.stopPropagation(); navigate('prev'); }}>‹</LightboxNav>
          {galleryImages[currentIndex]?.url && (
            <LightboxImage src={galleryImages[currentIndex].url} alt={galleryImages[currentIndex].alt || `Bild ${currentIndex + 1}`} onClick={(e) => e.stopPropagation()} />
          )}
          <LightboxNav $direction="next" onClick={(e) => { e.stopPropagation(); navigate('next'); }}>›</LightboxNav>
        </Lightbox>
      </Container>
    </Section>
  );
}

export default Gallery;
