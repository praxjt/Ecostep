import { PermissionsAndroid, Platform } from 'react-native';

export async function hasLocationPermission() {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'App needs access to your location for fitness tracking.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    return status === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn('Error checking location permission:', error);
    return false;
  }
}
