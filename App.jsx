
import  { useEffect,useState,useRef } from 'react';
import {
  View,
  ActivityIndicator ,
} from 'react-native';
import { AppState } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import LandingScreen from './src/screens/Authentication/LandingScreen'; 
import { ToastProviderWithViewport } from './components/toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainTabs from './src/Navigation/MainTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SiweMessage } from 'siwe';
import { NavigationContainer,createNavigationContainerRef  } from '@react-navigation/native';
import { useSDK } from '@metamask/sdk-react-native';
import { ConnectionProvider } from './src/contexts/ConnectionContext';
import { useConnection } from './src/contexts/ConnectionContext';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicatorComponent from './src/components/ActivityIndicator';
// import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('LandingScreen:', LandingScreen);
console.log('MainTabs:', MainTabs);
const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();
export default function App() {


  const appState = useRef(AppState.currentState);
 const { sdk, connected, connecting, provider, chainId, account ,accessToken,wallet } = useConnection();


  const sdkRef = useRef(sdk);
  const providerRef = useRef(provider);
 const [isAppReady, setIsAppReady] = useState(false);
   const [initialRoute, setInitialRoute] = useState(null);
   const [selectedAddress,setselectedAddress]=useState(null)
   const hasCheckedSession = useRef(false);

const [refreshToken, setRefreshToken] = useState(null);
 const {
    setHasAttemptedConnect,
setconnectStatus ,




  } = useConnection();   
 

  useEffect(() => {
  //  const runCheck = async () => {
  //   try {
  //     console.log("checkSession started");
  //     const creds = await Keychain.getGenericPassword({ service:'tokens'});
  //     // console.log("creds33", creds);

  //     if (!creds) {
  //       console.log("No stored tokens, going to Landing");
  //       setInitialRoute("Landing");
  //       return;
  //     }

  //   } catch(e) {
  //     console.error("checkSession error:", e);
  //     setInitialRoute("Landing");
  //   } finally {
  //     SplashScreen.hide();
  //   }
  // };

  // runCheck(); --commented to test



    SplashScreen.hide();

  
  const checkSession = async () => {

    console.log("checkSession is called ")
    if ( hasCheckedSession.current) return;
hasCheckedSession.current = true;
    try {
    

      const creds = await Keychain.getGenericPassword({service:'tokens'});

 

       if (!creds) {
      console.log(" No stored tokens yet — skipping session check");
      SplashScreen.hide();
      setInitialRoute('Landing');     


      return;
    }

console.log("creds",creds)
      // const storedWallet = creds.username;
         const {username, password} = creds;

      const { accessToken, refreshToken } = JSON.parse(password);
      console.log("refreshed token sent when we accestoken is ",refreshToken)

//      if (!retrivedAddress || storedWallet !== retrivedAddress) {
//   console.log('Wallet mismatch — aborting session check',storedWallet);

//   throw new Error('Wallet mismatch — aborting session check',storedWallet);
// }

      const res = await fetch('http://192.168.1.12:3001/login', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-user-address': username,
        },
      });

      if (res.ok) {
        console.log('Session active — setting route to Main');
        setInitialRoute('Main');
      } else if (res.status === 401) {
         const body = await res.json();
  console.log ('Access token expired',body.error,)
        console.log(' Token expired, attempting refresh...');
        try{
          // const newAccessToken = await refreshTokenRequest(storedWallet.toLowerCase(), deviceId, refreshToken);

          const latestCreds = await Keychain.getGenericPassword({ service: 'tokens' });
if (!latestCreds) {
  console.log('No stored tokens for refresh');
  setInitialRoute('Landing');
  return;
}
const { username: latestUsername, password: latestPassword } = latestCreds;
const { refreshToken: latestRefreshToken } = JSON.parse(latestPassword);

const { newAccessToken,newRefreshToken } = await refreshTokenRequest(
  latestUsername, latestRefreshToken
);

          const retryRes = await fetch('http://192.168.1.12:3001/login', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'x-user-address': latestUsername,
            },
          });
console.log("retryRes",retryRes)
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
      // if (err.message?.includes('User rejected')) {   --commented to test 
      //   console.warn('User Rejected:', err);
      //   sdk?.terminate();
      //   setHasAttemptedConnect(false);
      //   return;
      // }
  // sdk?.terminate();
      console.error(' Session check failed:', err);
      // setconnectStatus(false);
      // setHasAttemptedConnect(true);
      setInitialRoute('Landing');
    } finally {
      SplashScreen.hide();
    }
  };

  // if (sdk ) {
    // setTimeout(checkSession, 100); --commented to test
    checkSession();
  // }
}, [accessToken,wallet]);

  const refreshTokenRequest = async (wallet, oldRefreshToken) => {
console.log("refresh-token is called")

  try {
    const res = await fetch('http://192.168.1.12:3001/refreshtoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet,
        refreshToken: oldRefreshToken,
        // role:"USER"
        
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
    console.log("accessToken,refreshToken",accessToken,refreshToken)
    if (!accessToken || !refreshToken) {
      throw new Error('Invalid token response from server');
    }
//Access Token --short lived
//Refresh Token --long lived
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


  if (!initialRoute) {  //this condition  solved the  issue of 
    console.log("app is not ready spin|||");
    return (
    
      <ActivityIndicatorComponent color="#ffffffff" />   
    );
  }


  return ( 
 
    // <ConnectionProvider>
     <NavigationContainer ref={navigationRef} >
      <SafeAreaProvider>
      <ToastProviderWithViewport>
 <Stack.Navigator  initialRouteName={initialRoute}  screenOptions={{ headerShown: false }}>
 
      <Stack.Screen name="Landing" component={LandingScreen} />

      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
    </ToastProviderWithViewport>
    </SafeAreaProvider>
     </NavigationContainer>
    // </ConnectionProvider>

  )
}
