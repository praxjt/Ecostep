import React,{useState,useEffect,useCallback, useMemo, useRef} from 'react';
import { View, Text, StyleSheet, Pressable,Modal,TextInput, Button, Alert,Dimensions,ScrollView } from 'react-native';  
import { TouchableOpacity } from 'react-native-gesture-handler';
 import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  ReduceMotion,
  runOnJS,
  
} from 'react-native-reanimated';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import FAB from '@fengzie/react-native-animated-fab';
import DynamicForm from '@coffeebeanslabs/react-native-form-builder';

// import ModalLoginScratch from '../';  
const { height,width } = Dimensions.get('window');

// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import BottomsheetFormModal from './BottomSheetFormModal';

const ExporeScreen =()=>{

    
    const translationY = useSharedValue(height );
        const modalHeight = height * 0.5;
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
    setModalVisible(true);

    translationY.value = withTiming(visiblePosition, {
      duration: 500,
      easing: Easing.out(Easing.exp),
      reduceMotion: ReduceMotion.Never,
    });
  };
  const hideModal = () => {
  translationY.value = withTiming(height, {
    duration: 500,
    easing: Easing.in(Easing.exp),
  }, () => {
  runOnJS(setModalVisible)(false);});
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
      {modalVisible && (
          <>
          <Pressable style={styles.overlay} onPress={hideModal} /> 
      <BottomsheetFormModal  
       translationY={translationY}
        visiblePosition={visiblePosition}
        modalHeight={modalHeight}
        />
        </>
      )}
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
     overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(128,128,128,0.5)"
},
  text:{
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "black",

  },

  modalBackground: {
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
    backgroundColor: "#fff",
    color: "#000",
    width: width * 0.7,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

});