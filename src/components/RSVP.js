// Editorial Theme - RSVP
import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
  position: relative;
`;

const Container = styled.div`
  max-width: 600px;
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
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
`;

const Form = styled.form`
  background: #FFF;
  padding: 3rem;
  border: 1px solid #E0E0E0;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
  
  @media (max-width: 600px) {
    padding: 2rem 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    background: #FFF;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  
  &:focus {
    outline: none;
    border-color: #000;
    background-color: #FFF;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #333;
  
  input {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #000;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    
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
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #000;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  min-height: 120px;
  resize: vertical;
  
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
  width: 100%;
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
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #CCC;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
  
  h3 {
    font-family: 'Instrument Serif', serif;
    font-size: 1.8rem;
    color: #000;
    margin-bottom: 1rem;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #666;
    line-height: 1.6;
  }
`;

const Deadline = styled.p`
  text-align: center;
  margin-top: 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
  
  strong {
    color: #000;
    font-weight: 600;
  }
`;

function RSVP({
  title = 'Seid ihr',
  titleAccent = 'dabei?',
  subtitle = 'Bitte lasst uns bis zum 15. Juni wissen, ob ihr kommen könnt.',
  deadline = '15. Juni 2025',
  menuOptions = ['Fleisch', 'Fisch', 'Vegetarisch', 'Vegan'],
  onSubmit = (data) => console.log('RSVP submitted:', data),
}) {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    guests: '1',
    menu: '',
    allergies: '',
    message: '',
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Section ref={sectionRef} id="rsvp">
        <Container>
          <SuccessMessage>
            <h3>Vielen Dank! 💕</h3>
            <p>
              {formData.attendance === 'yes' 
                ? 'Wir freuen uns riesig, dass ihr dabei seid! Ihr werdet bald weitere Informationen erhalten.'
                : 'Schade, dass ihr nicht kommen könnt. Wir werden euch trotzdem in Gedanken bei uns haben.'}
            </p>
          </SuccessMessage>
        </Container>
      </Section>
    );
  }

  return (
    <Section ref={sectionRef} id="rsvp">
      <Container>
        <Header visible={visible}>
          <Eyebrow>RSVP</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>
        
        <Form visible={visible} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Euer Name</Label>
            <Input 
              type="text" 
              name="name" 
              placeholder="Vor- und Nachname"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>E-Mail</Label>
            <Input 
              type="email" 
              name="email" 
              placeholder="eure@email.de"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Werdet ihr dabei sein?</Label>
            <RadioGroup>
              <RadioLabel>
                <input 
                  type="radio" 
                  name="attendance" 
                  value="yes"
                  checked={formData.attendance === 'yes'}
                  onChange={handleChange}
                  required
                />
                Ja, wir kommen!
              </RadioLabel>
              <RadioLabel>
                <input 
                  type="radio" 
                  name="attendance" 
                  value="no"
                  checked={formData.attendance === 'no'}
                  onChange={handleChange}
                />
                Leider nicht
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          {formData.attendance === 'yes' && (
            <>
              <FormGroup>
                <Label>Anzahl Gäste</Label>
                <Select name="guests" value={formData.guests} onChange={handleChange}>
                  <option value="1">1 Person</option>
                  <option value="2">2 Personen</option>
                  <option value="3">3 Personen</option>
                  <option value="4">4 Personen</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Menüauswahl</Label>
                <Select name="menu" value={formData.menu} onChange={handleChange} required>
                  <option value="">Bitte auswählen</option>
                  {menuOptions.map((option, i) => (
                    <option key={i} value={option.toLowerCase()}>{option}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Allergien / Unverträglichkeiten</Label>
                <Input 
                  type="text" 
                  name="allergies" 
                  placeholder="Optional"
                  value={formData.allergies}
                  onChange={handleChange}
                />
              </FormGroup>
            </>
          )}
          
          <FormGroup>
            <Label>Nachricht an uns (optional)</Label>
            <Textarea 
              name="message"
              placeholder="Möchtet ihr uns noch etwas mitteilen?"
              value={formData.message}
              onChange={handleChange}
            />
          </FormGroup>
          
          <SubmitBtn type="submit">
            Antwort senden
          </SubmitBtn>
        </Form>
        
        <Deadline>
          Bitte antwortet bis <strong>{deadline}</strong>
        </Deadline>
      </Container>
    </Section>
  );
}

export default RSVP;
