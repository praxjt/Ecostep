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
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ActivityController() {
  const [showActionContainer, setShowActionContainer] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  // const [distanceKm, setDistanceKm] = useState(0);
  // const subscriptionRef = useRef(null);

  // Permission request for Android
//   useEffect(() => {
//   let subscription;

//   const startActivityDetection = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ]);

//       if (
//         granted[PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION] !== PermissionsAndroid.RESULTS.GRANTED ||
//         granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         console.warn('Activity or location permission not granted');
//         return;
//       }
//     }

//     console.log('▶ Starting activity detection...');
//     await ActivityRecognition.start(1000);
//     // await ActivityRecognition.startMocked(1000,true);
//   if (subscription) {
//     subscription.remove();
//   }
//     subscription = ActivityRecognition.subscribe(activities => {
//       console.log('Raw activities:', activities);
// if (!activities || activities.length === 0) {
//     console.warn('No activities detected yet');
//     return;
//   }
// const probable = activities[0]||{}
//   console.log('Most probable:', probable,probable?.type);

//   if (probable?.type === ActivityRecognition.ANDROID_IN_VEHICLE) {
//     console.log('🚗 User is in a vehicle');
//   }    });
//   };

//   startActivityDetection();

//   return () => {
//     subscription?.remove?.();
//     ActivityRecognition.stop();
//   };
// }, []);

  return (
    <View style={styles.container}>
      {!showActionContainer && (
        <TouchableOpacity
          onPress={() => {
            setShowActionContainer(true);
            setIsPaused(false);
          }}
        >
          <FontAwesome name="play" size={30} color="white" />
        </TouchableOpacity>
      )}

      {showActionContainer && (
        <View style={styles.actionBox}>
          <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
            <FontAwesome
              name={isPaused ? 'play' : 'pause'}
              size={30}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(`Save pressed. Distance: ${distanceKm.toFixed(2)} km`);
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
