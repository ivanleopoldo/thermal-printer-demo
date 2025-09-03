import { Stack } from 'expo-router';
import { Text, SafeAreaView, ScrollView } from 'react-native';
import { Switch } from '@/components/native/Switch';
import { List, Row } from '@/components/native/UI';
import { useCallback, useEffect, useState } from 'react';
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';

import { version } from '@root/package.json';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

export default function Settings() {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(null);
  const [peripherals, setPeripherals] = useState<Map<Peripheral['id'], Peripheral>>(
    new Map<Peripheral['id'], Peripheral>()
  );

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    if (peripheral.advertising.isConnectable && peripheral.name) {
      console.debug('Discovered Peripheral = ', peripheral);
      setPeripherals((map) => {
        return new Map(map.set(peripheral.id, peripheral));
      });
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = () => {
    setConnectedDevice(null);
  };

  const startScan = useCallback(() => {
    if (!isScanning) {
      // setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [isScanning]);

  const connectPeripheral = async (peripheral: Peripheral) => {
    if (peripheral) {
      try {
        if (peripheral) {
          BleManager.connect(peripheral.id).then(() => {
            setConnectedDevice(peripheral);
            console.debug(`[connectPeripheral][${peripheral.id}] connected.`);
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const disconnectPeripheral = async (peripheral: Peripheral) => {
    await BleManager.disconnect(peripheral.id);
  };

  useEffect(() => {
    try {
      BleManager.start({ showAlert: false, restoreIdentifierKey: 'test' })
        .then(() => {
          console.debug('BleManager started.');
        })
        .catch((error: any) => console.error('BeManager could not be started.', error));
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners: any[] = [
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
      BleManager.onDisconnectPeripheral(handleDisconnectedPeripheral),
    ];

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <SafeAreaView className="flex-1">
        <ScrollView>
          <List sideBar inset header={'General'}>
            <Row trailing={<Switch className="my-[-6] scale-90" />}>
              <Text>Toggle Automatic Bluetooth Scanning</Text>
            </Row>
            <Row trailing={<Switch className="my-[-6] scale-90" />}>
              <Text>Toggle Auto Bluetooth Reconnect</Text>
            </Row>
          </List>
          <List header={'Bluetooth'} sideBar inset>
            <Row>
              <Text>Toggle Bluetooth</Text>
            </Row>
            <Row onPress={isScanning ? () => {} : startScan}>
              <Text>{isScanning ? 'Scanning...' : 'Scan'}</Text>
            </Row>
          </List>
          <List header={'Connected Printer'} sideBar inset>
            {connectedDevice ? (
              <Row onPress={() => disconnectPeripheral(connectedDevice)} key={connectedDevice.name}>
                <Text>{connectedDevice.advertising.localName ?? connectedDevice.name}</Text>
              </Row>
            ) : (
              <Row>
                <Text>No Connected Device</Text>
              </Row>
            )}
          </List>
          <List sideBar header={'Discovered Devices'} inset>
            {Array.from(peripherals.values()).length > 0 ? (
              Array.from(peripherals.values())
                .filter((p) => p.id !== connectedDevice?.id)
                .map((peripheral) => {
                  return (
                    <Row key={peripheral.id} onPress={() => connectPeripheral(peripheral)}>
                      <Text>{peripheral.advertising.localName ?? peripheral.name}</Text>
                    </Row>
                  );
                })
            ) : (
              <Row>
                <Text>No Discovered Devices</Text>
              </Row>
            )}
          </List>
          <List sideBar inset header={'App Info'}>
            <Row trailing={<Text>{version}</Text>}>
              <Text>App Version</Text>
            </Row>
            <Row>
              <Text>Source Code</Text>
            </Row>
          </List>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
