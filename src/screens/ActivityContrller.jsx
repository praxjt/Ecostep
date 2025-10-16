import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import ActivityRecognition from 'react-native-activity-recognition';
// console.log('ActivityRecognition:', ActivityRecognition);

import Geolocation from 'react-native-geolocation-service';
import {hasLocationPermission} from './LocationPermission';

console.log('Geolocation:', Geolocation);


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ActivityController() {
  const [showActionContainer, setShowActionContainer] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  // const [distanceKm, setDistanceKm] = useState(0);
  // const subscriptionRef = useRef(null);

  const activitySubRef = useRef(null);
  const startedRef = useRef(false);

  
  const startRecording = async () => {
    if (startedRef.current) {
      return;

    }
     const granted = await hasLocationPermission(); 
    if (!granted) {
      console.log('Location permission not granted');
      return;
    }

    console.log(' Location permission granted, ');
    startedRef.current = true;
     Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 } 
    );
  }

  return (
    <View style={styles.container}>
      {!showActionContainer && (
        <TouchableOpacity
          onPress={() => {
            setShowActionContainer(true);
            setIsPaused(false);
           startRecording();  //got errro "Could not invoke RNFusedLocation.getCurrentPosition
          }}
        >
          <FontAwesome name="play" size={30} color="white" />
        </TouchableOpacity>
      )}

      {showActionContainer && (
        <View style={styles.actionBox}>
          <TouchableOpacity onPress={() => {setIsPaused(!isPaused)
            console.log("pppppp")
          } }>
            <FontAwesome
              name={isPaused ? 'play' : 'pause'}
              size={30}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(`Save pressed. Distance:  km`);
              setShowActionContainer(false);
              setIsPaused(true);
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
