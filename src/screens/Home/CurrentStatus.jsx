import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CurrentStatus({ distance = 0 ,  }) {
  return (
    <View style={styles.lastActivityBox}>
      <View style={styles.lastActivityRow}>
        <View style={styles.lastActivityColumn}>
          <Text style={styles.value}>{distance} km</Text>
          <Text style={styles.label}>Distance</Text>

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
    fontSize: 14,
  },
  value: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subValue: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
});
