import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
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
  color: #000;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span { font-style: italic; }
`;

const AccordionList = styled.div`
  border-top: 1px solid #E0E0E0;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid #E0E0E0;
  background: #FFF;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.2 + p.$index * 0.1}s;
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.3s ease;
  
  &:hover {
    background: #FAFAFA;
  }
`;

const Question = styled.span`
  font-family: 'Instrument Serif', serif;
  font-size: 1.15rem;
  font-weight: 400;
  color: #000;
  padding-right: 2rem;
`;

const ToggleIcon = styled.span`
  font-size: 1.5rem;
  color: #000;
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '45deg' : '0'});
  flex-shrink: 0;
`;

const AccordionContent = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const Answer = styled.div`
  padding: 0 2rem 1.5rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
`;

const ContactBox = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: #FFF;
  border: 1px solid #E0E0E0;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.5s;
`;

const ContactTitle = styled.h4`
  font-family: 'Instrument Serif', serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.75rem;
`;

const ContactText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ContactLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  padding-bottom: 2px;
  border-bottom: 1px solid #000;
  transition: all 0.3s ease;
  
  &:hover {
    color: #666;
    border-color: #666;
  }
`;

function FAQ({ content = {} }) {
  const title = content.title || 'Häufige Fragen';
  const questions = content.questions || [];
  
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const defaultFaqs = [
    { question: 'Gibt es einen Dresscode?', answer: 'Wir freuen uns auf elegante Abendgarderobe.' },
    { question: 'Kann ich jemanden mitbringen?', answer: 'Bitte nur die auf der Einladung genannten Personen.' },
    { question: 'Sind Kinder willkommen?', answer: 'Wir haben uns für eine Feier nur für Erwachsene entschieden.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, kostenlose Parkplätze sind vorhanden.' },
  ];

  const items = questions.length > 0 ? questions : defaultFaqs;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>FAQ</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <AccordionList>
          {items.map((item, i) => (
            <AccordionItem key={i} $index={i} $visible={visible}>
              <AccordionHeader onClick={() => toggleItem(i)}>
                <Question>{item.question}</Question>
                <ToggleIcon $open={openIndex === i}>+</ToggleIcon>
              </AccordionHeader>
              <AccordionContent $open={openIndex === i}>
                <Answer>{item.answer}</Answer>
              </AccordionContent>
            </AccordionItem>
          ))}
        </AccordionList>
      </Container>
    </Section>
  );
}

export default FAQ;
