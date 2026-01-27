import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../context/WeddingContext';
import { getGuestbookEntries, getPhotoUploads } from '../lib/supabase';

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
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #FAFAFA;
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
  max-width: 700px;
  max-height: 700px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 50%;
  pointer-events: none;
  animation: ${circleGrow} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.5s;
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
  animation-delay: 1.5s;
  
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

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 3rem 2rem;
`;

const Eyebrow = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.2s;
`;

const Title = styled.h1`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 400;
  color: #000;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.4s;
  
  span {
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 0.6s;
`;

const Divider = styled.div`
  width: 60px;
  height: 1px;
  background: #000;
  margin: 2rem auto;
  transform: scaleX(0);
  transform-origin: center;
  animation: ${lineExtend} 0.8s ease forwards;
  animation-delay: 0.8s;
`;

const DateLocation = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: 1s;
`;

// Gallery Section
const GallerySection = styled.section`
  padding: 6rem 2rem;
  background: #FFFFFF;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Instrument Serif', serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
  
  span {
    font-style: italic;
  }
`;

const SectionSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GalleryItem = styled.div`
  aspect-ratio: 4/5;
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: 'Photo';
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #CCC;
  }
  
  &:hover {
    border-color: #000;
    transform: translateY(-4px);
  }
`;

// Photo Upload Section
const UploadSection = styled.section`
  padding: 6rem 2rem;
  background: #FAFAFA;
`;

const UploadArea = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 2rem;
  border: 2px dashed #E0E0E0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #FFF;
  
  &:hover {
    border-color: #000;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
`;

const UploadText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const UploadButton = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  border-bottom: 1px solid #000;
  padding-bottom: 0.25rem;
`;

// Guestbook Section
const GuestbookSection = styled.section`
  padding: 6rem 2rem;
  background: #FFFFFF;
`;

const GuestbookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const GuestbookCard = styled.div`
  padding: 2rem;
  border: 1px solid #E0E0E0;
  background: #FAFAFA;
`;

const GuestbookMessage = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #333;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const GuestbookAuthor = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
`;

// Footer
const ArchiveFooter = styled.footer`
  padding: 4rem 2rem;
  background: #000;
  text-align: center;
`;

const FooterLogo = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 2rem;
  color: #FFF;
  margin-bottom: 1rem;
  
  span {
    font-style: italic;
  }
`;

const FooterText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 2rem;
`;

const FooterHashtag = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
`;

function ArchivePage() {
  const { coupleNames, weddingDate, content, projectId } = useWedding();
  const archiveContent = content?.archive || {};
  
  const names = coupleNames?.split('&') || ['Name', 'Name'];
  const name1 = names[0]?.trim() || 'Name';
  const name2 = names[1]?.trim() || 'Name';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const displayDate = formatDate(weddingDate);
  const location = content?.hero?.location_short || '';
  const hashtag = content?.footer?.hashtag || '';
  const thankYouTitle = archiveContent.thank_you_title || 'Danke!';
  const thankYouText = archiveContent.thank_you_text || 'Danke, dass ihr Teil des schönsten Tages unseres Lebens wart.';

  const [guestMessages, setGuestMessages] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!projectId) return;
      const [guestbook, photoData] = await Promise.all([
        getGuestbookEntries(projectId, true),
        getPhotoUploads(projectId, true),
      ]);
      setGuestMessages(guestbook.data || []);
      setPhotos(photoData.data || []);
    }
    loadData();
  }, [projectId]);

  return (
    <Page>
      {/* Hero */}
      <HeroSection>
        <BackgroundGrid />
        <BackgroundCircle />
        <HeroContent>
          <Eyebrow>{thankYouTitle}</Eyebrow>
          <Title>
            {name1} <span>&</span> {name2}
          </Title>
          <Subtitle>
            {thankYouText}
          </Subtitle>
          <Divider />
          <DateLocation>{displayDate} · {location}</DateLocation>
        </HeroContent>
        
        <ScrollHint>
          <span>Scroll</span>
          <ScrollLine />
        </ScrollHint>
      </HeroSection>

      {/* Photo Gallery */}
      <GallerySection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Our <span>Memories</span></SectionTitle>
            <SectionSubtitle>A collection of moments from our celebration</SectionSubtitle>
          </SectionHeader>
          
          <GalleryGrid>
            {photos.length > 0 ? photos.slice(0, 8).map((photo, i) => (
              <GalleryItem key={photo.id} style={{ backgroundImage: `url(${photo.cloudinary_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            )) : [...Array(8)].map((_, i) => (
              <GalleryItem key={i} />
            ))}
          </GalleryGrid>
        </SectionContainer>
      </GallerySection>

      {/* Upload Photos */}
      <UploadSection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Share <span>Your Photos</span></SectionTitle>
            <SectionSubtitle>Add your favorite moments to our collection</SectionSubtitle>
          </SectionHeader>
          
          <UploadArea>
            <UploadIcon>📷</UploadIcon>
            <UploadText>Drag photos here or click to browse</UploadText>
            <UploadButton>Select Files</UploadButton>
          </UploadArea>
        </SectionContainer>
      </UploadSection>

      {/* Guestbook */}
      <GuestbookSection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Kind <span>Words</span></SectionTitle>
            <SectionSubtitle>Messages from our loved ones</SectionSubtitle>
          </SectionHeader>
          
          <GuestbookGrid>
            {guestMessages.map((entry) => (
              <GuestbookCard key={entry.id}>
                <GuestbookMessage>"{entry.message}"</GuestbookMessage>
                <GuestbookAuthor>— {entry.author}</GuestbookAuthor>
              </GuestbookCard>
            ))}
          </GuestbookGrid>
        </SectionContainer>
      </GuestbookSection>

      {/* Footer */}
      <ArchiveFooter>
        <FooterLogo>
          {name1} <span>&</span> {name2}
        </FooterLogo>
        <FooterText>Forever grateful for your love and support.</FooterText>
        <FooterHashtag>{hashtag}</FooterHashtag>
      </ArchiveFooter>
    </Page>
  );
}

export default ArchivePage;
