import React, { useState, useEffect, useRef } from 'react';
import { View, Button } from 'react-native';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map,filter } from 'rxjs/operators';
import { io } from 'socket.io-client';
export default function HARCollector() {
const [isCollecting, setIsCollecting] = useState(false);
const [data, setData] = useState([]);
  const wsRef = useRef(null);
const accelSubRef  = useRef(null);
const gyroSubRef = useRef(null);
// const ws = new WebSocket('ws://192.168.1.7:8080/predict');
//  useEffect(() => {

// }, []);
const socket = useRef(null);
const startCollection = () => {

  if (accelSubRef.current || gyroSubRef.current) return; 
 socket.current =io("http://192.168.1.7:3003")
 
 socket.current.on("prediction", (data) => {
    console.log("Prediction:", data);
  });
 
 socket.current.on("arrayofprediction", (data) => {
    console.log("arrayofprediction:", data);
  });

socket.current.on("connect", () => {
  console.log(socket.id); 
socket.current.emit("message", "Hello!");

});


setUpdateIntervalForType(SensorTypes.accelerometer, 100); // defaults to 100ms
accelSubRef.current  = accelerometer.subscribe(({ x, y, z, timestamp }) =>{
socket.current.emit('sensorData', { type: 'acc', x, y, z })
  console.log("accelo",{ x, y, z, })


}
);
  setUpdateIntervalForType(SensorTypes.gyroscope, 100);
    gyroSubRef.current = gyroscope.subscribe(({ x, y, z, timestamp }) => {
    socket.current.emit('sensorData', { type: 'gyro', x, y, z })
      console.log("GYRO:", { x, y, z });
    });
  setIsCollecting(true);
   
}
const stopCollection = () => {
     if (accelSubRef.current) {
      console.log(accelSubRef.current);
   accelSubRef.current.unsubscribe();
  accelSubRef.current = null;
     }
     if (gyroSubRef.current) {
      gyroSubRef.current.unsubscribe();
      gyroSubRef.current = null;
    }
     setIsCollecting(false);
    if (socket.current) {
  socket.current.disconnect();
  socket.current = null;
}

}
  

  return (
    <View>
      <Button
        title={isCollecting ? "Stop Collecting" : "Start Collecting"}
        onPress={isCollecting ? stopCollection : startCollection}
      />
    </View>
  );
}
