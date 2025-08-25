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

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActivityRecognition from 'react-native-activity-recognition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ActivityController() {
  const [showActionContainer, setshowActionContainer] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [distanceKm, setDistanceKm] = useState(0);

  const activitySubRef = useRef(null);
  const startedRef = useRef(false);

  const requestActivityPermissions = async () => {
    if (Platform.OS !== 'android') {
      console.warn('Activity Recognition is Android-only');
      return false;
    }

    const permissions = [];

    if (PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION);
    }

    if (PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }

    if (permissions.length === 0) return true;

    const results = await PermissionsAndroid.requestMultiple(permissions);
    const grantedAll = Object.values(results).every(
      r => r === PermissionsAndroid.RESULTS.GRANTED
    );
    return grantedAll;
  };

  const startRecording = async () => {
    if (startedRef.current) {
      return;
    }

    const granted = await requestActivityPermissions();
    if (!granted) {
      console.warn('Required permissions not granted');
      return;
    }

    try {
      console.log('Starting activity recognition...');
      ActivityRecognition.start(1000); // every 1 sec
      startedRef.current = true;

      const sub = DeviceEventEmitter.addListener('activity', activity => {
        console.log('Detected activity:', activity);
        if (activity?.type === 'WALKING' && activity?.confidence > 70) {
          setDistanceKm(prev => {
            const next = prev + 0.01;
            console.log(
              `Walking detected (${activity.confidence}%). Distance: ${next.toFixed(2)} km`
            );
            return next;
          });
        }
      });

      activitySubRef.current = sub; // sub has .remove()
    } catch (e) {
      console.warn('Failed to start activity recognition:', e);
      // Fallback for testing without native deps:
      // ActivityRecognition.startMocked && ActivityRecognition.startMocked(1000);
    }
  };

  const stopRecording = () => {
    if (!startedRef.current) return;

    try {
      console.log('Stopping activity recognition...');
      ActivityRecognition.stop();
    } catch (e) {
      console.warn('Failed to stop activity recognition:', e);
    }

    try {
      activitySubRef.current?.remove?.();
    } catch (e) {
      console.warn('Listener removal failed (ignored):', e?.message);
    }

    activitySubRef.current = null;
    startedRef.current = false;
  };

  useEffect(() => {
    if (!isPaused) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => stopRecording();
  }, [isPaused]);

  return (
    <View style={styles.container}>
      {!showActionContainer && (
        <TouchableOpacity
          onPress={() => {
            setshowActionContainer(true);
            setIsPaused(false);
          }}
        >
          <FontAwesome name="play" size={30} color="white" />
        </TouchableOpacity>
      )}

      {showActionContainer && (
        <View style={styles.actionBox}>
          <TouchableOpacity onPress={() => setIsPaused(prev => !prev)}>
            <FontAwesome name={isPaused ? 'play' : 'pause'} size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log('Save pressed');
              setshowActionContainer(false);
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
