import React, { useState, useEffect, useRef,useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Text,
  Button,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import ActivityRecognition from 'react-native-activity-recognition';
// import MonthPicker from 'react-native-month-year-picker';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format,isAfter } from "date-fns";

// console.log('ActivityRecognition:', ActivityRecognition);
import Geolocation from 'react-native-geolocation-service';
import {hasLocationPermission} from './LocationPermission';
import io from 'socket.io-client';
import { BarChart } from 'react-native-gifted-charts';
import { Picker } from '@react-native-picker/picker';
import {ChipGroup } from '../../components/chip/Chip'

import LastActivity from  './Home/LastActivity';

import {useConnection} from '../contexts/ConnectionContext'
import CurrentStatus from './Home/CurrentStatus'
console.log('Geolocation:', Geolocation);


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ActivityController({onError,setCo2SavedperKg,setkmwalked}) {
  const {accessToken,wallet}=useConnection()

  console.log("accessToken,username fromuseConnection ",accessToken,wallet)
  const [showActionContainer, setShowActionContainer] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
   const [position, setPosition] = useState(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [lastActivity, setLastActivity] = useState(null);
    const [co2SavedforTodayKg, setCo2SavedforTodayKg] = useState(0.0);
    // const [selectedMetric, setSelectedMetric] = useState('distance');

    const today =new Date()
    const [currentWeekDate, setCurrentWeekDate] = useState(today)
    const [selectedIndex, setSelectedIndex] = useState(0);

    const chipData = [
  { label: "KM walked", key: "distance", icon: "directions-walk", activeIcon: "directions-walk", activeColor: "#4bff01" },
  { label: "CO₂ Saved (kg)", key : "co2",icon: "co2", activeIcon: "co2", activeColor: "#4bff01" },
];
const [selectedMetric, setSelectedMetric] = useState(chipData[0].label);
    const [weekData, setWeekData] = useState([
       { value: 0 },
    { value:0 },
    { value: 0 },
    { value: 0 },
    {value:0},
    {value:0},
])


const weekStart = startOfWeek(currentWeekDate, { weekStartsOn: 0 }); 
const weekEnd = endOfWeek(currentWeekDate, { weekStartsOn: 0 });

const goPrevWeek = () => setCurrentWeekDate(prev => subWeeks(prev, 1));
const nextWeekStart = addWeeks(weekStart, 1);
const canGoNext = !isAfter(nextWeekStart, today); 
const goNextWeek = () => {
    if (canGoNext) setCurrentWeekDate(nextWeekStart);
};

  const data = [
    { value: 90 },
    { value: 45 },
    { value: 30 },
    { value: 60 },
    {value:40},
    {value:40},

  ];

  const xLabels = ['sun','Mon', 'Tue', 'Wed', 'Thu','fri','sat'];

  // const subscriptionRef = useRef(null);


  // const months = [
  //   { label: 'January', value: '1' },
  //   { label: 'February', value: '2' },
  //   { label: 'March', value: '3' },
  //   { label: 'April', value: '4' },
  //   { label: 'May', value: '5' },
  //   { label: 'June', value: '6' },
  //   { label: 'July', value: '7' },
  //   { label: 'August', value: '8' },
  //   { label: 'September', value: '9' },
  //   { label: 'October', value: '10' },
  //   { label: 'November', value: '11' },
  //   { label: 'December', value: '12' },
  // ];

  // const years = ['2023','2024','2025',];


  const startedRef = useRef(false); // used to prevent multiple geolocation watches
    const Geolactionref = useRef(null);
      const socketRef = useRef(null);  

      const CO2_ICE_g_per_km = 60.9 // took from the research papers of icct 
    useEffect(() => {
    socketRef.current = io('http://192.168.1.12:3001'); 
    socketRef.current.on('distanceUpdate', (dist) => {
      setDistanceKm(dist);

      // const CO2_saved_g = dist * CO2_ICE_g_per_km;
      // const CO2_saved_kg = CO2_saved_g / 1000;
      // setCo2SavedperKg(CO2_saved_kg);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [accessToken,wallet]);

  const startRecording = async () => {
    if (startedRef.current) {
      return;

    }
  
     const granted = await hasLocationPermission(); 
    if (!granted) {
      console.log('Location permission not granted');
      return;
    }

    console.log(' Location permission granted, ');
    startedRef.current = true;


 Geolactionref.current = Geolocation.watchPosition(
      pos => {
        console.log('Position update:', pos.coords);
        setPosition(pos.coords);
           if (socketRef.current) {  //  ||
          socketRef.current.emit('locationUpdate',pos.coords);
        }
      },
      
      error => {
        console.log('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter:1,
        maximumAge: 0, 
        showLocationDialog:true,
        interval: 2000,
        // fastestInterval: 1000, 
        showsBackgroundLocationIndicator: true,
      }
    );
  };
 const stopRecording = () => {
    if (Geolactionref.current !== null) {
      // Geolocation.clearWatch(Geolactionref.current);
      Geolocation.stopObserving();
      Geolactionref.current = null;
      startedRef.current = false;
      console.log('Stopped tracking');
    }
  };

  const toggle = () => {
  if (isPaused) {
    startRecording(); 
  } else {
    stopRecording();
  }
  setIsPaused(prev => !prev);
};

const fillWeekData = (activities, weekStart) => {
  // Initialize 7 days with 0
  const weekArray = Array(7).fill(0);

  activities.forEach(item => {
    const activityDate = new Date(item.date);
    const dayIndex = activityDate.getDay();
 weekArray[dayIndex] = { 
      kmWalked: item.kmWalked || 0,
      co2Saved: item.co2Saved || 0
    };
  });

  return weekArray
};
const displayWeekData = weekData.map(item => ({
  value: selectedMetric === 'distance' ? item.kmWalked : item.co2Saved
}));
const fetchWeekData = async (weekStart, weekEnd) => {
  try {
    const response = await fetch('http://192.168.1.12:3001/activity/week', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-user-address': wallet,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
      }),
    });

    const data = await response.json();

   if (!data.ok || !data.activities) {
      console.warn('No activity data for this week');
      setWeekData(Array(7).fill({ value: 0 }));
    } else {
      const chartData = fillWeekData(data.activities, weekStart);
      setWeekData(chartData);
    }
  } catch (err) {
    console.error('Network error', err);
    setWeekData(Array(7).fill({ value: 0 }));
  }
};
async function fetchOverallData() {
  try {
    const response = await fetch("http://192.168.1.12:3001/activity/overall", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-user-address": wallet,
      },
    });

    const data = await response.json();

    if (!data.ok) {
      console.log("Failed to load totals");
      return;
    }

    setkmwalked(data.kmWalked);
    setCo2SavedperKg(data.co2Saved);
    console.log("co2saved",data.co2Saved)

  } catch (e) {
    console.log("Error loading totals:", e);
  }
}

// useEffect(() => {
//   fetchWeekData(weekStart, weekEnd);
// }, [currentWeekDate,accessToken]);

useEffect(() => {
  fetchWeekData(weekStart, weekEnd);
  fetchOverallData()
}, [currentWeekDate,wallet,accessToken,selectedMetric]);
const maxBarValue = selectedMetric === 'co2'
  ? Math.max(...displayWeekData.map(item => item.value)) * 1.9
  : undefined;

  return (
    <View style={styles.container}>
      {!showActionContainer && (
        <TouchableOpacity
          onPress={() => {
            setShowActionContainer(true);
            setIsPaused(false);
           startRecording(); 
           
          }}
        >
          <FontAwesome name="play" size={30} color="white" />
        </TouchableOpacity>
      )}

{showActionContainer && (
   <CurrentStatus
    distance={distanceKm}
      />
  )}
      {showActionContainer && (
        
        <View style={styles.actionBox}>
         
         
         
          <TouchableOpacity  onPress={toggle}>
           
            <FontAwesome
              name={isPaused ? 'play' : 'pause'}
              size={30}
              color="white"
              


              
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async() => {
              console.log(`Save pressed. Distance:  km`);
              setShowActionContainer(false);
              setIsPaused(true);            
                  if (socketRef.current) {
      socketRef.current.emit('resetDistance');
    }
     
              setDistanceKm(0);   
              stopRecording();
 

         const co2ThisSessionKg = (distanceKm * CO2_ICE_g_per_km) / 1000;
              const today = new Date();  
              console.log(today) 
               const todayStr = today.toLocaleDateString();
               console.log(todayStr)    
     setCo2SavedforTodayKg( prev => {
    if (lastActivity && lastActivity.date === todayStr) {
      return prev + co2ThisSessionKg;
    } else {
      return co2ThisSessionKg;
    }
  })
              setLastActivity({
               distance: distanceKm,
              date: today.toLocaleDateString(), 
    });

     try {
      const response = await fetch('http://192.168.1.12:3001/activity/save', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-user-address': wallet,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kmWalked: distanceKm,
          co2Saved: co2ThisSessionKg,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        console.error('Failed to save activity', data.error);
      } else {
        console.log('Activity saved', data.activity);
           fetchOverallData();
      fetchWeekData(weekStart, weekEnd);  
      }
    } catch (err) {
      console.error('Network error', err);
    }
    
           }}


          >
            <FontAwesome name="save" size={30} color="white" />
          </TouchableOpacity>
        
        </View>
        
      )}

            {!showActionContainer && lastActivity && (
  <LastActivity distance={lastActivity.distance} date={lastActivity.date} sessionCo2Kg ={co2SavedforTodayKg}  />
 )} 
      {/* <MonthYearPickerView color="tomato" /> */}

 <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
  <TouchableOpacity onPress={goPrevWeek } 
  activeOpacity={0.7}
  style={{
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: '#4bff01', // modern green, can change
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // for Android shadow
  }}>
          <FontAwesome name="angle-left" size={30} color="black" />


  </TouchableOpacity>

  <Text style={{ marginHorizontal: 16, fontSize: 16, }}>
    {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd, yyyy")}
  </Text>

  <TouchableOpacity onPress={goNextWeek}  
  activeOpacity={0.7}
  style={{
   backgroundColor: canGoNext ? '#4bff01' : 'rgba(0,0,0,0.2)',
  borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // for Android shadow
  }}>
          <FontAwesome name="angle-right" size={30} color={canGoNext ? 'black' : 'grey'} />

  </TouchableOpacity>
</View>
<View
  style={{
    width:SCREEN_WIDTH*0.9,
    alignSelf: 'center',
    paddingVertical: 20,
  }}
>
    {/* <View style={{ flexDirection: "row", alignItems: 'flex-end', marginBottom:1 }}> */}
  {/* <Picker
  selectedValue={selectedMetric}
  onValueChange={(itemValue) => setSelectedMetric(itemValue)}
  style={{ width: SCREEN_WIDTH*0.5,  backgroundColor: 'transparent',  color: 'white', alignSelf: 'center', marginBottom: 10 }}
    mode="dropdown"
>
  <Picker.Item style={{backgroundColor:"black"}}  label="KM walked" value="distance" />
  <Picker.Item  style={{backgroundColor:"black"}} label="CO₂ Saved (kg)" value="co2" />
</Picker> */}
{/* </View> */}
<View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
  <ChipGroup
    chips={chipData}

    selectedIndex={selectedIndex}
    onChange={(index) => {
      setSelectedIndex(index);
      setSelectedMetric(chipData[index].key);
       setSelectedMetric(chipData[index].key);
    }}
      containerStyle={{
    backgroundColor: "#000"}}
  />
</View>


<View style={{ backgroundColor: "#000", // modern dark card
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,}}>

  <BarChart
         data={displayWeekData}
         xAxisLabelTexts={xLabels}
         xAxisLabelTextStyle={{ color: 'white', fontSize: 12 }}
         barWidth={20}
         spacing={20}
        hideRules={true}
        frontColor="#4bff01"
          barBorderRadius={8} 
  // minValue={selectedMetric === 'co2' ? 0 : undefined}
  // maxValue="0.05"
  maxValue={selectedMetric === 'co2' ? "0.5" : undefined}

        //  yAxisLabelTexts={['0', '20', '40', '60',]}
        yAxisTextStyle={{color:'white'}}
       />
       </View>
 </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 36,
    paddingVertical: 10,
    marginTop: 10,
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
});
