import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import AccountScreen from '../screens/Profile/AccountScreen';
import {
  Alert,
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
console.log('HomeScreen:', HomeScreen);
console.log('AccountScreen:', AccountScreen);
import {useSDK} from '@metamask/sdk-react-native';
// import {useConnection} from '../../contexts/ConnectionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import ExploreScreen from '../screens/Explore/ExploreScreen';

// import SettingsScreen from './SettingsScreen'; // optional

const Tab = createBottomTabNavigator();
export default function MainTabs({route}) {
  const userChainId = route?.params?.userChainId;
  console.log('userchinid ', userChainId);

  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedChainId, setFetchedChainId] = useState(null);
  const [fetchedChainName, setFetchedChainName] = useState(null);
  const {sdk, connected, connecting, provider, chainId, account, ConnectWith} =
    useSDK();

  // const REQUIRED_CHAIN_ID = '0xaa36a7' ; //0xaa36a7  11155111
  // const REQUIRED_CHAIN_ID = '2442' ;
  const REQUIRED_CHAIN_ID = '80002'; //0x13882  80002

  useEffect(() => {
    if (!provider || !sdk) {
      return;
    }
    // console.log("Connected: from @@@@@@@@@@@popup",'0x' + (fetchedChainId).toString(16),REQUIRED_CHAIN_ID);
    // console.log("sdk###############!!!!!!!sdkkkk",sdk)
    // console.log("sdk###############!!!!!!!sdkkkk",provider)
    // console.log("chainid############!!!!!!!",chainId)

    const getStoredChainId = async () => {
      try {
        const chainId = await AsyncStorage.getItem('chainId');
        if (chainId !== null) {
          checkChain(chainId);

          console.log('Retrieved chain ID:', chainId);
          //  setFetchedChainId(chainId);
          FindChainName(chainId);
        }
      } catch (error) {
        console.error('Failed to retrieve chain ID:', error);
      }
    };
    getStoredChainId();

    // if (sdk && provider) {
    //   setTimeout(() => {
    //     checkChain();
    //   }, 100);
    // }
  }, [sdk, provider]);

  const FindChainName = async chainId => {
    try {
      const response = await fetch('https://chainid.network/chains_mini.json');
      const chains = await response.json();
      const chain = chains.find(c => c.chainId === Number(chainId));
      console.log('Chain:,fetchedChainId', chain, chainId);
      if (chain) {
        console.log('Chain name:', chain.name);
        setFetchedChainName(chain.name);
      }
    } catch (error) {
      console.error('Error fetching chain name:', error);
    }
  };

  const checkChain = async chainId => {
    if (!sdk || !provider) {
      return;
    }
    try {
      // const currentChainId = await provider.getChainId();
      console.log('Provider:', provider);
      const currentChainId = await provider.getChainId();

      // console.log('Provider:', currentChainId);
      // console.log('Current chain ID:!!!!!!***************!!!!!!!!!!!', currentChainId);
      console.log(
        'Connected: from @@@@@@@@@@@popupoutside',
        Number(chainId),
        currentChainId,
        Number(currentChainId),
        parseInt(currentChainId, 16),
        REQUIRED_CHAIN_ID,
      );

      // if (currentChainId!==null && !isNaN(currentChainId) && parseInt(currentChainId, 16)!== parseInt(REQUIRED_CHAIN_ID)) {
      if (parseInt(chainId) !== parseInt(REQUIRED_CHAIN_ID)) {
        console.log(
          'Connected: from @@@@@@@@@@@popupinside',
          parseInt(chainId),
          parseInt(currentChainId, 16),
          REQUIRED_CHAIN_ID,
        );

        setModalVisible(true);
      } else {
        console.log('Correct chain, hiding modal...');
        setModalVisible(false);
      }
    } catch (err) {
      console.error('Error checking chain ID:', err);
    }
  };

  const switchNetwork = async () => {
    console.debug('Switching network............................');
    if (!provider) {
      console.warn('Provider is not available');
      return;
    }
    try {
      const res = await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x13882'}],
      });
      console.log('Switching network response:', res);
      await AsyncStorage.setItem('chainId', '80002');
      setModalVisible(false);
      setFetchedChainId('80002');
      const afterSwitch = await provider.getChainId();
      console.log('✅ After switch chain:', afterSwitch);
    } catch (err) {
      console.warn('Chain switch failed:', err);
      // setModalVisible(true)

      try {
        const res = await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13882', // 80002 in hex
              chainName: 'Amoy',
              blockExplorerUrls: ['https://www.oklink.com/amoy'],
              nativeCurrency: {
                symbol: 'POL',
                decimals: 18,
              },
              rpcUrls: ['https://polygon-amoy-bor-rpc.publicnode.com'],
            },
          ],
        });
        console.log('Add chain response:', res);
        await AsyncStorage.setItem('chainId', '80002');
        setFetchedChainId('80002');
        setModalVisible(false);
      } catch (addError) {
        console.error('Failed to add chain:', addError);
      }
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: 60,
          },
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Account') {
              iconName = 'user';
            } else if (route.name === 'Explore') {
              iconName = 'compass';
            }

            return (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: focused ? '#ccff99' : 'transparent',

                  borderRadius: 20,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: focused ? 'limegreen' : 'transparent',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name={iconName}
                    size={20}
                    color={focused ? 'black' : 'gray'}
                  />
                </View>

                {focused && (
                  <Text
                    style={{
                      color: 'black',
                      paddingHorizontal: 12,
                      fontWeight: '700',
                      fontSize: 14,
                    }}>
                    {route.name}
                  </Text>
                )}
              </View>
            );
          },
          //  tabBarStyle: {
          //   height: 60,
          //   borderTopWidth: 0,
          //   elevation: 0,
          //   backgroundColor: '#fff',
          // },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />

        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>

      {/* Modal for chain switch */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Unsupported Network</Text>

            <Text style={styles.description}>
              You're currently connected to{' '}
              <Text style={styles.highlight}>{fetchedChainName}</Text>.
            </Text>
            <Text style={styles.description}>
              Please switch to{' '}
              <Text style={styles.highlight}>Amoy Testnet</Text> to continue.
            </Text>

            <Pressable style={styles.button} onPress={switchNetwork}>
              <Text style={styles.buttonText}>Switch Network</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
