import React, { createContext, useContext, useState,useEffect } from 'react';
import {getUniqueId} from 'react-native-device-info';

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
 const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);
const [connectStatus ,setconnectStatus ] = useState(false);   // write or wrong

const [hasAttemptedSign, setHasAttemptedSign] = useState(false);

const [siwestatus,setsiwestatus]= useState(false); //    write or wrong
const [deviceId,setdeviceId]=useState(null)
   const [selectedAddress,setselectedAddress]=useState(null)


useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getUniqueId();
      setdeviceId(id);
      console.log("📱 Device ID:", id);
    };

    fetchDeviceId();
  }, []);
  return (
    <ConnectionContext.Provider value={{ hasAttemptedConnect,
     setHasAttemptedConnect,
     connectStatus,
     setconnectStatus,hasAttemptedSign,
     setHasAttemptedSign,siwestatus,
     setsiwestatus,deviceId ,
     selectedAddress,
     setselectedAddress,
     }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);
