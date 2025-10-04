
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
  
} from 'react-native-reanimated';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import FAB from '@fengzie/react-native-animated-fab';
import DynamicForm from '@coffeebeanslabs/react-native-form-builder';

import ModalLoginScratch from '../../components/ModalLoginScratch';  
const { height,width } = Dimensions.get('window');

const BottomsheetFormModal = ({translationY, visiblePosition, modalHeight }) => {

    
      const [modalVisible, setModalVisible] = useState(false);
      const [companyName, setCompanyName] = useState('');
       const [co2Amount, setCo2Amount] = useState('');
         const [Email, setEmail] = useState('');
       const [price, setPrice] = useState('');
        const MIN_PRICE = '10';
    
     const formTemplate = {
        data: []
     }






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


    return (
          <ModalLoginScratch 
              translationY={translationY}
              visiblePosition={visiblePosition}
              modalHeight = {modalHeight}
              draggable={false}
              >
          
                
                    <ScrollView
             contentContainerStyle={[styles.modalBackground, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled" 
          >
              {/* <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{borderTopLeftRadius:20,borderTopRightRadius:20,}}
              > */}
                
           
                    {/* <Text style={styles.modalTitle}>Invest Now</Text> */}
        
                    <Text style={styles.text}>Company Name:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Company Name"
                      placeholderTextColor="#888" 
                      value={companyName}
                       multiline={false}
                        scrollEnabled={true}
                      onChangeText={setCompanyName}
                    />
                      <Text style={styles.text}>Email:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#888" 
                      value={Email}
                       multiline={false}
                        scrollEnabled={true}
                      onChangeText={setCompanyName}
                    />
        
                    <Text style={styles.text}>Enter Target to Offset in grams(g):</Text>
                    <TextInput
                    style={[styles.input]}
                    placeholder="100"
                    placeholderTextColor="#888" 
                    keyboardType="numeric"
                    onChangeText={setCo2Amount}
                    value={co2Amount}
                    />
        
                    <Text style={styles.text}>Price per CO₂ Unit:</Text>
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
                    </ScrollView>
        {/* </BottomSheetScrollView> */}
        
        
              {/* </BottomSheet> */}
              </ModalLoginScratch>
              
            
    )
}
export default BottomsheetFormModal;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    // padding: 16,

  },
  buttonContainer:{
 flex: 1,
   
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