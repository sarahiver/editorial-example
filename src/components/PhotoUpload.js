// Editorial Theme - Photo Upload (Fotoupload)
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFF;
  position: relative;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
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
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
  
  span { font-style: italic; }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
`;

const UploadArea = styled.div`
  margin-top: 2rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const DropZone = styled.div`
  padding: 4rem 2rem;
  background: ${p => p.isDragging ? '#F5F5F5' : '#FAFAFA'};
  border: 2px dashed ${p => p.isDragging ? '#000' : '#E0E0E0'};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #000;
    background: #F5F5F5;
  }
`;

const DropIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const DropText = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: 1.3rem;
  color: #000;
  margin-bottom: 0.5rem;
`;

const DropSubtext = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #F5F5F5;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: #000;
  color: #FFF;
  border: none;
  border-radius: 50%;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${PreviewItem}:hover & {
    opacity: 1;
  }
`;

const UploadProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #E0E0E0;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${p => p.progress}%;
    background: #000;
    transition: width 0.3s ease;
  }
`;

const SubmitSection = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GuestName = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  
  &:focus {
    outline: none;
    border-color: #000;
    background: #FFF;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SubmitBtn = styled.button`
  padding: 1.2rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #333;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #CCC;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  h3 {
    font-family: 'Instrument Serif', serif;
    font-size: 1.5rem;
    color: #000;
    margin-bottom: 0.75rem;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #666;
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  padding: 2rem;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  opacity: ${p => p.visible ? 1 : 0};
  transition: all 0.8s ease;
  transition-delay: 0.3s;
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-family: 'Instrument Serif', serif;
    font-size: 2.5rem;
    color: #000;
    line-height: 1;
  }
  
  .label {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: #666;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 0.5rem;
  }
`;

function PhotoUpload({
  title = 'Eure',
  titleAccent = 'Schnappschüsse',
  subtitle = 'Teilt eure Fotos mit uns! Ladet hier eure schönsten Momente der Hochzeit hoch.',
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/heic'],
  showStats = true,
  totalPhotos = 127,
  totalGuests = 34,
  onUpload = (files, guestName) => console.log('Upload:', files, guestName),
}) {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => acceptedTypes.includes(file.type)
    );
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const combined = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(combined.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    })));
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !guestName.trim()) return;
    
    setUploading(true);
    
    // Simulate upload with progress
    for (let i = 0; i < files.length; i++) {
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], progress };
          return updated;
        });
      }
    }
    
    onUpload(files.map(f => f.file), guestName);
    setUploading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Section ref={sectionRef} id="photos">
        <Container>
          <SuccessMessage>
            <div className="icon">📸</div>
            <h3>Vielen Dank, {guestName}!</h3>
            <p>{files.length} Foto{files.length !== 1 ? 's' : ''} erfolgreich hochgeladen.</p>
          </SuccessMessage>
        </Container>
      </Section>
    );
  }

  return (
    <Section ref={sectionRef} id="photos">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Fotoupload</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>
        
        <UploadArea visible={visible}>
          <DropZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <DropIcon>📷</DropIcon>
            <DropText>Fotos hierher ziehen</DropText>
            <DropSubtext>oder klicken zum Auswählen (max. {maxFiles} Fotos)</DropSubtext>
          </DropZone>
          
          <HiddenInput
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
          />
          
          {files.length > 0 && (
            <>
              <PreviewGrid>
                {files.map((item, i) => (
                  <PreviewItem key={i}>
                    <img src={item.preview} alt={`Preview ${i + 1}`} />
                    <RemoveBtn onClick={() => removeFile(i)}>✕</RemoveBtn>
                    {uploading && <UploadProgress progress={item.progress} />}
                  </PreviewItem>
                ))}
              </PreviewGrid>
              
              <SubmitSection>
                <GuestName
                  type="text"
                  placeholder="Euer Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
                <SubmitBtn
                  onClick={handleSubmit}
                  disabled={uploading || !guestName.trim()}
                >
                  {uploading ? 'Wird hochgeladen...' : `${files.length} Foto${files.length !== 1 ? 's' : ''} hochladen`}
                </SubmitBtn>
              </SubmitSection>
            </>
          )}
        </UploadArea>
        
        {showStats && (
          <Stats visible={visible}>
            <StatItem>
              <div className="number">{totalPhotos}</div>
              <div className="label">Fotos</div>
            </StatItem>
            <StatItem>
              <div className="number">{totalGuests}</div>
              <div className="label">Gäste</div>
            </StatItem>
          </Stats>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
