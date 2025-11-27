import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActivityIndicatorComponent from '../../components/ActivityIndicator';
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
const {height} = Dimensions.get('window');
import {useConnection} from '../../contexts/ConnectionContext';
import ModalLoginScratch from '../../components/ModalLoginScratch';
import SpinnerButton from "react-native-spinner-button";

export default function AuthenticateScreen({
  // initialconnectStatus,
  // intialsiweStatus,
  isSigningIn,
  phase,
  modalizeRef,
  connect,
  connectAndSign,
  translationY,
  height,
  visiblePosition,
  openmetamask,
  retryAfter,
  setopenmetamask,
  setRetryAfter,
}) {
  const wallets = [
    // { name: 'MetaMask', id: 'metamask', icon: require('./assets/metamskback.png') },
    {
      name: 'MetaMask',
      id: 'metamask',
      icon: 'https://i.postimg.cc/jd4MxPHL/metamaskback.png',
    },
  ];
  const {
    hasAttemptedConnect,
    setHasAttemptedConnect,
    connectStatus,
    setconnectStatus,
    hasAttemptedSign,
    setHasAttemptedSign,
    siwestatus,
    setsiwestatus,
  } = useConnection();
console.log("connectStatus,siwestatus,hasAttemptedSign:",connectStatus,siwestatus,hasAttemptedSign);

  useEffect(() => {

    if (retryAfter === null) return;
    if (retryAfter <= 0) {
      setopenmetamask(true);
      setRetryAfter(null);
      return;
    }
    const timer = setInterval(() => {
      setRetryAfter(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAfter]);
const signComplete = connectStatus && siwestatus && hasAttemptedSign;

  return (
    <ModalLoginScratch
      translationY={translationY}
      visiblePosition={visiblePosition}
      modalHeight={300}
      draggable={true}>
      <View style={styles.horzline}></View>

      {/* <TouchableOpacity
                           
                           style={styles.cancelBtn}
                         >
                        
                         <View style={styles.cancelIconView}>
               <Icon style={styles.cancelIcon} name="close" size={34} color="black" />
           
                         </View>
           
                         </TouchableOpacity> */}
      {isSigningIn ? 
      // (
        // <ActivityIndicatorComponent />
{/* <SpinnerButton
  animationType="ripple-effect"
  animatedDuration={500}
  rippleColor="rgba(255,255,255,0.3)"
  spinnerColor="white"
  isLoading={true}
  buttonStyle={{
    backgroundColor:"#893346",
    paddingHorizontal:25,
    paddingVertical:12,
    borderRadius:10
  }}
>
  {/* <Text style={{color:"white", fontSize:17}}>Connecting...</Text> 
</SpinnerButton> */}
      // ) 
      // : 
      (
        <>
          <Text style={styles.modalTitle}>Choose Wallet</Text>

      

          <View style={styles.walletGrid}>
            {wallets.map(item => (
              <TouchableOpacity
                key={item.name}
                style={styles.walletGridItem}
   onPress={phase === 'connect' ? connect : connectAndSign}
                disabled={!openmetamask || retryAfter > 0}
                activeOpacity={0.7}>
                <Image source={{uri: item.icon}} style={styles.walletIcon} />
                <Text style={styles.walletText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!openmetamask ? (
            <Text style={{color: 'red', margin: 0, padding: 0}}>
              Too many attempts. Please try again later ({retryAfter}s)
            </Text>
          ) : (
            <></>
          )}

          <View style={styles.walletRow}>
            <View style={styles.walletTextCol}>
              {/* {initialconnectStatus ?(<Icon style={styles.chceckIcon} name={connectStatus?"check-circle":"times-circle"} size={24} color={connectStatus?"green":"red"} />):  // X or y || b or g  = y && g
               (<Icon style={styles.chceckIcon} name="check-circle" size={24} color="black" />)
               } */}
              {/* //hasAttemptedConnect */}
              <Icon
                style={styles.chceckIcon}
                name={
                  hasAttemptedConnect
                    ? connectStatus
                      ? 'check-circle'
                      : 'times-circle'
                    : 'check-circle'
                }
                size={24}
                color={
                  hasAttemptedConnect
                    ? connectStatus
                      ? 'green'
                      : 'red'
                    : 'black'
                }
              />

              <Text style={styles.connectwallet}>Conect wallet</Text>
            </View>
            <View style={styles.walletTextCol}>
              {/* {intialsiweStatus ?(<Icon style={styles.chceckIcon} name={siwestatus?"check-circle":"times-circle"} size={24} color={siwestatus?"green":"red"} />):  // X or y || b or g  = y && g
               (<Icon style={styles.chceckIcon} name="check-circle" size={24} color="black" />)
               } */}

              <Icon
                style={styles.chceckIcon}
                name={
                  connectStatus && hasAttemptedSign
                    ? siwestatus
                      ? 'check-circle'
                      : 'times-circle'
                    : 'check-circle'
                }
                size={24}
                color={
                  connectStatus && hasAttemptedSign
                    ? siwestatus
                      ? 'green'
                      : 'red'
                    : 'black'
                }
              />

              <Text style={styles.signmsg}>Sign Message</Text>
            </View>
          </View>
        </>
      ):<SpinnerButton
  // animationType="default"
  animatedDuration={500}
  rippleColor="rgba(255,255,255,0.3)"
  spinnerColor="#AAAAAA"
  // SpinnerType ="UIActivityIndicator"
  isLoading={true}
  onPress={()=>{}}
  buttonStyle={{
    // backgroundColor:"#893346",
    paddingHorizontal:25,
    paddingVertical:12,
    borderRadius:10
  }}
>
</SpinnerButton>
}
    </ModalLoginScratch>
  );
}

const styles = StyleSheet.create({
  bottommodal: {
    width: '100%',
    // backgroundColor:"white",
    position: 'absolute',
    bottom: 0,
    margin: 0,
    padding: 0,
  },
  horzline: {
    width: 90,
    height: 5,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 9,
    borderRadius: 15,
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
  modal: {
    position: 'absolute',
    bottom: 0,
    height: 400,
    width: '100%',
    backgroundColor: '#b58df1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalText: {
    color: 'black',
    fontSize: 16,
  },
  walletRow: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  walletTextCol: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  chceckIcon: {
    marginRight: 10,
    alignSelf: 'center',
  },

  modalOverlay: {
    height: 300,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',

    color: '#000',
  },

  cancelBtn: {
    // marginTop: 20,
    alignSelf: 'flex-end',
  },
  walletText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

  cancelIcon: {
    // position: 'absolute',
  },
  cancelIconView: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cancelText: {
    fontSize: 19,
    color: '#000',
    fontWeight: '500',
  },
  signmsg: {
    fontSize: 19,
    color: '#000',
    fontWeight: '500',
  },
  connectwallet: {
    // alignSelf:"flex-start",
    fontSize: 20,
    color: '#000',
    fontWeight: '500',
  },
  walletGrid: {
    justifyContent: 'center',
    paddingVertical: 10,
  },

  walletIcon: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: 'black',
  },

  gridModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 0,
    width: '100%',
    alignItems: 'center',
  },
  walletGridItem: {
    width: 90,
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 12,
  },
  connectButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',

    paddingVertical: 12,
    paddingHorizontal: 39,
    borderRadius: 26,
    alignItems: 'center',
    marginVertical: 10,
    opacity: 1,
    // elevation: 99,
  },

  connectText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    // lineHeight: 76,
    letterSpacing: 0.5,
  },
});
