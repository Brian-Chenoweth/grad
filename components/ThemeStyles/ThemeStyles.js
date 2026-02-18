import appConfig from '../../app.config';

const themes = {
  blue: {
    '--color-black': '#000',
    '--color-primary': '#000066',
    '--color-secondary': '#0969da',
    '--color-tertiary': '#CCCCCC',
    '--color-white': '#FFFFFF',
  },
  red: {
    '--color-black': '#000',
    '--color-primary': '#660000',
    '--color-secondary': '#B50505',
    '--color-tertiary': '#CCCCCC',
    '--color-white': '#FFFFFF',
  },
  green: {
    '--color-black': '#000',
    '--color-primary': '#154734',
    '--color-secondary': '#f2c75c',
    '--color-tertiary': '#B7CDC26B',
    '--color-white': '#FFFFFF',
    '--color-lime': '#a4d65e',
  },
};

export default function ThemeStyles() {
  const themeColor = appConfig?.themeColor ?? 'green';

  return (
    // eslint-disable-next-line react/no-unknown-property
    <style jsx global>{`
      :root {
        --color-black: ${themes[themeColor]['--color-black']};
        --color-primary: ${themes[themeColor]['--color-primary']};
        --color-secondary: ${themes[themeColor]['--color-secondary']};
        --color-tertiary: ${themes[themeColor]['--color-tertiary']};
        --color-white: ${themes[themeColor]['--color-white']};
        --color-lime: ${themes[themeColor]['--color-lime']};
      }
    `}</style>
  );
}
