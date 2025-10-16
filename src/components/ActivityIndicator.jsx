import {  View,
  Text,
  Button,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
}  from 'react-native'; 
export default function ActivityIndicatorComponent({color}) {
       return (
     <View style={{
      height: "100%",
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}