import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Easing, Image,Dimensions } from 'react-native';
import LeafIcon from '../assets/leaves-icon.svg';
import EnvIcon from '../assets/environmental-icon.svg';
import ForestIcon from '../assets/reshot-icon-forest-leaf-LSCJ9B4X6H.svg';
import JoggingIcon from '../assets/reshot-icon-jogging-9MKTUSWHQP.svg';
import PolygonIcon from '../assets/polygon-matic-logo.svg';
import HandShakeIcon from '../assets/Handshake.svg';
import GlobeIcon from '../assets/globe.svg';
import ShieldIcon from '../assets/shield.svg';

const { width } = Dimensions.get('window');
console.log("width",width)
const baseRadius = width*0.3 ;
const baseRadius2 = width*0.3 *7;

console.log("baseradius",baseRadius) 
console.log("baseRadius2",baseRadius2)

const iconSize = width * 0.08; 
const logoSize = width * 0.22; 
export default function CircleDots() {
  const animated = useRef(new Animated.Value(0)).current;

  const rotate = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateOpposit = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(animated, {
        toValue: 1,
        duration: 110000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),

    ).start();

  }, [animated]);

  const renderCircle = (radius, icons, rotateDirection, offsetAngle) => {
    const dots = [];
    const uprightRotation =
      rotateDirection === rotate ? rotateOpposit : rotate;

    const iconSize = 40;
    const adjustedRadius = radius + iconSize / 2;

    for (let i = 0; i < icons.length; i++) {
      const initialAngle = (360 / icons.length) * i + offsetAngle;
      const Icon = icons[i];
      const extraTilt = `${-initialAngle}deg`;

      dots.push(
        <Animated.View
          key={`${radius}-${i}`}
          style={[
            styles.item,
            {
              width: adjustedRadius * 2,
              height: adjustedRadius * 2,
              borderRadius: adjustedRadius,
              transform: [
                { rotate: `${initialAngle}deg` },
                { rotate: rotateDirection },
              ],
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [
                { rotate: uprightRotation },
                { rotate: extraTilt },
              ],
            }}
          >
            <View style={styles.dot}>
              <Icon width={25} height={25} />
            </View>
          </Animated.View>
        </Animated.View>
      );
    }
    return dots;
  };

  const icons1 = [LeafIcon, EnvIcon, ForestIcon, JoggingIcon];
  const icons2 = [ShieldIcon, GlobeIcon,PolygonIcon, HandShakeIcon];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circlePath,
          // { width: width*0.3*2, height: width*0.3*2, borderRadius: width },
          // { width: width*0.6, height: width*0.6, borderRadius: width*0.3 },
          { width: 240, height: 240, borderRadius: 120 },
          

        ]}
      />
      <View
        style={[
          styles.circlePath,
          { width: 400, height: 400, borderRadius: 200 },
        ]}
      />
      {renderCircle(120, icons1, rotate, 0)}
      {renderCircle(200, icons2, rotateOpposit, 45)}

      <Image
        source={require('../assets/logoTrans.png')}
        style={styles.centerLogo}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePath: {
    position: 'absolute',
    borderWidth: 0.9,
    borderColor: '#4e4c4cff',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centerLogo: {
    width: 110,
    height: 110,
  },
});
