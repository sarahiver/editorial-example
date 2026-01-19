// Editorial Theme - FAQ
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFF;
  position: relative;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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
  
  span { font-style: italic; }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const FAQItem = styled.div`
  border-bottom: 1px solid #E0E0E0;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => 0.1 + p.index * 0.08}s;
  
  &:first-child {
    border-top: 1px solid #E0E0E0;
  }
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1rem;
  
  &:hover h4 {
    color: #666;
  }
`;

const QuestionText = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.15rem;
  font-weight: 400;
  color: #000;
  transition: color 0.3s ease;
  flex: 1;
`;

const ToggleIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #000;
  transition: transform 0.3s ease;
  
  ${p => p.isOpen && css`
    transform: rotate(45deg);
  `}
`;

const Answer = styled.div`
  max-height: ${p => p.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AnswerContent = styled.div`
  padding-bottom: 1.5rem;
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #666;
    line-height: 1.7;
  }
  
  a {
    color: #000;
    text-decoration: underline;
    text-underline-offset: 2px;
    
    &:hover {
      text-decoration: none;
    }
  }
  
  ul {
    margin-top: 1rem;
    padding-left: 1.5rem;
    
    li {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: #666;
      line-height: 1.8;
      
      &::marker {
        color: #000;
      }
    }
  }
`;

const ContactBox = styled.div`
  margin-top: 4rem;
  padding: 2rem;
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  text-align: center;
  opacity: ${p => p.visible ? 1 : 0};
  transition: all 0.8s ease;
  transition-delay: 0.5s;
`;

const ContactTitle = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.75rem;
`;

const ContactText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: #000;
    text-decoration: underline;
    text-underline-offset: 2px;
    
    &:hover { text-decoration: none; }
  }
`;

function FAQ({
  title = 'Häufige',
  titleAccent = 'Fragen',
  faqs = [
    {
      question: 'Gibt es einen Dresscode?',
      answer: 'Wir freuen uns über festliche Kleidung. Die Herren dürfen gerne im Anzug erscheinen, Damen in eleganten Kleidern. Bitte bedenkt, dass die Trauung im Schloss und Teile der Feier im Freien stattfinden.',
    },
    {
      question: 'Kann ich eine Begleitung mitbringen?',
      answer: 'Aufgrund begrenzter Plätze können wir leider nur die auf der Einladung genannten Personen empfangen. Falls ihr unsicher seid, sprecht uns gerne an!',
    },
    {
      question: 'Sind Kinder willkommen?',
      answer: 'Wir feiern diesen besonderen Tag gerne mit euren Kindern! Bitte gebt bei der RSVP an, ob ihr mit Kindern kommt, damit wir entsprechend planen können.',
    },
    {
      question: 'Gibt es Übernachtungsmöglichkeiten?',
      answer: 'Wir haben Zimmerkontingente in folgenden Hotels reserviert: Hotel Heidelberg (5 Min. entfernt) und Pension Schlossblick. Bei Buchung gebt bitte "Hochzeit Sarah & Max" an.',
    },
    {
      question: 'Darf ich Fotos machen?',
      answer: 'Während der Trauung bitten wir euch, die Handys wegzustecken und den Moment mit uns zu genießen. Unser Fotograf wird alles festhalten. Bei der Feier dürft ihr natürlich gerne fotografieren!',
    },
    {
      question: 'Was ist mit Geschenken?',
      answer: 'Eure Anwesenheit ist das größte Geschenk. Solltet ihr uns dennoch etwas schenken wollen, findet ihr unter "Geschenke" weitere Informationen.',
    },
  ],
  contactText = 'Noch Fragen? Schreibt uns an',
  contactEmail = 'hochzeit@sarah-und-max.de',
}) {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header visible={visible}>
          <Eyebrow>FAQ</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
        </Header>
        
        <FAQList>
          {faqs.map((faq, i) => (
            <FAQItem key={i} index={i} visible={visible}>
              <Question onClick={() => toggleFAQ(i)}>
                <QuestionText>{faq.question}</QuestionText>
                <ToggleIcon isOpen={openIndex === i}>+</ToggleIcon>
              </Question>
              <Answer isOpen={openIndex === i}>
                <AnswerContent>
                  <p>{faq.answer}</p>
                </AnswerContent>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
        
        {contactEmail && (
          <ContactBox visible={visible}>
            <ContactTitle>Weitere Fragen?</ContactTitle>
            <ContactText>
              {contactText} <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </ContactText>
          </ContactBox>
        )}
      </Container>
    </Section>
  );
}

export default FAQ;
