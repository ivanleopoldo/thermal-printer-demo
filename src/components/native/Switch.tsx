import { cssInterop } from 'nativewind';
import { Switch as RNSwitch } from 'react-native';

export const Switch = cssInterop(RNSwitch, {
  className: {
    target: 'style',
  },
});
