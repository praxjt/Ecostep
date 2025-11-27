import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Dimensions,ScrollView,Pressable} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import ActivityController from '../ActivityContrller';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBox from '../../components/ErrorBox';
import {useConnection} from "../../contexts/ConnectionContext"
import Test from '../Test';
import LastActivity from './LastActivity';
import {G, Use} from 'react-native-svg';
import { JumpingTransition } from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');
const SIZE = width * 0.6;

const ScoreGauge = () => {
  const { logout } = useConnection();
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorKey, setErrorKey] = useState(0);
     const [co2SavedperKg, setCo2SavedperKg] = useState(0.0);
     const [kmwalked,setkmwalked]=useState(0)
 useEffect(()=>{
const logouttemp = async () => {
  try {
    console.log("LOGGING OUT…");

    // 1. Delete SIWE tokens (accessToken + refreshToken)
    await Keychain.resetGenericPassword();

    // 2. Delete stored wallet info
    await AsyncStorage.removeItem("walletAddress");
    await AsyncStorage.removeItem("chainId");

    // OPTIONAL: delete backend stored refresh token  
    // (uncomment only if you added logout API)
    /*
    const refreshToken = JSON.parse(credentials.password).refreshToken;
    await fetch("http://192.168.1.12:3001/logout", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    */

    // 3. Disconnect MetaMask session
    // sdk?.terminate();

    // 4. Navigate to Landing (login) screen
    // navigation.replace("Landing");

    console.log("LOGOUT SUCCESS");

  } catch (err) {
    console.log("Logout error:", err);
  }
};


// logout();
 },[])
  const handleError = msg => {
    setErrorMessage(msg);
    setErrorKey(prev => prev + 1);
  };
  return (
    
    <LinearGradient
      colors={['#000000', '#0d0d0dff', '#1b3d1bff']}
      //  colors={["#00FFAA", "#00FF66","#000000", ]}
      locations={[0, 0.6, 1]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.container}>
          <ScrollView
      vertical
      showsVerticalScrollIndicator={false}  // optional, hides the scrollbar
    >
      {/* <View style={styles.walletContainer}>
        <View style={styles.walletLeft}>
          <Icon name="wallet" size={22} color="black" />
          <Text style={styles.balanceText}>12.5 MATIC</Text>
        </View>
      </View> */}
     <Pressable
      onPress={logout}
      style={styles.walletContainer}
    >
        <View style={styles.walletLeft}>

          <Icon name="wallet" size={22} color="black" />

      <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
        Logout
      </Text>
    </View>
    </Pressable>
    
<View style={styles.lottieContainer}>
      <LottieView
        source={require('../../lottie/Lottiecircle.json')}
        style={{width: width * 0.8, height: width * 0.8}}
        autoPlay
        loop
      />
       <View style={styles.centeredTextContainer}>
    <Text style={styles.scoreText}>{co2SavedperKg.toFixed(1)} 
       <Text style={styles.subscript}>kg</Text>

       </Text>
       <Text style={styles.subscript} >{kmwalked} km</Text>
   
  </View>
      </View>
      {/* <ActivityCards/> */}
      <ActivityController onError={handleError} setCo2SavedperKg={setCo2SavedperKg} setkmwalked={setkmwalked} />

      <ErrorBox key={errorKey} error={errorMessage} />
      {/* <Test/> */}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // marginTop: 50,
    backgroundColor: 'black',
  },
  walletContainer: {
    color: 'black',
    width: '35%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-start',
    // paddingHorizontal: 10,
    // paddingBottom: 20,
    padding: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white',
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  walletText: {
    color: 'black',
    marginLeft: 6,
    fontWeight: '600',
  },
  balanceText: {
    color: 'black',
    fontWeight: 'bold',
  },
  childrenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: SIZE * 0.1,
  },

  lottieContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},
centeredTextContainer: {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
},

scoreText: {
  fontSize: 50,
  fontWeight: 'bold',
  color: 'white',
},

labelText: {
  fontSize: 18,
  color: '#A0FFA0',
  marginTop: 4,
},
subscript: {
  fontSize: 20,
     
},
});

export default ScoreGauge;
