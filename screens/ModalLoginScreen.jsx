import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform, 
} from 'react-native';
import {
  isStepCountingSupported,
  parseStepData,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';
// import Geolocation from '@react-native-community/geolocation';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ActivityController({onError}) {
  const [showActionContainer, setshowActionContainer] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
     const [isSupported, setIsSupported] = useState(null);
      const [stepCount, setStepCount] = useState(0);
        const [distanceKm, setDistanceKm] = useState(0);
      const [error, setError] = useState(null);
      
  // const [distanceKm, setDistanceKm] = useState(0);
  // async function cols() {
  //       const supported =await isStepCountingSupported()
  //       console.log('supported',supported);
    
  // } 
  // cols()
  
const reqPermissison  = async () => {

try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION)

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('permissions granted',granted);
      return true;
    } else {
      console.log('permissions denied', granted); //LOG  permissions denied never_ask_again
      return false;
    }
  } catch (err) {
    console.warn(err);

    return false;
  }
}

    useEffect(()=>{
    const checkSupport = async () => {
    const supported = await isStepCountingSupported();
    console.log('supported', supported);
    setIsSupported(supported);
  };
  checkSupport();
      return () => {
  stopStepCounterUpdate();
};

    },[])
async function startStepCounter() {
  const ok= await  reqPermissison();
        if(!ok){
        onError("Permission denied");
        setIsSupported(false)
        return;
      }

        const supported =await isStepCountingSupported() 
        console.log('supported',supported);// {"granted": true, "supported": true, "working": true}
        if(!supported){
            onError('App is not supported!');
               setIsSupported(false);
              return;
        }
     
        
 onError('');
            setshowActionContainer(true);
 setIsSupported(true);
            setIsPaused(false);

   startStepCounterUpdate(new Date(), (data) => {
    console.debug(parseStepData(data));
    setStepCount(data.steps);
  });
        }
    


  return (
    <View style={styles.container}>
      { (!isSupported || !showActionContainer) && (
        <TouchableOpacity
          onPress={startStepCounter}
        >
          <FontAwesome name="play" size={30} color="white" />
        </TouchableOpacity>
      )}

      {isSupported && showActionContainer && (
        <View style={styles.actionBox}>
          <TouchableOpacity onPress={() => setIsPaused(prev => !prev)}>
            <FontAwesome name={isPaused ? 'play' : 'pause'} size={30} color="white" />
          </TouchableOpacity>
        


          <TouchableOpacity
            onPress={() => {
              console.log('Save pressed');
              setshowActionContainer(false);
              setIsPaused(true);
               console.log('Steps:', stepCount, 'Distance (km):', distanceKm);
              stopStepCounterUpdate();
            }}
          >
            <FontAwesome name="save" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  pauseContainer: { marginTop: 70 },
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 36,
    paddingVertical: 10,
    marginTop: 10,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
});
