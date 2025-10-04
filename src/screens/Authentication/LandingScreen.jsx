import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';
import * as Keychain from 'react-native-keychain';

import {WebView} from 'react-native-webview';
import {useSDK} from '@metamask/sdk-react-native';
import {useNavigation} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import ModalLoginScreen from './ModalLoginScreen';
// import ModalLoginScratch from './ModalLoginScratch';
import AuthenticateScreen from './AuthenticateScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import ActivityIndicatorComponent from '../components/ActivityIndicator';
import {useConnection} from '../../contexts/ConnectionContext';
import OrbitingCircles from '../../components/OrbitingCircles';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');

export default function LandingScreen() {
  const translationY = useSharedValue(height);
  const visiblePosition = 3;

  // const {sdk, connected, connecting, provider, account} = useSDK();
  const {
  sdk,
  provider,
  connected,
  connecting,
  chainId,
  account,
} = useConnection();
  const [loading, setLoading] = useState(true);
  // const [SessionAddress, setAddress] = useState(null);
  // const [initialconnectStatus ,setinitialconnectStatus ] = useState(false);  // black or green

  // const[intialsiweStatus ,setintialsiweStatus ] = useState(false);  //  writ or wrong
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [phase, setPhase] = useState('connect');
  // const [SendsiweMessage, setSiweMessage] = useState(null);
const siweMessageRef = useRef(null);
  const [openmetamask, setopenmetamask] = useState(true);
  const [retryAfter, setRetryAfter] = useState(null);
  const [currentChainId, setChainId] = useState(null);
  const modalizeRef = useRef(null);
  const navigation = useNavigation();

  const {
    hasAttemptedConnect,
    setHasAttemptedConnect,
    setHasAttemptedSign,
    connectStatus,
    setconnectStatus,
    siwestatus,
    setsiwestatus,
    deviceId,
    setselectedAddress,
    selectedAddress,
  } = useConnection();

  const storeWalletAddress = async address => {
    try {
      await AsyncStorage.setItem('walletAddress', address);
      console.log(' Wallet address saved');
    } catch (e) {
      console.error(' Failed to save wallet address:', e);
    }
  };
  useEffect(() => {
    if (!sdk && !provider) {
      return;
    }
    // checkSession()
    console.log('check for connecting', connecting);
    console.log('Connected:', connected);
    console.log('Chain ID:', currentChainId);
    console.log('Account:', account);
    console.log('sdk:', sdk);
    console.log('provider:', provider);
  }, [sdk, provider]);
  // useEffect(() => {
//   if (SendsiweMessage!==null) {
//     console.log("State updated with SIWE message:", SendsiweMessage);
//   }

// }, [SendsiweMessage]);
  const openModal = () => {
    requestAnimationFrame(() => {
      // Wait for layout to be fully mounted
      setTimeout(() => {
        if (modalizeRef.current) {
          try {
            modalizeRef.current.open();
          } catch (e) {
            console.warn('Modalize open failed', e);
          }
        }
      }, 100); // 100ms is usually safe
    });
  };

  // const checkSession = async () => {
  //   try {
  //     // console.log('check for conected or diconnected',connected);

  //     setLoading(true);

  //     const selectedaddress = await provider.getSelectedAddress();
  //     console.log('Checking session...', selectedaddress);
  //     console.log('account', account);
  //     // const [address] = await sdk.connect(); // triggers silent connect
  //     const res = await fetch('://192.168.1.4:3001/login', {
  //       headers: {'x-user-address': selectedaddress},
  //     });
  //     console.log('Response :', res);
  //     if (res.ok) {
  //       console.log('Session active — redirecting');

  //       navigation.replace('Main');

  //       // setconnectStatus(true)
  //     } else {
  //       console.log('No active session. Stay on login screen.');
  //       //  setinitialconnectStatus(true);  //  black or green
  //       setPhase('connect');
  //       setSiweMessage(null);
  //       // setintialsiweStatus(false);  //  writ or wrong
  //       // setconnectStatus(false)

  //       sdk?.terminate();
  //     }
  //   } catch (err) {
  //     console.log('Session check error:', err);
  //     sdk?.terminate();
  //     // setinitialconnectStatus(true)
  //     // setconnectStatus(false)
  //   } finally {
  //     setLoading(false);
  //     SplashScreen.hide();
  //   }
  // };
  const StoreChainId = async chainId => {
    if (!chainId) {
      console.error(' Invalid chain ID provided:', chainId);
      return;
    }

    console.log('Storing chain ID:', chainId);

    try {
      const decimalChainId = parseInt(chainId, 16).toString();

      if (isNaN(decimalChainId)) {
        throw new Error(`Parsed chain ID is NaN for input: ${chainId}`);
      }

      await AsyncStorage.setItem('chainId', decimalChainId);
      console.log(' Chain ID saved:', decimalChainId);
    } catch (e) {
      console.error(' Failed to save chain ID:', e);
    }
  };

  const connect = async () => {
    setconnectStatus(true); //  write or wrong
    if (!sdk || !provider) {
      console.warn('SDK or provider is not available');
      return;
    }
    try {
      if (openmetamask) {
        const [address] = await sdk.connect();
        // const resq = await provider.request({
        //   method: 'wallet_switchEthereumChain',
        //   params: [{ chainId: '0xe708' }],
        // });
        // console.log("Switching network response:", resq);
        storeWalletAddress(address);
        setHasAttemptedConnect(true);

        const chainId = await provider.getChainId();
        console.log(' await provider.getChainId(); :', chainId);
        setChainId(chainId);
        StoreChainId(chainId);
        const res = await fetch('http://192.168.1.4:3001/auth-request', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({address, chainId, deviceId}),
        });
        console.log(' Response status:', res);

        if (res.status === 429 && !res.ok) {
          console.log('rees::::::', res);
          setopenmetamask(false);
          const time = res.headers.get('retry-after');
          setRetryAfter(time);
          // let message = `Too many requests. Please wait ${retryAfter || '?'} seconds before trying again.`;

          // console.warn(message)

          return;
        }
        if (res.status === 400) {
          const json = await res.json();
          console.warn('Try again Later', json);
          return;
        }

        const text = await res.text();
        console.log('text!!!!!!!!!!!', text);
        const json = JSON.parse(text);
        console.log(
          'SIWE message received&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&@$#$##@%$%$%$##$:',
          json,
        );
        // setModalVisible(false);
        // setinitialconnectStatus(true)  //  blac or green
        // setHasAttemptedConnect(false)
        console.log("jsonn",typeof json.message);
        const siweMsg = json.message;
        siweMessageRef.current = siweMsg;   
console.log("Stored SIWE message:", siweMessageRef.current);

        // setSiweMessage(siweMsg);
        console.log('SendsiweMessage:', json.message);
        // console.log("SendsiweMessage type:",SendsiweMessage);
        setPhase('connectAndSign');
        await connectAndSign();
      }
    } catch (err) {
      if (err.message && err.message.includes('User rejected')) {
        console.warn('User Rejected :', err);
        sdk?.terminate();
        setHasAttemptedConnect(false);

        return;
      }
      setconnectStatus(false); //  write or wrong
      // setinitialconnectStatus(true)  //  black or green

      sdk?.terminate();
      console.warn('Connection failed:', err);
    }
  };

  const disconnect = async () => {
    try {
      await sdk?.terminate();
    } catch (err) {
      console.warn('Disconnection failed:', err);
    }
  };

  // Optional: Reconnect on resume
  const connectAndSign = async () => {
    // setIsSigningIn(true); ---------------commented out
//     const nonce = Math.random().toString(36).substring(2, 15);
// const issuedAt = new Date().toISOString();

// const message = `
// Ecostep wants you to sign in with your Ethereum account:

// Sign in with Ethereum to Ecostep.

// URI: http://ecostep.com
// Version: 1
// Chain ID: ${chainId}
// Nonce: ${nonce}
// Issued At: ${issuedAt}
// `;

    try {
      console.log('Connecting and signing with SIWE.43#@%%#%%%@%@#%..', typeof  siweMessageRef.current, siweMessageRef.current);

      const signature = await sdk.connectAndSign({msg:  siweMessageRef.current});
      setHasAttemptedSign(true);
      console.log("Signature received from MetaMask:", signature);

      const verifyRes = await fetch('http://192.168.1.4:3001/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message:  siweMessageRef.current, signature, deviceId}),
      });

      const {ok, address, accessToken, refreshToken} = await verifyRes.json();
      // setintialsiweStatus(true)  //  black or green
      // setinitialconnectStatus(true)
      // setIsSigningIn(true)    /// ------------

      if (ok && accessToken && refreshToken) {
        setIsSigningIn(true); /// ------------

        console.log('Login successful for', address);
        await Keychain.setGenericPassword(
          address, // username (optional)
          JSON.stringify({accessToken, refreshToken}), // password field as a JSON string
        );

        const credentials = await Keychain.getGenericPassword();

        if (credentials) {
          const {username, password} = credentials;
          const {accessToken, refreshToken} = JSON.parse(password);

          console.log('Retrieved from Keychain: after sign inmessage ', {
            address: username,
            accessToken,
            refreshToken,
          });
        } else {
          console.log('No credentials stored in Keychain.');
        }

        // setintialsiweStatus(true)  //  black or green

        setPhase('connect');
        // setSiweMessage(null);
        siweMessageRef.current = null;
        setTimeout(() => {
          setIsSigningIn(false);
          navigation.replace('Main');
        }, 3000);
      } else {
        console.warn('Verification failed:', {ok, accessToken, refreshToken});
        setIsSigningIn(false);
        setsiwestatus(false); //  write or wrong
        setPhase('connect');
        //  setinitialconnectStatus(true);  //  black or green

        sdk.terminate();
      }
    } catch (err) {
      if (err.message && err.message.includes('User rejected')) {
        console.warn('User Rejected :', err);
        //  setLoading(false) ==============
        setIsSigningIn(false);
        sdk?.terminate();
        return;
      }
        setIsSigningIn(false);

      console.log('Signing or verification failed:', err);
      setsiwestatus(false); //  write or wrong
      //  setinitialconnectStatus(true);  //  black or green

      setIsSigningIn(false);
      sdk.terminate();
    } 
    // finally {
    //   // setIsSigningIn(false);
    // }       ------------- commented out
  };

  // if (isSigningIn) {
  //  return  <ActivityIndicatorComponent />;
  // }

  const showModal = () => {
    // setinitialconnectStatus(false)
    console.log('Modal opening...');

    setHasAttemptedSign(false);
    setsiwestatus(false);

    translationY.value = withTiming(visiblePosition, {
      duration: 500,
      easing: Easing.out(Easing.exp),
      reduceMotion: ReduceMotion.Never,
    });
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        {/* <View style={styles.animation}> */}
        <LinearGradient
          colors={['#000000', '#0d0d0dff', '#1b3d1bff']}
          locations={[0, 0.6, 1]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.animation}>
          {/* <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        overScrollMode="never"
        bounces={false}
        style={styles.webview}
      /> */}

          <OrbitingCircles />

          <TouchableOpacity
            // onPress={() => setModalVisible(true)}
            onPress={showModal}
            disabled={connecting}
            style={styles.connectButton}
            activeOpacity={0.8}>
            <Text style={styles.connectText}>CONNECT</Text>
          </TouchableOpacity>

          {/* 
        {connected && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.address}>Chain ID: {chainId}</Text>
            <Text style={styles.address}>Account: {account}</Text>
            <Button title="Disconnect" onPress={disconnect} />
          </View>
        )} */}

          {/* <Modal style={styles.modal} visible={modalVisible} transparent animationType="slide"> */}
          {/* <ModalLoginScreen  
   initialconnectStatus={initialconnectStatus}
  intialsiweStatus={intialsiweStatus}
  connectStatus={connectStatus}
  siwestatus={siwestatus}
  phase={phase}
  modalizeRef={modalizeRef}
  connectAndSign={connectAndSign}
  connect={connect}/> */}

          <AuthenticateScreen
            // initialconnectStatus={initialconnectStatus}
            // intialsiweStatus={intialsiweStatus}
            isSigningIn={isSigningIn}
            connectStatus={connectStatus}
            phase={phase}
            modalizeRef={modalizeRef}
            connectAndSign={connectAndSign}
            connect={connect}
            translationY={translationY}
            height={height}
            visiblePosition={visiblePosition}
            hasAttemptedConnect={hasAttemptedConnect}
            openmetamask={openmetamask}
            retryAfter={retryAfter}
            setopenmetamask={setopenmetamask}
            setRetryAfter={setRetryAfter}
          />
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  walletRow: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  walletTextCol: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  address: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  animation: {
    flex: 1,
    position: 'relative',
  },
  chceckIcon: {
    marginRight: 10,
    alignSelf: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // width: 100,
    // height: 100,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',

    color: '#000',
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cancelBtn: {
    // marginTop: 20,
    alignSelf: 'flex-end',
  },
  walletText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  webview: {
    flex: 1,
  },
  cancelIcon: {
    // position: 'absolute',
  },
  cancelIconView: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cancelText: {
    fontSize: 19,
    color: '#000',
    fontWeight: '500',
  },
  signmsg: {
    fontSize: 19,
    color: '#000',
    fontWeight: '500',
  },
  connectwallet: {
    // alignSelf:"flex-start",
    fontSize: 20,
    color: '#000',
    fontWeight: '500',
  },
  walletGrid: {
    justifyContent: 'center',
    paddingVertical: 10,
    numColumns: 3,
  },

  walletIcon: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: 'black',
  },

  gridModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  walletGridItem: {
    width: 90,
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 12,
  },
  connectButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',

    paddingVertical: 12,
    paddingHorizontal: 39,
    borderRadius: 26,
    alignItems: 'center',
    marginVertical: 10,
    opacity: 1,
    // elevation: 99,
    zIndex: 20,
  },

  connectText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    // lineHeight: 76,
    letterSpacing: 0.5,
  },
});
