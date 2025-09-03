import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import { BLEPrinter, COMMANDS } from 'react-native-thermal-receipt-printer-image-qr';

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
            BLEPrinter.printImage(
              'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp7771873.jpg&f=1&nofb=1&ipt=57901f27a5bcda65723edbf682e43bb73f7a5a2b04dc0880e125bd978d4bf896',
              {
                imageWidth: 300,
                imageHeight: 300,
              }
            );
            BLEPrinter.printBill(`${COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT} Test Print`);
          }}
        />
      </SafeAreaView>
    </>
  );
}
