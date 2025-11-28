import React, { createContext, useContext, useState,useEffect } from 'react';

import {useSDK} from '@metamask/sdk-react-native';
import * as Keychain from 'react-native-keychain';
import { navigationRef } from '../../App';
import { View ,Text} from 'react-native';
import SpinnerButton from "react-native-spinner-button";



const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
    const { sdk, connected, connecting, provider, chainId, account } = useSDK();

 const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);
const [connectStatus ,setconnectStatus ] = useState(false);   // write or wrong

const [hasAttemptedSign, setHasAttemptedSign] = useState(false);

const [siwestatus,setsiwestatus]= useState(null); //    write or wrong
   const [selectedAddress,setselectedAddress]=useState(null)

 const [accessToken, setAccessToken] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
    const loadTokens = async () => {
      try {
        const creds = await Keychain.getGenericPassword({ service: 'tokens' });
        if (creds) {
          const { username, password } = creds;
          const { accessToken, refreshToken } = JSON.parse(password);
          console.log("tokens stored successfully!!!!!!!!!!!!!!!!",accessToken)
          setAccessToken(accessToken);
          setWallet(username); // wallet address
        }
      } catch (err) {
        console.warn('Error loading tokens from Keychain:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTokens();
  }, []);

  const logout = async () => {
    console.log("loggdout")
    try {
      await Keychain.resetGenericPassword({ service: 'tokens' });

      setAccessToken(null);
      setWallet(null);
      setselectedAddress(null);
      setconnectStatus(false);
      setHasAttemptedConnect(false);
      setHasAttemptedSign(false);
      setsiwestatus(false);

      if (connected && sdk) {
  sdk?.terminate();

      }
       if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      });
    }

      console.log('User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
 if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SpinnerButton
        // animationType="default"
        animatedDuration={500}
        rippleColor="rgba(255,255,255,0.3)"
        spinnerColor="#AAAAAA"
        // SpinnerType ="UIActivityIndicator"
        isLoading={true}
        onPress={()=>{}}
        buttonStyle={{
          paddingHorizontal:25,
          paddingVertical:12,
          borderRadius:10
        }}
      >
      </SpinnerButton> 
    </View>
  );
}


  return (
    <ConnectionContext.Provider value={{
       sdk,
        provider,
        connected,
        connecting,
        chainId,
        account,
         hasAttemptedConnect,
     setHasAttemptedConnect,
     connectStatus,
     setconnectStatus,
     hasAttemptedSign,
     setHasAttemptedSign,
     siwestatus,
     setsiwestatus,
     selectedAddress,
     setselectedAddress,

     accessToken, 
     wallet, 
     loading,
    logout,
    setAccessToken,
    setWallet,
     }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);
