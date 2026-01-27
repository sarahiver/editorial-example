// src/hooks/useCloudinaryUpload.js
import { useCallback, useRef, useEffect } from 'react';

/**
 * Cloudinary Upload Hook
 * 
 * Usage:
 * const { openWidget, isReady } = useCloudinaryUpload({
 *   cloudName: 'your-cloud-name',
 *   uploadPreset: 'your-unsigned-preset',
 *   folder: 'wedding-photos/project-slug',
 *   onSuccess: (result) => console.log(result),
 *   onError: (error) => console.error(error),
 * });
 */
export function useCloudinaryUpload({
  cloudName,
  uploadPreset,
  folder = '',
  maxFiles = 10,
  sources = ['local', 'camera'],
  resourceType = 'image',
  cropping = false,
  multiple = true,
  onSuccess,
  onError,
  onClose,
}) {
  const widgetRef = useRef(null);
  
  // Store callbacks in refs to avoid recreating widget
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onCloseRef = useRef(onClose);
  
  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onCloseRef.current = onClose;
  }, [onSuccess, onError, onClose]);

  const isReady = typeof window !== 'undefined' && window.cloudinary;

  const createWidget = useCallback(() => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget not loaded');
      return null;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        folder,
        sources,
        multiple,
        maxFiles,
        resourceType,
        cropping,
        showSkipCropButton: true,
        showPoweredBy: false,
        theme: 'minimal',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#E0E0E0',
            tabIcon: '#000000',
            menuIcons: '#000000',
            textDark: '#000000',
            textLight: '#666666',
            link: '#000000',
            action: '#000000',
            inactiveTabIcon: '#999999',
            error: '#C62828',
            inProgress: '#000000',
            complete: '#000000',
            sourceBg: '#FAFAFA',
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
              active: true,
            },
          },
        },
        text: {
          de: {
            or: 'oder',
            menu: {
              files: 'Dateien',
              camera: 'Kamera',
            },
            local: {
              browse: 'Dateien auswählen',
              dd_title_single: 'Ziehe ein Bild hierher',
              dd_title_multi: 'Ziehe Bilder hierher',
              drop_title_single: 'Bild hier ablegen',
              drop_title_multi: 'Bilder hier ablegen',
            },
            camera: {
              capture: 'Aufnehmen',
              cancel: 'Abbrechen',
              take_pic: 'Foto aufnehmen',
              explanation: 'Kamerazugriff wird für Fotos benötigt.',
            },
            queue: {
              title: 'Upload-Warteschlange',
              title_uploading_with_counter: '{{num}} Dateien werden hochgeladen',
              title_processing_with_counter: '{{num}} Dateien werden verarbeitet',
              done: 'Fertig',
              mini_title: '{{num}} hochgeladen',
              mini_title_done: 'Upload abgeschlossen',
            },
            crop: {
              title: 'Zuschneiden',
              crop_btn: 'Zuschneiden',
              skip_btn: 'Überspringen',
            },
          },
        },
        language: 'de',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          onErrorRef.current?.(error);
          return;
        }

        if (result.event === 'success') {
          const uploadInfo = {
            publicId: result.info.public_id,
            url: result.info.secure_url,
            thumbnailUrl: result.info.thumbnail_url,
            width: result.info.width,
            height: result.info.height,
            format: result.info.format,
            bytes: result.info.bytes,
            originalFilename: result.info.original_filename,
          };
          onSuccessRef.current?.(uploadInfo);
        }

        if (result.event === 'close') {
          onCloseRef.current?.();
        }
      }
    );

    return widget;
  }, [cloudName, uploadPreset, folder, sources, multiple, maxFiles, resourceType, cropping]);

  const openWidget = useCallback(() => {
    // Always create a fresh widget to ensure correct maxFiles
    if (widgetRef.current) {
      widgetRef.current.destroy();
    }
    widgetRef.current = createWidget();
    
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.error('Failed to create Cloudinary widget');
      onErrorRef.current?.({ message: 'Widget konnte nicht geladen werden' });
    }
  }, [createWidget]);

  const destroyWidget = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.destroy();
      widgetRef.current = null;
    }
  }, []);

  return {
    openWidget,
    destroyWidget,
    isReady,
  };
}

export default useCloudinaryUpload;
