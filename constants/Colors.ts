/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  primary: '#74003E',
  link: '#007AFF',
  warning: '#FF9500',
  background: '#fff',
  text: {
    primary: '#333',
    secondary: '#666',
  },
  card: {
    pink: '#FCF0F4',
    warning: '#FFF5E6',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.3)',
    modal: 'rgba(0, 0, 0, 0.5)',
  },
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
