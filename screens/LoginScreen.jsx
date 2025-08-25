import React,{useEffect,useState} from 'react';
import {  View,
  Text,
  Button,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Image,
 SafeAreaView,
    StyleSheet,
 } from 'react-native'; 
import { WebView } from 'react-native-webview';
import { useSDK } from '@metamask/sdk-react-native';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';



const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
      body, html { margin: 0; padding: 0; overflow: hidden; }
      #circle-container { 
      width: 100vw; 
      height: 100vh;
       position: relative;
        background-color: #000; 
         }
      #center-image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 129px;
        height: 129px;
        z-index: 10;
      }
      canvas {
        position: absolute;
        top: 0; left: 0;
      }
    </style>
  </head>
  <body>
    <div id="circle-container">
      <img id="center-image" src="https://i.postimg.cc/6Q8f6jV7/Cdx-Trade-Leaf-Logo.png" alt="logo" />
    </div>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
    <script>
      const container = document.getElementById('circle-container');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 10;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      function createCircle(r, s, o = 0.5) {
        const g = new THREE.BufferGeometry();
        const p = [];
        for (let i = 0; i < s; i++) {
          const a = (i / s) * 2 * Math.PI;
          p.push(r * Math.cos(a), r * Math.sin(a), 0);
        }
        g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
        const m = new THREE.PointsMaterial({ size: 0.15, transparent: true, opacity: 0.3 });
        return new THREE.Points(g, m);
      }

      const main = createCircle(2.8, 100);
      const c6 = createCircle(2.9, 100);
      const c7 = createCircle(3.0, 100);
      // const far = createCircle(0, 80, 0.3);
      // far.position.z = -20;
      scene.add(main, c6, c7);

      function animate() {
        requestAnimationFrame(animate);
        main.rotation.z += 0.0015;
        c6.rotation.z += 0.001;
        c7.rotation.z += 0.001;
        // far.rotation.z -= 0.001;
        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    </script>
  </body>
</html>
`;

export default function LoginScreen() {
const [modalVisible, setModalVisible] = useState(false);


    return (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        overScrollMode="never"
        bounces={false}
        style={{ flex: 1 }}
      />
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          disabled={connecting}
          style={styles.connectButton}
          activeOpacity={0.8}
        >
          <Text style={styles.connectText}>CONNECT</Text>
        </TouchableOpacity>
{/* 
        {connected && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.address}>Chain ID: {chainId}</Text>
            <Text style={styles.address}>Account: {account}</Text>
            <Button title="Disconnect" onPress={disconnect} />
          </View>
        )} */}
      </View>
    </View>

    <Modal visible={modalVisible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.gridModal}>
              <Text style={styles.modalTitle}>Choose Wallet</Text>

              <FlatList
                data={wallets}
                keyExtractor={(item) => item.name}
                numColumns={3}
                contentContainerStyle={styles.walletGrid}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.walletGridItem}
                    onPress={connectAndSign}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: item.icon }} style={styles.walletIcon} />
                    <Text style={styles.walletText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  </SafeAreaView>


    )
    
}



const styles = StyleSheet.create({
  walletRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  address: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    
    color: '#000',
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cancelBtn: {
    marginTop: 20,
  },
  walletText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  cancelText:{
     fontSize: 19,
    color: '#000',
    fontWeight: '500',
   
  },
  walletGrid: {
  justifyContent: 'center',
  paddingVertical: 10,
  flexWrap: 'wrap',
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
},

connectText: {
  color: 'black',
  fontSize: 20,
  fontWeight: 'bold',
  // lineHeight: 76,
  letterSpacing: 0.5,
},

});
