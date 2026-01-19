import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFFFFF;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
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
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span { font-style: italic; }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const DropZone = styled.div`
  border: 2px dashed ${p => p.$dragOver ? '#000' : '#E0E0E0'};
  background: ${p => p.$dragOver ? '#F5F5F5' : '#FAFAFA'};
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.3s ease, opacity 0.8s ease, transform 0.8s ease;
  transition-delay: 0.3s;
  
  &:hover {
    border-color: #000;
  }
`;

const DropIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const DropText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const DropSubtext = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
  margin: 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #F0F0F0;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: #FFF;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  
  &:hover {
    background: #000;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #E0E0E0;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #000;
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #CCC;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  margin: 0;
`;

const ResetButton = styled.button`
  margin-top: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666;
  background: none;
  border: 1px solid #E0E0E0;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #000;
    border-color: #000;
  }
`;

function PhotoUpload({
  title = 'Eure',
  titleAccent = 'Fotos',
  subtitle = 'Teilt eure schönsten Schnappschüsse von unserer Hochzeit mit uns!',
  maxFiles = 20,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  onUpload,
}) {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const sectionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
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
    const remaining = maxFiles - files.length;
    const toAdd = newFiles.slice(0, remaining);
    
    setFiles(prev => [...prev, ...toAdd]);
    
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, { file, preview: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    if (onUpload) {
      await onUpload(files);
    }
    
    setUploading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFiles([]);
    setPreviews([]);
    setUploadProgress(0);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Section ref={sectionRef} id="photos">
        <Container>
          <SuccessMessage>
            <SuccessIcon>📸</SuccessIcon>
            <SuccessTitle>Vielen Dank!</SuccessTitle>
            <SuccessText>
              Eure {files.length} {files.length === 1 ? 'Foto wurde' : 'Fotos wurden'} erfolgreich hochgeladen.
            </SuccessText>
            <ResetButton onClick={handleReset}>Weitere Fotos hochladen</ResetButton>
          </SuccessMessage>
        </Container>
      </Section>
    );
  }

  return (
    <Section ref={sectionRef} id="photos">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Foto Upload</Eyebrow>
          <Title $visible={visible}>{title} <span>{titleAccent}</span></Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <DropZone
          $visible={visible}
          $dragOver={dragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <DropIcon>📷</DropIcon>
          <DropText>Fotos hier ablegen oder klicken zum Auswählen</DropText>
          <DropSubtext>Maximal {maxFiles} Fotos · JPG, PNG oder WebP</DropSubtext>
          <HiddenInput
            ref={inputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            multiple
            onChange={handleFileSelect}
          />
        </DropZone>
        
        {previews.length > 0 && (
          <>
            <PreviewGrid>
              {previews.map((item, i) => (
                <PreviewItem key={i}>
                  <PreviewImage src={item.preview} alt={`Preview ${i + 1}`} />
                  {!uploading && (
                    <RemoveButton onClick={() => removeFile(i)}>×</RemoveButton>
                  )}
                </PreviewItem>
              ))}
            </PreviewGrid>
            
            {uploading && (
              <ProgressBar>
                <ProgressFill $progress={uploadProgress} />
              </ProgressBar>
            )}
            
            <SubmitButton 
              onClick={handleSubmit} 
              disabled={uploading || files.length === 0}
            >
              {uploading 
                ? `Wird hochgeladen... ${uploadProgress}%` 
                : `${files.length} ${files.length === 1 ? 'Foto' : 'Fotos'} hochladen`
              }
            </SubmitButton>
          </>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
