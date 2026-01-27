import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';
import { submitRSVP } from '../lib/supabase';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
  position: relative;
`;

const IncludedBadge = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: #000;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &::before {
    content: '✓';
    font-size: 0.7rem;
  }
`;

const Container = styled.div`
  max-width: 600px;
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

const Form = styled.form`
  background: #FFF;
  padding: 3rem;
  border: 1px solid #E0E0E0;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.3s;
  
  @media (max-width: 600px) { padding: 2rem 1.5rem; }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
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
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    background: #FFF;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    background: #FFF;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #333;
`;

const RadioInput = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  
  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: #000;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
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
  
  &:hover { background: #333; }
  &:disabled { background: #CCC; cursor: not-allowed; }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
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
  margin: 0;
`;

function RSVP({
  content = {},
  showBadge = false,
}) {
  const { projectId } = useWedding();
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [attending, setAttending] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    allergies: '',
    message: '',
    custom: '',
  });
  const [guestMenus, setGuestMenus] = useState(['']);
  const sectionRef = useRef(null);

  // Get settings from content - using new admin field names
  const title = content.title || 'Seid ihr dabei?';
  const subtitle = content.subtitle || 'Bitte lasst uns wissen, ob ihr kommen könnt.';
  const showMenu = content.show_menu !== false;
  const showAllergies = content.show_allergies !== false;
  const showMessage = content.show_message !== false;
  const showCustom = content.show_custom || false;
  const customLabel = content.custom_label || 'Sonstiges';
  const maxPersons = content.max_persons || 5;
  const menuOptions = content.menu_options || ['Fleisch', 'Fisch', 'Vegetarisch', 'Vegan'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Update guest menus array when count changes
  const handleGuestCountChange = (newCount) => {
    setGuestCount(newCount);
    const newMenus = [...guestMenus];
    while (newMenus.length < newCount) newMenus.push('');
    while (newMenus.length > newCount) newMenus.pop();
    setGuestMenus(newMenus);
  };

  const handleMenuChange = (index, value) => {
    const newMenus = [...guestMenus];
    newMenus[index] = value;
    setGuestMenus(newMenus);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Store scroll position
    const scrollY = window.scrollY;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine all menu choices into one string
      const menuChoices = guestMenus.map((menu, i) => `Person ${i + 1}: ${menu || 'Keine Angabe'}`).join('; ');
      
      const rsvpData = {
        name: formData.name,
        email: formData.email,
        persons: guestCount,
        attending: attending === 'yes',
        dietary: menuChoices,
        allergies: formData.allergies,
        message: formData.message,
        custom_field: formData.custom,
      };

      const { error: submitError } = await submitRSVP(projectId, rsvpData);
      
      if (submitError) {
        throw new Error(submitError.message);
      }

      setSubmitted(true);
      
      // Restore scroll position after state update
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    } catch (err) {
      console.error('RSVP submission error:', err);
      setError('Es gab einen Fehler beim Absenden. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Section ref={sectionRef} id="rsvp">
        {showBadge && <IncludedBadge>Inklusive</IncludedBadge>}
        <Container>
          <SuccessMessage>
            <SuccessIcon>{attending === 'yes' ? '🎉' : '💝'}</SuccessIcon>
            <SuccessTitle>{attending === 'yes' ? 'Wunderbar!' : 'Vielen Dank!'}</SuccessTitle>
            <SuccessText>
              {attending === 'yes' 
                ? 'Wir freuen uns sehr, dass ihr dabei seid!' 
                : 'Schade, dass ihr nicht kommen könnt. Wir denken an euch!'}
            </SuccessText>
          </SuccessMessage>
        </Container>
      </Section>
    );
  }

  return (
    <Section ref={sectionRef} id="rsvp">
      {showBadge && <IncludedBadge>Inklusive</IncludedBadge>}
      <Container>
        <Header>
          <Eyebrow $visible={visible}>RSVP</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <Form $visible={visible} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name *</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Vor- und Nachname" required />
          </FormGroup>
          
          <FormGroup>
            <Label>E-Mail *</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@beispiel.de" required />
          </FormGroup>
          
          <FormGroup>
            <Label>Kommst du? *</Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput type="radio" name="attending" value="yes" checked={attending === 'yes'} onChange={() => setAttending('yes')} required />
                Ja, ich komme
              </RadioLabel>
              <RadioLabel>
                <RadioInput type="radio" name="attending" value="no" checked={attending === 'no'} onChange={() => setAttending('no')} />
                Leider nicht
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          {attending === 'yes' && (
            <>
              <FormGroup>
                <Label>Anzahl Gäste</Label>
                <Select value={guestCount} onChange={(e) => handleGuestCountChange(parseInt(e.target.value, 10))}>
                  {Array.from({ length: maxPersons }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>
                  ))}
                </Select>
              </FormGroup>
              
              {showMenu && guestMenus.map((menu, index) => (
                <FormGroup key={index}>
                  <Label>Menüwahl {guestCount > 1 ? `Person ${index + 1}` : ''}</Label>
                  <Select value={menu} onChange={(e) => handleMenuChange(index, e.target.value)}>
                    <option value="">Bitte auswählen</option>
                    {menuOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </Select>
                </FormGroup>
              ))}
              
              {showAllergies && (
                <FormGroup>
                  <Label>Allergien / Unverträglichkeiten</Label>
                  <Input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="z.B. Nüsse, Laktose..." />
                </FormGroup>
              )}
            </>
          )}
          
          {showMessage && (
            <FormGroup>
              <Label>Nachricht (optional)</Label>
              <TextArea name="message" value={formData.message} onChange={handleChange} placeholder="Möchtest du uns noch etwas mitteilen?" />
            </FormGroup>
          )}
          
          {showCustom && (
            <FormGroup>
              <Label>{customLabel}</Label>
              <TextArea name="custom" value={formData.custom} onChange={handleChange} />
            </FormGroup>
          )}
          
          {error && (
            <div style={{ color: '#C62828', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <SubmitButton type="submit" disabled={attending === null || isSubmitting}>
            {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
          </SubmitButton>
        </Form>
      </Container>
    </Section>
  );
}

export default RSVP;
