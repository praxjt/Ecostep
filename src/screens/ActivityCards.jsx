import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const data = [
    {
    type: 'Walking',
    icon: 'directions-walk',
    iconLib: 'MaterialIcons',
    co2: '0 gCO2',
    co2Color: 'black',
    time: '30m',
    distance: '2.5 km',
  },
  {
    type: 'Cycling',
    icon: 'bicycle',
    iconLib: 'FontAwesome',
    co2: '0 gCO2',
    co2Color: 'black',
    time: '1h 23m',
    distance: '15 km',
  },
  {
    type: 'MotorBike',
    icon: 'motorcycle',
    iconLib: 'FontAwesome',
    co2: '0 gCO2',
    co2Color: 'black',
    time: '1h 23m',
    distance: '15 km',
  },
  {
    type: 'Diesel car',
    icon: 'car',
    iconLib: 'FontAwesome',
    co2: '924.4 gCO2',
    co2Color: 'black',
    time: '35m',
    distance: '98.3 km',
  },

  {
    type: 'Train',
    icon: 'train',
    iconLib: 'FontAwesome',
    co2: '102.1 gCO2',
    co2Color: 'black',
    time: '45m',
    distance: '30 km',
  },
];

const Card = ({ item }) => {
  const IconComponent = item.iconLib === 'MaterialIcons' ? MaterialIcons : FontAwesome;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
         <View style={styles.iconWrapper}>
    <IconComponent name={item.icon} size={20} color="black" />
  </View>
        <Text style={styles.cardTitle}>{item.type}</Text>
      </View>

      <Text style={[styles.co2Text, { color: item.co2Color }]}>{item.co2}</Text>

      <View style={styles.metaRow}>
        <FontAwesome name="clock-o" size={12} color="#888" />
        <Text style={styles.metaText}>{item.time}</Text>
      </View>
      <View style={styles.metaRow}>
        <FontAwesome name="road" size={12} color="#888" />
        <Text style={styles.metaText}>{item.distance}</Text>
      </View>
    </View>
  );
};

const TransportCards = () => {
  return (
    <View style={{ height: 200 }}>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.type}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <Card item={item} />}
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  card: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  iconWrapper: {
  backgroundColor: 'limegreen',
  borderRadius: 20,
  padding: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  co2Text: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
});

export default TransportCards;
