import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';
import { submitMusicWish, getMusicWishes } from '../lib/supabase';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #000;
  color: #FFF;
`;

const Container = styled.div`
  max-width: 800px;
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
  color: #FFF;
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span { font-style: italic; }
`;

const Subtitle = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: 1.15rem;
  font-style: italic;
  color: #999;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.7;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const Form = styled.form`
  background: #1A1A1A;
  padding: 2.5rem;
  border: 1px solid #333;
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.3s;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #FFF;
  background: #000;
  border: 1px solid #333;
  transition: all 0.3s ease;
  
  &:focus { outline: none; border-color: #FFF; }
  &::placeholder { color: #666; }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #000;
  background: #FFF;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover { background: #E0E0E0; }
`;

const WishList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WishItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #1A1A1A;
  border: 1px solid #333;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.4 + p.$index * 0.1}s;
`;

const WishIcon = styled.div`
  font-size: 1.5rem;
`;

const WishContent = styled.div`
  flex: 1;
`;

const WishSong = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 1.1rem;
  color: #FFF;
  margin-bottom: 0.25rem;
`;

const WishArtist = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
`;

const WishBy = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #666;
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #333;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: 'Instrument Serif', serif;
  font-size: 2.5rem;
  color: #FFF;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666;
`;

function MusicWishes({ content = {} }) {
  const { projectId } = useWedding();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', song: '', artist: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  const title = content.title || 'Musik';
  const titleAccent = 'wünsche';
  const subtitle = content.description || 'Welcher Song bringt euch garantiert auf die Tanzfläche? Verratet es uns!';

  // Load wishes from Supabase
  useEffect(() => {
    async function loadWishes() {
      if (!projectId) return;
      const { data } = await getMusicWishes(projectId);
      if (data) {
        const formattedWishes = data.map(wish => ({
          song: wish.song_title,
          artist: wish.artist,
          by: wish.name,
        }));
        setWishes(formattedWishes);
      }
    }
    loadWishes();
  }, [projectId, submitted]);

  const items = wishes;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await submitMusicWish(projectId, {
        name: formData.name,
        artist: formData.artist,
        songTitle: formData.song,
      });

      if (submitError) {
        throw new Error(submitError.message);
      }

      setFormData({ name: '', song: '', artist: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Music wish submission error:', err);
      setError('Es gab einen Fehler. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section ref={sectionRef} id="music">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Party Playlist</Eyebrow>
          <Title $visible={visible}>{title}<span>{titleAccent}</span></Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <Form $visible={visible} onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Songtitel *</Label>
              <Input type="text" value={formData.song} onChange={e => setFormData({...formData, song: e.target.value})} placeholder="z.B. Dancing Queen" required />
            </FormGroup>
            <FormGroup>
              <Label>Interpret *</Label>
              <Input type="text" value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} placeholder="z.B. ABBA" required />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label>Euer Name *</Label>
            <Input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vor- und Nachname" required />
          </FormGroup>
          {error && (
            <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Wird gesendet...' : submitted ? '✓ Hinzugefügt!' : 'Song hinzufügen'}
          </SubmitButton>
        </Form>
        
        <WishList>
          {items.map((wish, i) => (
            <WishItem key={i} $index={i} $visible={visible}>
              <WishIcon>🎵</WishIcon>
              <WishContent>
                <WishSong>{wish.song}</WishSong>
                <WishArtist>{wish.artist}</WishArtist>
              </WishContent>
              <WishBy>von {wish.by}</WishBy>
            </WishItem>
          ))}
        </WishList>
        
        <Stats $visible={visible}>
          <Stat>
            <StatNumber>{items.length}</StatNumber>
            <StatLabel>Songs</StatLabel>
          </Stat>
        </Stats>
      </Container>
    </Section>
  );
}

export default MusicWishes;
