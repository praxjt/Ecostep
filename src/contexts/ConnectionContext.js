import React, { createContext, useContext, useState,useEffect } from 'react';

import {useSDK} from '@metamask/sdk-react-native';
import * as Keychain from 'react-native-keychain';



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
        await sdk.disconnect();
      }

      console.log('User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
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
    logout
     }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);
