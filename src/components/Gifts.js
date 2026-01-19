// Editorial Theme - Gifts (Geschenke)
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FFF;
  position: relative;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
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
  margin-bottom: 1.5rem;
  
  span { font-style: italic; }
`;

const Intro = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto;
`;

const GiftCard = styled.div`
  background: #FAFAFA;
  border: 1px solid #E0E0E0;
  padding: 3rem;
  margin-top: 3rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const GiftIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const GiftTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 1rem;
`;

const GiftText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const BankDetails = styled.div`
  background: #FFF;
  padding: 1.5rem;
  border: 1px solid #E0E0E0;
  text-align: left;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  font-size: 0.85rem;
  
  .row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #F0F0F0;
    
    &:last-child { border-bottom: none; }
    
    .label {
      color: #999;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .value {
      color: #000;
      font-weight: 500;
    }
  }
`;

const WishlistLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: #FFF;
  background: #000;
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2.5rem 0;
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  &::before, &::after {
    content: '';
    width: 60px;
    height: 1px;
    background: #E0E0E0;
  }
`;

function Gifts({
  title = 'Eure',
  titleAccent = 'Geschenke',
  intro = 'Das größte Geschenk ist eure Anwesenheit. Solltet ihr uns dennoch etwas schenken wollen, haben wir hier einige Ideen.',
  honeymoonText = 'Wir träumen von einer unvergesslichen Hochzeitsreise. Über einen Beitrag zu unserem Reisefond würden wir uns sehr freuen.',
  bankDetails = {
    recipient: 'Sarah & Max Mustermann',
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
    reference: 'Hochzeitsreise',
  },
  wishlistUrl = null,
  wishlistText = 'Zur Wunschliste',
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Header visible={visible}>
          <Eyebrow>Geschenkideen</Eyebrow>
          <Title>{title} <span>{titleAccent}</span></Title>
          <Intro>{intro}</Intro>
        </Header>
        
        <GiftCard visible={visible}>
          <GiftIcon>✈️</GiftIcon>
          <GiftTitle>Hochzeitsreise</GiftTitle>
          <GiftText>{honeymoonText}</GiftText>
          
          {bankDetails && (
            <BankDetails>
              <div className="row">
                <span className="label">Empfänger</span>
                <span className="value">{bankDetails.recipient}</span>
              </div>
              <div className="row">
                <span className="label">IBAN</span>
                <span className="value">{bankDetails.iban}</span>
              </div>
              <div className="row">
                <span className="label">BIC</span>
                <span className="value">{bankDetails.bic}</span>
              </div>
              <div className="row">
                <span className="label">Verwendungszweck</span>
                <span className="value">{bankDetails.reference}</span>
              </div>
            </BankDetails>
          )}
          
          {wishlistUrl && (
            <>
              <Divider><span>oder</span></Divider>
              <WishlistLink href={wishlistUrl} target="_blank" rel="noopener noreferrer">
                {wishlistText} →
              </WishlistLink>
            </>
          )}
        </GiftCard>
      </Container>
    </Section>
  );
}

export default Gifts;
