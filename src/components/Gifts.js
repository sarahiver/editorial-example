import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFFFFF;
`;

const Container = styled.div`
  max-width: 700px;
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
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span { font-style: italic; }
`;

const Intro = styled.p`
  font-family: 'Instrument Serif', serif;
  font-size: 1.15rem;
  font-style: italic;
  color: #666;
  line-height: 1.7;
  max-width: 550px;
  margin: 0 auto;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const Card = styled.div`
  background: #FAFAFA;
  padding: 3rem;
  margin-top: 3rem;
  border: 1px solid #E0E0E0;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.3s;
  
  @media (max-width: 600px) { padding: 2rem 1.5rem; }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1.5rem;
`;

const BankDetails = styled.div`
  margin-bottom: 2rem;
`;

const BankRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E0E0E0;
  
  &:last-child { border-bottom: none; }
  
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const BankLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
`;

const BankValue = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #000;
  letter-spacing: 0.05em;
`;

const Divider = styled.div`
  width: 60px;
  height: 1px;
  background: #E0E0E0;
  margin: 2rem auto;
`;

const WishlistText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const WishlistLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  padding-bottom: 2px;
  border-bottom: 1px solid #000;
  transition: all 0.3s ease;
  
  &:hover { color: #666; border-color: #666; }
`;

function Gifts({
  title = 'Eure',
  titleAccent = 'Geschenke',
  introText = 'Das größte Geschenk ist, dass ihr unseren besonderen Tag mit uns feiert. Wer uns trotzdem etwas schenken möchte, kann gerne zu unserer Hochzeitsreise beitragen.',
  bankDetails = {
    recipient: 'Sarah Müller & Max Schmidt',
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
    reference: 'Hochzeit Sarah & Max',
  },
  wishlistUrl = '',
  wishlistText = 'Alternativ haben wir auch eine kleine Wunschliste zusammengestellt.',
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Geschenke</Eyebrow>
          <Title $visible={visible}>{title} <span>{titleAccent}</span></Title>
          <Intro $visible={visible}>{introText}</Intro>
        </Header>
        
        <Card $visible={visible}>
          <CardIcon>💝</CardIcon>
          <CardTitle>Hochzeitsreise-Kasse</CardTitle>
          
          <BankDetails>
            <BankRow><BankLabel>Empfänger</BankLabel><BankValue>{bankDetails.recipient}</BankValue></BankRow>
            <BankRow><BankLabel>IBAN</BankLabel><BankValue>{bankDetails.iban}</BankValue></BankRow>
            <BankRow><BankLabel>BIC</BankLabel><BankValue>{bankDetails.bic}</BankValue></BankRow>
            <BankRow><BankLabel>Verwendungszweck</BankLabel><BankValue>{bankDetails.reference}</BankValue></BankRow>
          </BankDetails>
          
          {wishlistUrl && (
            <>
              <Divider />
              <WishlistText>{wishlistText}</WishlistText>
              <WishlistLink href={wishlistUrl} target="_blank" rel="noopener noreferrer">
                Zur Wunschliste →
              </WishlistLink>
            </>
          )}
        </Card>
      </Container>
    </Section>
  );
}

export default Gifts;
