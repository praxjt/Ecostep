// import React, { useEffect, useState } from 'react';


// import { View, Text, StyleSheet } from 'react-native';



// export default function StepCounter() {
 
//     useEffect(() => {
//         isStepCountingSupported()
//         .then((supported) => {
//             setIsSupported(supported);
//             if (supported) {
//             startStepCounterUpdate((data) => {
//                 const parsedData = parseStepData(data);
//                 setStepCount(parsedData.steps);
//             });
//             } else {
//             setError('Step counting is not supported on this device.');
//             }
//         })
//         .catch((err) => {
//             setError(`Error checking support: ${err.message}`);
//         });
    
//         return () => {
//         stopStepCounterUpdate();
//         };
//     }, []);
    
//     if (error) {
//         return (
//         <View style={styles.container}>
//             <Text style={styles.errorText}>{error}</Text>
//         </View>
//         );
//     }
    
//     if (isSupported === null) {
//         return (
//         <View style={styles.container}>
//             <Text style={styles.infoText}>Checking step counter support...</Text>
//         </View>
//         );
//     }
    
//     if (!isSupported) {
//         return (
//         <View style={styles.container}>
//             <Text style={styles.errorText}>Step counting is not supported on this device.</Text>
//         </View>
//         );
//     }
    
//     return (
//         <View style={styles.container}>
//         <Text style={styles.stepCountText}>Steps Taken: {stepCount}</Text>
//         </View>
//     );
//     }