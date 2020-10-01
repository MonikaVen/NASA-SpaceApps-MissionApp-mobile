import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import axios from 'axios';
export default function TabTwoScreen() {
  const [momentState, setMomentState] = React.useState({
    x: null,
    y: null,
    z: null,
    t: null,
    speed: null,
  })
  const [batteryState, setBatteryState] = React.useState({
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
      setMomentState({x: locationStamp.coords.latitude,
      y: locationStamp.coords.longitude,
      z: locationStamp.coords.altitude,
      t: locationStamp.timestamp,
      speed: locationStamp.coords.speed
      })
      console.log(locationStamp.coords)
  }
  const batteryLevel = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    setBatteryState({ b: batteryLevel });
    Battery.addBatteryLevelListener(({ batteryLevel }) => {
    setBatteryState({ b: batteryLevel });
    console.log('batteryLevel changed!', batteryLevel);
  });
  }
  const update = async () => {
    batteryLevel();
    getLocationStamp();
  }
  const sendData = () => {
    console.log('Sending ...')
    axios.post('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/rover', batteryState.b).then((res)=> setDataSentMessage(JSON.stringify(res.data)))
    axios.post('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/rover', momentState).then((res)=> setDataSentMessage(JSON.stringify(res.data)))

  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rover Data</Text>
      <Text>x: {momentState.x}</Text>
      <Text>y: {momentState.y}</Text>
      <Text>z: {momentState.z}</Text>
      <Text>t: {momentState.t}</Text>
      <Text>b: {batteryState.b*100}%</Text>
      <Text>speed: {momentState.speed}</Text>
      <Button title="Update" onPress={update}></Button>
      <Text>{dataSentMessage}</Text>
      <Button title="Send data" onPress={sendData}></Button>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.js" />
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
