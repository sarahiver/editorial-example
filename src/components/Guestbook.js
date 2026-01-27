import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../lib/supabase';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFFFFF;
`;

const Container = styled.div`
  max-width: 900px;
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

const Form = styled.form`
  background: #FAFAFA;
  padding: 2.5rem;
  border: 1px solid #E0E0E0;
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

const FormGroup = styled.div`
  margin-bottom: ${p => p.$full ? '1.5rem' : '0'};
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #000;
  background: #FFF;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
  
  &:focus { outline: none; border-color: #000; }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #000;
  background: #FFF;
  border: 1px solid #E0E0E0;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus { outline: none; border-color: #000; }
`;

const SubmitButton = styled.button`
  padding: 1rem 2.5rem;
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
  
  &:hover { background: #333; }
`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Entry = styled.div`
  background: #FAFAFA;
  padding: 2rem;
  border-left: 3px solid #000;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.4 + p.$index * 0.1}s;
`;

const EntryText = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: 1.1rem;
  font-style: italic;
  color: #333;
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const EntryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const EntryAuthor = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #000;
`;

const EntryDate = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #999;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: #FAFAFA;
  border: 1px dashed #E0E0E0;
`;

const EmptyText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #999;
`;

function Guestbook({ content = {} }) {
  const { projectId } = useWedding();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  const title = content.title || 'Gäste';
  const titleAccent = 'buch';
  const subtitle = content.description || 'Hinterlasst uns einen lieben Gruß oder Wunsch für unsere gemeinsame Zukunft.';

  // Load entries from Supabase
  useEffect(() => {
    async function loadEntries() {
      if (!projectId) return;
      const { data } = await getGuestbookEntries(projectId, true);
      if (data) {
        const formattedEntries = data.map(entry => ({
          name: entry.name,
          message: entry.message,
          date: new Date(entry.created_at).toLocaleDateString('de-DE', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
        }));
        setEntries(formattedEntries);
      }
    }
    loadEntries();
  }, [projectId, submitted]);

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
      const { error: submitError } = await submitGuestbookEntry(projectId, {
        name: formData.name,
        message: formData.message,
      });

      if (submitError) {
        throw new Error(submitError.message);
      }

      setFormData({ name: '', message: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Guestbook submission error:', err);
      setError('Es gab einen Fehler. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = entries;

  return (
    <Section ref={sectionRef} id="guestbook">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Eure Wünsche</Eyebrow>
          <Title $visible={visible}>{title}<span>{titleAccent}</span></Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <Form $visible={visible} onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Euer Name *</Label>
              <Input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vor- und Nachname" required />
            </FormGroup>
          </FormRow>
          <FormGroup $full>
            <Label>Eure Nachricht *</Label>
            <TextArea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Schreibt uns eure Glückwünsche..." required />
          </FormGroup>
          {error && (
            <div style={{ color: '#C62828', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Wird gesendet...' : submitted ? '✓ Gesendet!' : 'Eintragen'}
          </SubmitButton>
        </Form>
        
        {items.length > 0 ? (
          <EntriesList>
            {items.map((entry, i) => (
              <Entry key={i} $index={i} $visible={visible}>
                <EntryText>"{entry.message}"</EntryText>
                <EntryMeta>
                  <EntryAuthor>— {entry.name}</EntryAuthor>
                  <EntryDate>{entry.date}</EntryDate>
                </EntryMeta>
              </Entry>
            ))}
          </EntriesList>
        ) : (
          <EmptyState><EmptyText>Noch keine Einträge vorhanden. Seid die Ersten!</EmptyText></EmptyState>
        )}
      </Container>
    </Section>
  );
}

export default Guestbook;
