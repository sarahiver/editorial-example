import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

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

function FAQ({
  title = 'Häufige',
  titleAccent = 'Fragen',
  faqs = [],
  contactEmail = 'hochzeit@email.de',
}) {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const defaultFaqs = [
    {
      question: 'Gibt es einen Dresscode?',
      answer: 'Wir freuen uns auf elegante Abendgarderobe. Die Herren gerne im Anzug, die Damen im Cocktail- oder Abendkleid. Bitte vermeidet Weiß, das ist der Braut vorbehalten.',
    },
    {
      question: 'Kann ich jemanden mitbringen?',
      answer: 'Bitte habt Verständnis, dass wir nur die auf der Einladung genannten Personen empfangen können. Bei Fragen kontaktiert uns gerne.',
    },
    {
      question: 'Sind Kinder willkommen?',
      answer: 'Wir haben uns für eine Feier nur für Erwachsene entschieden. Wir hoffen auf euer Verständnis.',
    },
    {
      question: 'Gibt es Parkplätze vor Ort?',
      answer: 'Ja, ausreichend kostenlose Parkplätze sind direkt an der Location vorhanden.',
    },
    {
      question: 'Gibt es Übernachtungsmöglichkeiten?',
      answer: 'In der Nähe gibt es mehrere Hotels. Wir haben ein Zimmerkontingent im Hotel Schlossblick reserviert. Nennt bei der Buchung das Stichwort "Hochzeit Pauli & Mo".',
    },
    {
      question: 'Darf ich während der Trauung fotografieren?',
      answer: 'Wir haben einen professionellen Fotografen. Bitte verzichtet während der Trauung auf eigene Fotos, damit alle den Moment genießen können. Bei der Feier könnt ihr gerne knipsen!',
    },
    {
      question: 'Was soll ich schenken?',
      answer: 'Das größte Geschenk ist eure Anwesenheit! Wer uns dennoch etwas schenken möchte, findet unter "Geschenke" unsere Wunschliste.',
    },
    {
      question: 'Bis wann muss ich zusagen?',
      answer: 'Bitte gebt uns bis zum 15. Juni Bescheid, ob ihr dabei seid. Das hilft uns sehr bei der Planung!',
    },
  ];

  const items = faqs.length > 0 ? faqs : defaultFaqs;

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
          <Title $visible={visible}>{title} <span>{titleAccent}</span></Title>
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
        
        {contactEmail && (
          <ContactBox $visible={visible}>
            <ContactTitle>Noch Fragen?</ContactTitle>
            <ContactText>Wir helfen euch gerne weiter.</ContactText>
            <ContactLink href={`mailto:${contactEmail}`}>E-Mail schreiben</ContactLink>
          </ContactBox>
        )}
      </Container>
    </Section>
  );
}

export default FAQ;
