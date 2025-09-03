import React, { useState, useEffect, useRef }   from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';


import  ActivityCards from './ActivityCards';
import ActivityController from './ModalLoginScreen';
import ErrorBox from './ErrorBox';
import Test from './Test';
import { Use } from 'react-native-svg';
const { width } = Dimensions.get('window');
const SIZE = width * 0.6

const ScoreGauge = ({ score = 6.1, max = 10 }) => {

  const[errorMessage, setErrorMessage]= useState(null);
  const [errorKey, setErrorKey] = useState(0);
  const percentage = (score / max) * 100;
 const handleError = (msg) => {
    setErrorMessage(msg);
    setErrorKey(prev => prev + 1);
 }
  return (
    <View style={styles.container}>
       <View style={styles.walletContainer}>
        <View style={styles.walletLeft}>
          <Icon name="wallet" size={22} color="black" />
          {/* <Text style={styles.walletText}>Connected · Polygon</Text> */}
        <Text style={styles.balanceText}>12.5 MATIC</Text>

        </View>
        {/* <Text style={styles.balanceText}>12.5 MATIC</Text> */}
      </View>
      <AnimatedCircularProgress
        size={SIZE}
        width={6}
        fill={10}
        tintColor="#398f5a"
        tintColorSecondary="#00FF00"
        backgroundColor="#B4F0C2"
        arcSweepAngle={280}
        tintTransparency={false}
        rotation={220}
        lineCap="butt"
        childrenContainerStyle={styles.childrenContainer}
        duration={1000}
        dashedBackground={{ width: 2, gap: 9 }}
        // dashedTint={{ width: 4, gap: 2 }}
      >
        
        {() => (
          <View style={styles.textContainer}>
            <Text style={styles.scoreText}>{score.toFixed(1)}/10</Text>
            <Text style={styles.labelText}>
              {score >= 7 ? 'Excellent' : score >= 5 ? 'Good!' : 'Needs Work'}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
      {/* <ActivityCards/> */}
      <ActivityController onError={handleError}/>
      <ErrorBox key={errorKey} error={errorMessage}/>
      {/* <Test/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'black',
  },
   walletContainer: {
    color:"black",
    width: "35%",
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf:"flex-start",
    // paddingHorizontal: 10,
    // paddingBottom: 20,
    padding:10,
    borderTopRightRadius: 20,
borderBottomRightRadius: 20,
    backgroundColor: 'white',
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:"flex-start",

  },
  walletText: {
    color: 'black',
    marginLeft: 6,
    fontWeight: '600',
  },
  balanceText: {
    color: "black",
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
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ScoreGauge;
