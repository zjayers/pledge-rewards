import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    borderGrey: '#9B9E9E',
    highlightGreen: '#009E74',
    buttonGreen: '#009E74',
    gradientBlue: '#DBE7FE',
    gradientOrange: '#FFF2EC',
    text: '#282828',
    flavorText: '#888B8B',
    linkText: '#498F80',
  },
  fonts: ['Muli', 'sans-serif'],
  fontSizes: {
    small: '1rem',
    medium: '1.8rem',
    large: '3rem',
  },
};

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;
