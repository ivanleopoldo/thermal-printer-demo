import { List as IOSList, Row as IOSRow } from 'react-native-ios-list';
import { cssInterop } from 'nativewind';

export const List = cssInterop(IOSList, {
  className: {
    target: 'style',
  },
});

export const Row = cssInterop(IOSRow, {
  className: {
    target: 'style',
  },
});
