import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../context/WeddingContext';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import { submitPhotoUpload } from '../lib/supabase';

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
  max-width: 500px;
  margin: 0 auto;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const UploadArea = styled.div`
  border: 2px dashed #E0E0E0;
  background: #FAFAFA;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  
  &:hover {
    border-color: #000;
    background: #F5F5F5;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const UploadText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const UploadButton = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFF;
  background: #000;
  border: none;
  padding: 1rem 2rem;
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

const UploadedPhotos = styled.div`
  margin-top: 3rem;
`;

const PhotosHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PhotosTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
`;

const PhotoCount = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #666;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const PhotoItem = styled.div`
  aspect-ratio: 1;
  background: ${p => p.$url ? `url(${p.$url}) center/cover` : '#E5E5E5'};
  border-radius: 4px;
  position: relative;
  animation: ${fadeIn} 0.3s ease;
  
  &:hover .remove-btn {
    opacity: 1;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.7);
  color: #FFF;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  &:hover {
    background: #C62828;
  }
`;

const NameInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  border: 1px solid #E0E0E0;
  background: #FFF;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: #F5F5F5;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
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
  margin-bottom: 1.5rem;
`;

const ResetButton = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #000;
  background: transparent;
  border: 1px solid #000;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #000;
    color: #FFF;
  }
`;

const ConfigNotice = styled.div`
  text-align: center;
  padding: 2rem;
  background: #FFF8E1;
  border: 1px solid #FFE082;
  margin-bottom: 2rem;
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }
  
  code {
    background: #FFF;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.85rem;
  }
`;

function PhotoUpload({ content = {} }) {
  const { projectId, project } = useWedding();
  
  // Content from Supabase
  const title = content.title || 'Eure Fotos';
  const description = content.description || 'Teilt eure schönsten Momente mit uns!';
  const maxFiles = content.max_files || 10;
  
  // Cloudinary config from project settings (or env)
  const cloudName = project?.settings?.cloudinary_cloud_name || process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = project?.settings?.cloudinary_upload_preset || process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
  const folder = `iverlasting/${project?.slug || 'uploads'}/photos`;
  
  const [visible, setVisible] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploaderName, setUploaderName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const sectionRef = useRef(null);
  
  const isConfigured = cloudName && uploadPreset;

  // Cloudinary Upload Hook
  const { openWidget, isReady } = useCloudinaryUpload({
    cloudName,
    uploadPreset,
    folder,
    maxFiles,
    sources: ['local', 'camera'],
    multiple: true,
    onSuccess: (result) => {
      setUploadedPhotos(prev => [...prev, {
        url: result.url,
        publicId: result.publicId,
        thumbnailUrl: result.thumbnailUrl || result.url,
      }]);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      alert('Fehler beim Hochladen. Bitte versuche es erneut.');
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleOpenWidget = () => {
    if (!isConfigured) {
      alert('Cloudinary ist noch nicht konfiguriert.');
      return;
    }
    if (isReady) {
      openWidget();
    } else {
      alert('Upload-Widget wird geladen...');
    }
  };

  const removePhoto = (index) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedPhotos.length === 0) {
      alert('Bitte lade mindestens ein Foto hoch.');
      return;
    }
    
    setSaving(true);
    
    try {
      // Save each photo to Supabase
      for (const photo of uploadedPhotos) {
        await submitPhotoUpload(projectId, {
          uploadedBy: uploaderName || 'Anonym',
          cloudinaryUrl: photo.url,
          cloudinaryPublicId: photo.publicId,
        });
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error saving photos:', error);
      alert('Fehler beim Speichern. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setUploadedPhotos([]);
    setUploaderName('');
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
              {uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'Foto wurde' : 'Fotos wurden'} hochgeladen.
              {content.moderation !== false && ' Nach Freigabe erscheinen sie in der Galerie.'}
            </SuccessText>
            <ResetButton onClick={handleReset}>
              Weitere Fotos hochladen
            </ResetButton>
          </SuccessMessage>
        </Container>
      </Section>
    );
  }

  return (
    <Section ref={sectionRef} id="photos">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Fotogalerie</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>{description}</Subtitle>
        </Header>
        
        {!isConfigured && (
          <ConfigNotice>
            <p>
              ⚠️ Cloudinary ist noch nicht konfiguriert.<br />
              Setze <code>REACT_APP_CLOUDINARY_CLOUD_NAME</code> und <code>REACT_APP_CLOUDINARY_UPLOAD_PRESET</code> in den Umgebungsvariablen.
            </p>
          </ConfigNotice>
        )}
        
        <UploadArea onClick={handleOpenWidget}>
          <UploadIcon>📷</UploadIcon>
          <UploadText>
            Klicke hier oder ziehe Fotos hierher
          </UploadText>
          <UploadButton type="button" disabled={!isConfigured}>
            Fotos auswählen
          </UploadButton>
        </UploadArea>
        
        {uploadedPhotos.length > 0 && (
          <UploadedPhotos>
            <PhotosHeader>
              <PhotosTitle>Ausgewählte Fotos</PhotosTitle>
              <PhotoCount>{uploadedPhotos.length} / {maxFiles}</PhotoCount>
            </PhotosHeader>
            
            <PhotosGrid>
              {uploadedPhotos.map((photo, index) => (
                <PhotoItem key={photo.publicId || index} $url={photo.thumbnailUrl || photo.url}>
                  <RemoveButton 
                    className="remove-btn" 
                    onClick={() => removePhoto(index)}
                  >
                    ×
                  </RemoveButton>
                </PhotoItem>
              ))}
            </PhotosGrid>
            
            <div style={{ marginTop: '2rem' }}>
              <NameInput
                type="text"
                placeholder="Euer Name (optional)"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
              />
              
              <UploadButton 
                onClick={handleSubmit} 
                disabled={saving || uploadedPhotos.length === 0}
                style={{ width: '100%' }}
              >
                {saving ? 'Wird gespeichert...' : `${uploadedPhotos.length} ${uploadedPhotos.length === 1 ? 'Foto' : 'Fotos'} absenden`}
              </UploadButton>
            </div>
          </UploadedPhotos>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
