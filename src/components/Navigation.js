import React, { useState, useEffect } from "react"
import styled from "styled-components"

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(p) =>
    p.$scrolled ? "rgba(255,255,255,0.95)" : "transparent"};
  backdrop-filter: ${(p) => (p.$scrolled ? "blur(10px)" : "none")};
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 2rem;
    right: 2rem;
    height: 1px;
    background: #000;
    transform: scaleX(${(p) => (p.$scrolled ? 1 : 0)});
    transition: transform 0.3s ease;
  }
`

const IncludedBadge = styled.div`
  position: absolute;
  top: 2vh;
  left: 10rem;
  margin-top: 0.5rem;
  background: #000;
  color: #fff;
  font-family: "Inter", sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  display: ${(p) => (p.$visible ? "flex" : "none")};
  align-items: center;
  gap: 0.4rem;

  &::before {
    content: "✓";
    font-size: 0.7rem;
  }
`

const Logo = styled.a`
  font-family: "Instrument Serif", serif;
  font-size: 1.4rem;
  color: #000;
  letter-spacing: -0.02em;
  span {
    font-style: italic;
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 968px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 400px;
    background: #fff;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    transform: translateX(${(p) => (p.$isOpen ? "0" : "100%")});
    transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    box-shadow: ${(p) => (p.$isOpen ? "-10px 0 30px rgba(0,0,0,0.1)" : "none")};
  }
`

const NavLink = styled.a`
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #000;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  @media (max-width: 968px) {
    font-size: 1rem;
    letter-spacing: 0.2em;
  }
`

const DateBadge = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #666;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;

  @media (max-width: 968px) {
    display: none;
  }
`

const MenuButton = styled.button`
  display: none;
  width: 30px;
  height: 20px;
  position: relative;
  background: none;
  border: none;
  z-index: 1001;

  @media (max-width: 968px) {
    display: block;
  }

  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background: #000;
    transition: all 0.3s ease;

    &:nth-child(1) {
      top: ${(p) => (p.$isOpen ? "50%" : "0")};
      transform: ${(p) => (p.$isOpen ? "rotate(45deg)" : "none")};
    }
    &:nth-child(2) {
      top: 50%;
      opacity: ${(p) => (p.$isOpen ? 0 : 1)};
    }
    &:nth-child(3) {
      top: ${(p) => (p.$isOpen ? "50%" : "100%")};
      transform: ${(p) => (p.$isOpen ? "rotate(-45deg)" : "none")};
    }
  }
`

function Navigation({
  coupleNames = "Pauli & Mo",
  weddingDate = "15.08.2025",
  links = [],
  showBadge = false,
}) {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const defaultLinks = [
    { label: "Unser Weg", href: "#story" },
    { label: "Hochzeit", href: "#location" },
    { label: "Ablauf", href: "#timeline" },
    { label: "RSVP", href: "#rsvp" },
    { label: "FAQ", href: "#faq" },
  ]

  const navLinks = links.length > 0 ? links : defaultLinks

  return (
    <Header $scrolled={scrolled}>
      <Logo href='#top'>
        {coupleNames.split("&")[0].trim()} <span>&</span>{" "}
        {coupleNames.split("&")[1]?.trim() || ""}
      </Logo>

      <Nav $isOpen={isOpen}>
        {navLinks.map((link, i) => (
          <NavLink key={i} href={link.href} onClick={() => setIsOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </Nav>

      <DateBadge>{weddingDate}</DateBadge>

      <MenuButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span />
        <span />
        <span />
      </MenuButton>

      <IncludedBadge $visible={showBadge && scrolled}>Inklusive</IncludedBadge>
    </Header>
  )
}

export default Navigation
