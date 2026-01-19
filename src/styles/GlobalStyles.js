import { createGlobalStyle } from 'styled-components';

const EditorialGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #1A1A1A;
    background: #FFFFFF;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Instrument Serif', Georgia, serif;
    font-weight: 400;
    line-height: 1.2;
  }

  p { margin-bottom: 1rem; }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; height: auto; display: block; }
  button { font-family: inherit; cursor: pointer; }
  input, textarea, select { font-family: inherit; font-size: inherit; }
  ul, ol { list-style: none; }

  ::selection { background: #000; color: #FFF; }
  :focus-visible { outline: 2px solid #000; outline-offset: 2px; }
  [id] { scroll-margin-top: 100px; }
`;

export default EditorialGlobalStyles;
