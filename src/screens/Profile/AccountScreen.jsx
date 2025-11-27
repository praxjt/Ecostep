import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
export default function HomeScreen() {

    const data = [
    { value: 20 },
    { value: 45 },
    { value: 30 },
    { value: 60 },
  ];

  const xLabels = ['Mon', 'Tue', 'Wed', 'Thu'];



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <BarChart
        data={data}
        xAxisLabelTexts={xLabels}
        xAxisLabelTextStyle={{ color: 'gray', fontSize: 12 }}
        barWidth={30}
        spacing={20}
        yAxisLabelTexts={['0', '20', '40', '60']}
      />
    </View>
  );
}
