import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';  
import { err } from 'react-native-svg/lib/typescript/xml';


const ErrorBox = ({error}) => {
     const [visible, setVisible] = useState(false);


     useEffect(()=>{
      if(!error) return;
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 1000); 
return () => clearTimeout(timer);
     },[error])

    if (!error || !visible) return null;
    return (    
        <View style={styles.container}>
            <Text style={styles.errorText}>{error}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  errorText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ErrorBox;
