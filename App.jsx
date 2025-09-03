
import React, { useEffect,useState,useRef } from 'react';
import {
  View,
  ActivityIndicator ,


  
} from 'react-native';
import { AppState } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import LandingScreen from './screens/LandingScreen'; 
import MainTabs from './screens/MainTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SiweMessage } from 'siwe';
import { NavigationContainer,createNavigationContainerRef  } from '@react-navigation/native';
import { useSDK } from '@metamask/sdk-react-native';
import { ConnectionProvider } from './contexts/ConnectionContext';
import { useConnection } from './contexts/ConnectionContext';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('LandingScreen:', LandingScreen);
console.log('MainTabs:', MainTabs);
const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();
export default function App() {


  const appState = useRef(AppState.currentState);
 const { sdk, connected, connecting, provider, chainId, account } = useSDK();


  // const { sdk, connected, connecting, provider, chainId, account } = useSDK();
  const sdkRef = useRef(sdk);
  const providerRef = useRef(provider);
 const [isAppReady, setIsAppReady] = useState(false);
   const [initialRoute, setInitialRoute] = useState(null);
   const [selectedAddress,setselectedAddress]=useState(null)
   const hasCheckedSession = useRef(false);
 const {
    setHasAttemptedConnect,
setconnectStatus ,
deviceId,



  } = useConnection();   
 
const loadWalletAddress = async () => {
  try {
    const address = await AsyncStorage.getItem('walletAddress');
    if (address) {
      console.log(' Retrieved wallet address:', address);
      return address;
    }
    return null;
  } catch (e) {
    console.error(' Failed to load wallet address:', e);
    return null;
  }
};

  useEffect(() => {
  const refreshTokenRequest = async (wallet, deviceId, oldRefreshToken) => {
console.log("  refresh-token is called")

  try {
    const res = await fetch('http://192.168.1.7:3001/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet,
        refreshToken: oldRefreshToken,
        deviceId,
      }),
    });
console.log("res!!!!!!!!! ",res)
 
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Refresh token request failed:', res.status, errorText);
      throw new Error('Failed to refresh token');
    }

    const result = await res.json();
    console.log(' Token refresh response:', result);

    const { accessToken, refreshToken } = result;
    if (!accessToken || !refreshToken) {
      throw new Error('Invalid token response from server');
    }

     await Keychain.setGenericPassword(wallet, JSON.stringify({
      accessToken,
      refreshToken,
    }));
    return { newAccessToken: accessToken, newRefreshToken: refreshToken };
  } catch (err) {
    console.error('Error refreshing token:', err);
    throw err;
  }
};


  

  const checkSession = async () => {
    if (!sdk ||!deviceId||hasCheckedSession.current) return;
hasCheckedSession.current = true;
    try {
    

      const creds = await Keychain.getGenericPassword();
      console.log("creds",creds)

       if (!creds) {
      console.log(" No stored tokens yet — skipping session check");
      SplashScreen.hide();
      setInitialRoute('Landing');
      return;
    }
console.log("creds",creds)
      const storedWallet = creds.username;

      const { accessToken, refreshToken } = JSON.parse(creds.password);
      console.log("refreshed token sent when we accestoken is ",refreshToken)
const retrivedAddress= await loadWalletAddress()
console.log("retrivedAddress",retrivedAddress)
     if (!retrivedAddress || storedWallet !== retrivedAddress) {
  console.log('Wallet mismatch — aborting session check',storedWallet);

  throw new Error('Wallet mismatch — aborting session check',storedWallet);
}
      const res = await fetch('http://192.168.1.7:3001/login', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-device-id': deviceId,
          'x-user-address': retrivedAddress,
        },
      });

      if (res.ok) {
        console.log('Session active — setting route to Main');
        setInitialRoute('Main');
      } else if (res.status === 401) {
         const body = await res.json();
  console.log (body.error,'Access token expired')
        console.log(' Token expired, attempting refresh...');
        try {
          // const newAccessToken = await refreshTokenRequest(storedWallet.toLowerCase(), deviceId, refreshToken);
const { newAccessToken,
   newRefreshToken } = await refreshTokenRequest(
      storedWallet,
      deviceId,
      refreshToken
    );

          const retryRes = await fetch('http://192.168.1.7:3001/login', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'x-device-id': deviceId,
              'x-user-address': retrivedAddress,
            },
          });
console.log("efewfw",retryRes)
          if (retryRes.ok) {
            console.log(' Session active after refresh');
            setInitialRoute('Main');
          } else {
            console.log('Invalid even after refresh');
            setInitialRoute('Landing');
             await sdk?.terminate();
              await AsyncStorage.removeItem('walletAddress');
  await Keychain.resetGenericPassword?.();

          }
        } catch (refreshError) {
          console.warn(' Refresh failed:', refreshError);
          setInitialRoute('Landing');
        }
      } else {
           console.log(' res',res);
        setInitialRoute('Landing');
      }
    } catch (err) {
      if (err.message?.includes('User rejected')) {
        console.warn('User Rejected:', err);
        sdk?.terminate();
        setHasAttemptedConnect(false);
        return;
      }
  sdk?.terminate();
      console.error(' Session check failed:', err);
      // setconnectStatus(false);
      // setHasAttemptedConnect(true);
      setInitialRoute('Landing');
    } finally {
      SplashScreen.hide();
    }
  };

  if (sdk &&deviceId) {
    setTimeout(checkSession, 100);
  }
}, [sdk,deviceId]);

  if (!initialRoute) {
    console.log("app is not ready spin|||");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

async function getSafeDeviceId() {
  try {
    return await DeviceInfo.getUniqueId();
  } catch (err) {
    console.warn(' Could not get device ID:', err);
    return null;
  }
}
  return ( 
    //  <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="Landing" component={LandingScreen} />
    //   <Stack.Screen name="Main" component={MainTabs} />
    // </Stack.Navigator>
     <NavigationContainer >
 <Stack.Navigator  initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
 
      <Stack.Screen name="Landing" component={LandingScreen} />

      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
     </NavigationContainer>
  )
}
