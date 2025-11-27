import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CurrentStatus({ distance = 0 , date = '',sessionCo2Kg=0.0 }) {
  return (
    <View style={styles.lastActivityBox}>
      <View style={styles.lastActivityRow}>
        <View style={styles.lastActivityColumn}>
          <Text style={styles.label}>Last Activity</Text>
          <Text style={styles.value}>{sessionCo2Kg.toFixed(1)} kg</Text>
        </View>

        <View style={styles.lastActivityColumn}>
          {/* <Text style={styles.label}>Date</Text> */}
          <Text style={styles.label}>{date}</Text>
          <Text style={styles.value}>{distance} km</Text>

          {/* <Text style={styles.subValue}>km walked</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lastActivityBox: {
    marginTop: 20,
    padding: 16,
    // backgroundColor: '#333',
    borderRadius: 12,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
  },
  lastActivityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastActivityColumn: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: '#aaa',
    fontSize: 19,
  },
  value: {
    color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
  },
  subValue: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
});
