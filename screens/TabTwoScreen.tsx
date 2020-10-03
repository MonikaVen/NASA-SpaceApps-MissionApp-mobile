import * as React from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View, Dimensions } from '../components/Themed';
import {
  WebView
} from 'react-native-webview'
import html_script from './html_script'
// import {
//   Accelerometer,
//   Barometer,
//   Gyroscope,
//   Magnetometer,
//   MagnetometerUncalibrated,
//   Pedometer,
// } from 'expo-sensors';
import axios from 'axios';
export default function TabTwoScreen() {
  const [momentState, setMomentState] = React.useState({
    id: '',
    x: null,
    y: null,
    z: null,
    t: null,
    speed: null,
    b: null,
  })
  const [dataSentMessage, setDataSentMessage ] = React.useState(
    'Data not sent yet.'
  )
  const getLocationStamp = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let locationStamp = await Location.getCurrentPositionAsync({});
      let battery = await batteryLevel();
      setMomentState({
        id: 777,
        x: locationStamp.coords.latitude,
        y: locationStamp.coords.longitude,
        z: locationStamp.coords.altitude,
        t: locationStamp.timestamp,
        speed: locationStamp.coords.speed,
        b: battery
      })
      console.log(locationStamp.coords)
  }
  const batteryLevel = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    return batteryLevel
  }

  const update = async () => {
    getLocationStamp();
  }
  const sendData = () => {
    console.log('Sending ...')
    axios.post('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/rover', momentState).then((res)=> setDataSentMessage(JSON.stringify(res.data)))
    //axios.post('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/rover', momentState).then((res)=> setDataSentMessage(JSON.stringify(res.data)))

  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rover Data</Text>
      <WebView ref={'Map_Ref'}  source={{html: html_script }}/>
      <Text>x: {momentState.x}</Text>
      <Text>y: {momentState.y}</Text>
      <Text>z: {momentState.z}</Text>
      <Text>t: {momentState.t}</Text>
      <Text>b: {momentState.b*100}%</Text>
      <Text>speed: {momentState.speed}</Text>
      <Button title="Update" onPress={update}></Button>
      <Text>{dataSentMessage}</Text>
      <Button title="Send data" onPress={sendData}></Button>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/TabTwoScreen.js" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
