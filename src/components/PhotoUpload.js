import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../context/WeddingContext';
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

const DropZone = styled.div`
  border: 2px dashed ${p => p.$isDragging ? '#000' : p.$hasFiles ? '#2E7D32' : '#E0E0E0'};
  background: ${p => p.$isDragging ? '#F5F5F5' : '#FAFAFA'};
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border-color: #000;
    background: #F5F5F5;
  }
`;

const DropZoneIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  
  ${DropZone}:hover & {
    transform: scale(1.1);
  }
`;

const DropZoneText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const DropZoneSubtext = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
`;

const HiddenInput = styled.input`
  display: none;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
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
  border-radius: 4px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
  background: #F0F0F0;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${PreviewItem}:hover & {
    opacity: 1;
  }
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FFF;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #FF5252;
    color: #FFF;
  }
`;

const UploadProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #E0E0E0;
`;

const UploadProgressBar = styled.div`
  height: 100%;
  background: #2E7D32;
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
`;

const UploadStatus = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${p => p.$status === 'done' ? '#2E7D32' : p.$status === 'error' ? '#C62828' : '#FFF'};
  color: ${p => p.$status === 'done' || p.$status === 'error' ? '#FFF' : '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const FormSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #E0E0E0;
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
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
  
  &:hover:not(:disabled) {
    background: #333;
  }
  
  &:disabled {
    background: #CCC;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: #F5F5F5;
  animation: ${fadeIn} 0.5s ease;
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
`;

// ============================================
// CLOUDINARY DIRECT UPLOAD FUNCTION
// ============================================
async function uploadToCloudinary(file, cloudName, uploadPreset, folder, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress?.(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          width: response.width,
          height: response.height,
        });
      } else {
        reject(new Error('Upload fehlgeschlagen'));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Netzwerkfehler'));
    });
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(formData);
  });
}

