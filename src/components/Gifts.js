import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../context/WeddingContext';

const Section = styled.section`
  padding: 8rem 2rem;
  background: #FAFAFA;
`;

const Container = styled.div`
  max-width: 1000px;
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
  max-width: 600px;
  margin: 0 auto;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.2s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
`;

const GiftCard = styled.div`
  background: #FFF;
  border: 1px solid #E0E0E0;
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: ${p => 0.3 + p.$index * 0.1}s;
  position: relative;
  
  ${p => p.$reserved && `
    &::after {
      content: 'Reserviert';
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #000;
      color: #FFF;
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.3rem 0.6rem;
    }
  `}
`;

const GiftImage = styled.div`
  width: 100%;
  padding-top: 75%;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : '#F5F5F5'};
  position: relative;
  
  ${p => p.$reserved && `
    filter: grayscale(50%);
    opacity: 0.7;
  `}
`;

const GiftContent = styled.div`
  padding: 1.5rem;
`;

const GiftName = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: ${p => p.$reserved ? '#999' : '#000'};
  margin-bottom: 0.5rem;
`;

const GiftDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const GiftPrice = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: ${p => p.$reserved ? '#999' : '#000'};
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$reserved ? '#999' : '#FFF'};
  background: ${p => p.$reserved ? '#F0F0F0' : '#000'};
  border: none;
  cursor: ${p => p.$reserved ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${p => p.$reserved ? '#F0F0F0' : '#333'};
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: #FFF;
  padding: 3rem;
  max-width: 450px;
  width: 90%;
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  
  &:hover { color: #000; }
`;

const ModalTitle = styled.h3`
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 0.5rem;
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
  
  &:focus { outline: none; border-color: #000; background: #FFF; }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
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

function Gifts({ content = {} }) {
  const { projectId } = useWedding();
  const title = content.title || 'Geschenke';
  const subtitle = content.subtitle || '';
  const description = content.description || 'Das größte Geschenk ist eure Anwesenheit.';
  const paymentInfo = content.payment_info || '';
  const giftItems = content.items || [];
  
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [reserverName, setReserverName] = useState('');
  const [reservedGifts, setReservedGifts] = useState({});
  const sectionRef = useRef(null);

  // Map items to consistent format (support both old and new field names)
  const items = giftItems.map((gift, i) => ({
    id: gift.id || `gift-${i}`,
    title: gift.name || gift.title || 'Geschenk',
    description: gift.description || '',
    cost: gift.price || gift.cost || '',
    image: gift.image || null,
    url: gift.url || null,
    reserved: gift.reserved || false,
    reserved_by: gift.reserved_by || null,
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleReserve = (gift) => {
    setSelectedGift(gift);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setReservedGifts(prev => ({
      ...prev,
      [selectedGift.id]: reserverName || 'Anonym'
    }));
    
    console.log('Reserving gift:', selectedGift, 'by:', reserverName || 'Anonym');
    
    setModalOpen(false);
    setReserverName('');
  };
  
  const isGiftReserved = (gift) => {
    return gift.reserved || reservedGifts[gift.id];
  };
  
  const getReservedBy = (gift) => {
    return reservedGifts[gift.id] || gift.reserved_by || 'Jemand';
  };

  // Show placeholder if no items
  if (items.length === 0 && !paymentInfo) {
    return null;
  }

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Wunschliste</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          {subtitle && <Intro $visible={visible}>{subtitle}</Intro>}
          <Intro $visible={visible}>{description}</Intro>
        </Header>
        
        {items.length > 0 && (
          <Grid>
            {items.map((gift, i) => {
              const reserved = isGiftReserved(gift);
              return (
                <GiftCard key={gift.id} $index={i} $visible={visible} $reserved={reserved}>
                  {gift.image && <GiftImage $image={gift.image} $reserved={reserved} />}
                  <GiftContent>
                    <GiftName $reserved={reserved}>{gift.title}</GiftName>
                    {gift.description && <GiftDescription>{gift.description}</GiftDescription>}
                    {gift.cost && <GiftPrice $reserved={reserved}>{gift.cost}</GiftPrice>}
                    {gift.url && !reserved && (
                      <a href={gift.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '1rem', fontSize: '0.8rem', color: '#666' }}>
                        → Zum Shop
                      </a>
                    )}
                    <ReserveButton 
                      $reserved={reserved} 
                      onClick={() => !reserved && handleReserve(gift)}
                      disabled={reserved}
                    >
                      {reserved ? `Reserviert` : 'Reservieren'}
                    </ReserveButton>
                  </GiftContent>
                </GiftCard>
              );
            })}
          </Grid>
        )}
        
        {paymentInfo && (
          <div style={{ 
            marginTop: '3rem', 
            padding: '2rem', 
            background: '#FFF', 
            border: '1px solid #E0E0E0',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontFamily: 'Inter, sans-serif', 
              fontSize: '0.7rem', 
              fontWeight: 500, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: '#666',
              marginBottom: '1rem'
            }}>
              Bankverbindung
            </div>
            <div style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: '0.9rem', 
              color: '#000',
              whiteSpace: 'pre-line'
            }}>
              {paymentInfo}
            </div>
          </div>
        )}
        
        <Modal $open={modalOpen} onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalClose onClick={() => setModalOpen(false)}>×</ModalClose>
            <ModalTitle>Geschenk reservieren</ModalTitle>
            <ModalSubtitle>{selectedGift?.title}{selectedGift?.cost ? ` – ${selectedGift.cost}` : ''}</ModalSubtitle>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Euer Name (optional)</Label>
                <Input 
                  type="text" 
                  value={reserverName} 
                  onChange={e => setReserverName(e.target.value)} 
                  placeholder="Vor- und Nachname"
                />
              </FormGroup>
              <SubmitButton type="submit">Jetzt reservieren</SubmitButton>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </Section>
  );
}

export default Gifts;
