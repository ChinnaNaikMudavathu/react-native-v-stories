import { Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  width,
  statusbarHeight: StatusBar.currentHeight,
  height,
  colors: {
    theme_dark: '#17405f',
    darkgrey: 'rgba(0, 0, 0, 0.5)',
    func_yellow: '#ffffff'
  }
};
