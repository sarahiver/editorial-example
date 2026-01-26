import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineExtend = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 80vh;
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
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
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

function ArchivePage({ config = {} }) {
  const {
    coupleName = "Pauli & Mo",
    name1 = "Pauli",
    name2 = "Mo",
    weddingDateDisplay = "August 15, 2026",
    location = "Villa Aurora",
    hashtag = "#PauliAndMo2026",
  } = config;

  const [guestMessages] = useState([
    { id: 1, message: "What an incredible celebration of love! We're so honored to have been part of your special day.", author: "Emma & Tom" },
    { id: 2, message: "The most beautiful wedding we've ever attended. Wishing you a lifetime of happiness!", author: "The Rivera Family" },
    { id: 3, message: "Thank you for letting us share in your joy. Here's to forever!", author: "Sophie Chen" },
  ]);

  return (
    <Page>
      {/* Hero */}
      <HeroSection>
        <BackgroundGrid />
        <HeroContent>
          <Eyebrow>Our Wedding Day</Eyebrow>
          <Title>
            {name1} <span>&</span> {name2}
          </Title>
          <Subtitle>
            Thank you for being part of the most magical day of our lives. 
            Relive the memories and share your favorite moments.
          </Subtitle>
          <Divider />
          <DateLocation>{weddingDateDisplay} · {location}</DateLocation>
        </HeroContent>
      </HeroSection>

      {/* Photo Gallery */}
      <GallerySection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Our <span>Memories</span></SectionTitle>
            <SectionSubtitle>A collection of moments from our celebration</SectionSubtitle>
          </SectionHeader>
          
          <GalleryGrid>
            {[...Array(8)].map((_, i) => (
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
