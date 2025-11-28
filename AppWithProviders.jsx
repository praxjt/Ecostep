// AppInner.jsx
import React from 'react';
import App from './App';
import { ConnectionProvider } from './src/contexts/ConnectionContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppInner() {
  
   

  return (
     <GestureHandlerRootView style={styles.container}>
    <ConnectionProvider>
      <App/>
    </ConnectionProvider>
    </GestureHandlerRootView>
  );
}
const styles = {
  container: {
    flex: 1,
  },
};  
