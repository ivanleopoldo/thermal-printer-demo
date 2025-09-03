import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';

export default function Home() {
  useEffect(() => {
    BLEPrinter.init();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <SafeAreaView className="flex-1">
        <Text>Hello</Text>
        <Button
          title="Print"
          onPress={() => {
            console.debug('printing');
            BLEPrinter.printImage('', {
              imageWidth: 300,
              imageHeight: 300,
            });
          }}
        />
      </SafeAreaView>
    </>
  );
}
