import React,{useState,useEffect,useCallback, useMemo, useRef} from 'react';
import { View, Text, StyleSheet, Pressable,Modal,TextInput, Button, Alert,Dimensions } from 'react-native';  
import { TouchableOpacity } from 'react-native-gesture-handler';
 import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  ReduceMotion,
  
} from 'react-native-reanimated';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import FAB from '@fengzie/react-native-animated-fab';
import DynamicForm from '@coffeebeanslabs/react-native-form-builder';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalLoginScratch from './ModalLoginScratch';  
const { height } = Dimensions.get('window');

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';


const ExporeScreen =()=>{

const translationY = useSharedValue(height );
    const modalHeight = height * 0.6;
 const visiblePosition =3; 


  const [modalVisible, setModalVisible] = useState(false);
  const [companyName, setCompanyName] = useState('');
   const [co2Amount, setCo2Amount] = useState('100');
   const [price, setPrice] = useState('');
    const MIN_PRICE = '10';

 const formTemplate = {
    data: []
 }


  const showModal = () => {
    // setinitialconnectStatus(false)

    translationY.value = withTiming(visiblePosition, {
      duration: 500,
      easing: Easing.out(Easing.exp),
      reduceMotion: ReduceMotion.Never,
    });
  };




  const handleSubmit = () => {
    if (Number(price) < MIN_PRICE) {
      Alert.alert(`Price must be at least ${MIN_PRICE}`);
      return;
    }
    console.log({ companyName, co2Amount, price });
    setModalVisible(false);
    setCompanyName('');
    setPrice('');
  };

    return(
       <SafeAreaView style={styles.container}>
         <View style={styles.buttonContainer}>
            {/* <Pressable onPress={() =>  setModalVisible(true)}  style={({ pressed }) => [
            styles.floatingButton,
            pressed && { backgroundColor: 'darkgreen' }]} >    

            <Icon   name="plus" size={40} color="black" />
    </Pressable> */}
     <FAB
        renderSize={60}
        borderRadius={30}
          tintColor="black"  
        backgroundColor= "limegreen"
         activeOpacity={0.8}
        onPress={showModal}
      />
    </View>
      <ModalLoginScratch 
      translationY={translationY}
      visiblePosition={visiblePosition}
      modalHeight = {600}
      >
          <View style={styles.horzline}></View>
        
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Company Info</Text>

            <Text>Company Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
            />

            <Text>Target CO₂ Offset (GCO₂):</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#eee' }]}
              value={co2Amount}
              editable={false} 
            />

            <Text>Price per CO₂ Unit:</Text>
            <TextInput
              style={styles.input}
              placeholder={`Min ${MIN_PRICE}`}
              value={price}
              keyboardType="numeric"
              onChangeText={setPrice}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </View>

      </ModalLoginScratch>
      
      
        </SafeAreaView>
    )
}
export default ExporeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    // padding: 16,

  },
  buttonContainer:{
 flex: 1,
   
  },
  modalBackground: {
    flex:1,
    justifyContent: "flex-end",
     backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,

  },
  horzline:{
        width:90,
        height:5,
        backgroundColor:"grey",
alignSelf:"center",
marginTop:4,
marginBottom:9,
borderRadius:15,
    },
   floatingButton: {
   backgroundColor: 'green',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    
   },
   modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "white",
    color: "black",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

});