// ============================================
// PHOTO UPLOAD COMPONENT
// ============================================
function PhotoUpload({ content = {} }) {
  const { projectId, project } = useWedding();
  
  // Content from Supabase
  const title = content.title || 'Eure Fotos';
  const description = content.description || 'Teilt eure schönsten Momente mit uns!';
  const maxFiles = content.max_files || 10;
  
  // Cloudinary config
  const cloudName = project?.settings?.cloudinary_cloud_name || process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = project?.settings?.cloudinary_upload_preset || process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
  const folder = `iverlasting/${project?.slug || 'uploads'}/guest-photos`;
  
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]); // { id, file, preview, progress, status, cloudinaryUrl, publicId }
  const [uploaderName, setUploaderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const sectionRef = useRef(null);
  const inputRef = useRef(null);
  const fileIdCounter = useRef(0);
  
  const isConfigured = cloudName && uploadPreset;

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle file selection
  const handleFiles = useCallback(async (selectedFiles) => {
    if (!isConfigured) return;
    
    const validFiles = Array.from(selectedFiles)
      .filter(file => file.type.startsWith('image/'))
      .slice(0, maxFiles - files.length);
    
    if (validFiles.length === 0) return;
    
    // Create file entries with previews
    const newFiles = validFiles.map(file => {
      const id = ++fileIdCounter.current;
      return {
        id,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'pending', // pending, uploading, done, error
        cloudinaryUrl: null,
        publicId: null,
      };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Start uploading each file
    for (const fileEntry of newFiles) {
      try {
        setFiles(prev => prev.map(f => 
          f.id === fileEntry.id ? { ...f, status: 'uploading' } : f
        ));
        
        const result = await uploadToCloudinary(
          fileEntry.file,
          cloudName,
          uploadPreset,
          folder,
          (progress) => {
            setFiles(prev => prev.map(f => 
              f.id === fileEntry.id ? { ...f, progress } : f
            ));
          }
        );
        
        setFiles(prev => prev.map(f => 
          f.id === fileEntry.id ? { 
            ...f, 
            status: 'done', 
            progress: 100,
            cloudinaryUrl: result.url,
            publicId: result.publicId,
          } : f
        ));
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileEntry.id ? { ...f, status: 'error' } : f
        ));
      }
    }
  }, [cloudName, uploadPreset, folder, files.length, maxFiles, isConfigured]);

  // Drag & Drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleInputChange = useCallback((e) => {
    handleFiles(e.target.files);
    e.target.value = ''; // Reset input
  }, [handleFiles]);

  const handleRemove = useCallback((id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const handleSubmit = async () => {
    const completedFiles = files.filter(f => f.status === 'done');
    if (completedFiles.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      for (const file of completedFiles) {
        await submitPhotoUpload(projectId, {
          uploadedBy: uploaderName || 'Anonym',
          cloudinaryUrl: file.cloudinaryUrl,
          cloudinaryPublicId: file.publicId,
        });
      }
      setSubmitted(true);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Fehler beim Speichern. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
    setUploaderName('');
    setSubmitted(false);
  };

  const completedCount = files.filter(f => f.status === 'done').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;
  const canSubmit = completedCount > 0 && uploadingCount === 0;

  if (submitted) {
    return (
      <Section ref={sectionRef} id="photos">
        <Container>
          <SuccessMessage>
            <SuccessIcon>📸</SuccessIcon>
            <SuccessTitle>Vielen Dank!</SuccessTitle>
            <SuccessText>
              {completedCount} {completedCount === 1 ? 'Foto wurde' : 'Fotos wurden'} hochgeladen.
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
            <p>⚠️ Foto-Upload ist noch nicht konfiguriert.</p>
          </ConfigNotice>
        )}
        
        <DropZone
          $isDragging={isDragging}
          $hasFiles={files.length > 0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <DropZoneIcon>
            {isDragging ? '📥' : files.length > 0 ? '✅' : '📷'}
          </DropZoneIcon>
          <DropZoneText>
            {isDragging 
              ? 'Fotos hier ablegen...' 
              : files.length > 0 
                ? `${files.length} ${files.length === 1 ? 'Foto' : 'Fotos'} ausgewählt`
                : 'Fotos hierher ziehen oder klicken'
            }
          </DropZoneText>
          <DropZoneSubtext>
            JPG, PNG, HEIC · Max. {maxFiles} Fotos
          </DropZoneSubtext>
          
          <HiddenInput
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            disabled={!isConfigured}
          />
        </DropZone>
        
        {files.length > 0 && (
          <>
            <PreviewGrid>
              {files.map(file => (
                <PreviewItem key={file.id}>
                  <PreviewImage src={file.preview} alt="" />
                  
                  {file.status === 'uploading' && (
                    <UploadProgress>
                      <UploadProgressBar $progress={file.progress} />
                    </UploadProgress>
                  )}
                  
                  <UploadStatus $status={file.status}>
                    {file.status === 'done' && '✓'}
                    {file.status === 'error' && '!'}
                    {file.status === 'uploading' && '↑'}
                  </UploadStatus>
                  
                  <PreviewOverlay>
                    <RemoveButton onClick={() => handleRemove(file.id)}>
                      ×
                    </RemoveButton>
                  </PreviewOverlay>
                </PreviewItem>
              ))}
            </PreviewGrid>
            
            <FormSection>
              <NameInput
                type="text"
                placeholder="Euer Name (optional)"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
              />
              
              <SubmitButton
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting 
                  ? 'Wird gespeichert...' 
                  : uploadingCount > 0 
                    ? `${uploadingCount} ${uploadingCount === 1 ? 'Foto wird' : 'Fotos werden'} hochgeladen...`
                    : `${completedCount} ${completedCount === 1 ? 'Foto' : 'Fotos'} absenden`
                }
              </SubmitButton>
            </FormSection>
          </>
        )}
      </Container>
    </Section>
  );
}

export default PhotoUpload;
