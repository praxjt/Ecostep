import React,{useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActivityIndicatorComponent from './ActivityIndicator';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  Image,
  
  

} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';

import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
const { height } = Dimensions.get('window');
import { useConnection } from '../contexts/ConnectionContext';
export default function ModalLoginScratch({ translationY, visiblePosition, children, modalHeight }) 
  
  {
  const prevTranslationY = useSharedValue(0);
  const hiddenPosition = height; 

 
const pan = Gesture.Pan()
    .minDistance(9)
    .onStart(() => {
      prevTranslationY.value = translationY.value;
    })
.onUpdate((event) => {
  const nextPos = prevTranslationY.value + event.translationY;

  const clampedNextPos = Math.max(visiblePosition, Math.min(nextPos, hiddenPosition));

  translationY.value = clampedNextPos;   
    
    }).onEnd(() => {
    if (translationY.value > visiblePosition) {
      translationY.value = withSpring(hiddenPosition);
    } else {
      translationY.value = withSpring(visiblePosition);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translationY.value }],
  }));


//       const wallets = [
//     // { name: 'MetaMask', id: 'metamask', icon: require('./assets/metamskback.png') },
//     { name: 'MetaMask', id: 'metamask', icon: 'https://i.postimg.cc/jd4MxPHL/metamaskback.png' },

   
//   ];
//    const {
// hasAttemptedConnect,
// setHasAttemptedConnect,
//    connectStatus,
//    setconnectStatus ,
//    hasAttemptedSign,
//    setHasAttemptedSign,
//    siwestatus,
//    setsiwestatus
//      } = useConnection();   

//      useEffect(()=>{
//        if (retryAfter === null) return;
//          if (retryAfter <= 0) {
//     setopenmetamask(true);
//     setRetryAfter(null);
//     return;

//   }
// const timer = setInterval(() => {
//     setRetryAfter(prev => prev - 1);
//   }, 1000);
//    return () => clearInterval(timer);
//      }, [retryAfter])
  return (
    <View  >


    <GestureDetector gesture={pan}>
     
        <Animated.View style={[styles.bottommodal,{height:modalHeight}, animatedStyle]}>
          
                      
                      <View style={styles.modalContent}>
                {children}
                      </View>

        </Animated.View>

    </GestureDetector>
    </View>

  );
}

const styles = StyleSheet.create({
    bottommodal:{
width:'100%',
// backgroundColor:"white",
position:'absolute',
bottom:0,
margin:0,
padding:0,
zIndex:30,

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
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    justifyContent: 'flex-end',
  },
  connectButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 26,
    zIndex: 20,
  },
  connectText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },





modalContent: {
   flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  paddingTop:0,
  width: '100%',
  alignItems: 'center',
},

});
