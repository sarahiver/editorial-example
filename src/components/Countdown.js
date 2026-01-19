import { useEffect, useRef, useState } from "react"
import styled, { keyframes } from "styled-components"

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`

const Section = styled.section`
  padding: 8rem 2rem;
  background: #fafafa;
  position: relative;
  overflow: hidden;
`

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`

const Eyebrow = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 1.5rem;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? 0 : "20px")});
  transition: all 0.8s ease;
`

const Title = styled.h2`
  font-family: "Instrument Serif", serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #000;
  margin-bottom: 3rem;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? 0 : "20px")});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
  span {
    font-style: italic;
  }
`

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`

const CountdownItem = styled.div`
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? 0 : "30px")});
  transition: all 0.8s ease;
  transition-delay: ${(p) => 0.2 + p.$index * 0.1}s;
`

const IncludedBadge = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: #000;
  color: #fff;
  font-family: "Inter", sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &::before {
    content: "✓";
    font-size: 0.7rem;
  }
`

const Number = styled.div`
  font-family: "Instrument Serif", serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 400;
  color: #000;
  line-height: 1;
  margin-bottom: 0.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
  animation-delay: ${(p) => p.$index * 0.3}s;
`

const Label = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #666;
`

const DividerLine = styled.div`
  width: 60px;
  height: 1px;
  background: #000;
  margin: 3rem auto;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: scaleX(${(p) => (p.$visible ? 1 : 0)});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`

const Message = styled.p`
  font-family: "Instrument Serif", serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? 0 : "20px")});
  transition: all 0.8s ease;
  transition-delay: 0.7s;
`

function Countdown({
  weddingDate = "2026-08-15T14:00:00",
  title = "Noch",
  titleAccent = "so lange",
  message = "Wir können es kaum erwarten, diesen besonderen Tag mit euch zu teilen.",
  showBadge = false,
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(weddingDate) - new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [weddingDate])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const items = [
    { value: timeLeft.days, label: "Tage" },
    { value: timeLeft.hours, label: "Stunden" },
    { value: timeLeft.minutes, label: "Minuten" },
    { value: timeLeft.seconds, label: "Sekunden" },
  ]

  return (
    <Section ref={sectionRef} id='countdown'>
      {showBadge && <IncludedBadge>Inklusive</IncludedBadge>}
      <Container>
        <Eyebrow $visible={visible}>Countdown</Eyebrow>
        <Title $visible={visible}>
          {title} <span>{titleAccent}</span>
        </Title>

        <CountdownGrid>
          {items.map((item, i) => (
            <CountdownItem key={i} $index={i} $visible={visible}>
              <Number $index={i}>{String(item.value).padStart(2, "0")}</Number>
              <Label>{item.label}</Label>
            </CountdownItem>
          ))}
        </CountdownGrid>

        <DividerLine $visible={visible} />
        <Message $visible={visible}>{message}</Message>
      </Container>
    </Section>
  )
}

export default Countdown
