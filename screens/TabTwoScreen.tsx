import * as React from 'react';
import { Button, StyleSheet, TextInput, Image } from 'react-native';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ImageMapper from 'react-native-image-mapper';

import { DeviceMotion } from 'expo-sensors';
import axios from 'axios';
const imageSource = require('../assets/images/crater.jpg');
export default function TabTwoScreen() {
  const [rot, setRot] = React.useState(0)
  const [pic, setPic] = React.useState(false)
  const [momentState, setMomentState] = React.useState({
    id: '',
    x: null,
    y: null,
    z: null,
    t: null,
    speed: null,
    b: null,
    alpha: 0,
    beta: 0,
    gamma: 0,
  })
  const [dataSentMessage, setDataSentMessage ] = React.useState(
    'Data not sent yet.'
  )
  // setInterval(() => {
  //    update();
  // }, 1000);
  const MAPPING = [
    {
      id: '0',
      name: 'First Area Name',
      shape: 'rectangle',
      width: 20,
      height: 20,
      x1: momentState.x,
      y1: momentState.y,
      prefill: 'red',
      fill: 'blue'
    },
  ]
  const getLocationStamp = async () => {
      rotation();
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
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
        b: battery,
        alpha: rot.alpha,
        beta: rot.beta,
        gamma: rot.gamma,
      })
      // console.log(locationStamp.coords)
  }
  const batteryLevel = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    return batteryLevel
  }
  const rotation = () => {
    if(DeviceMotion.isAvailableAsync()){
      DeviceMotion.setUpdateInterval(1000)
      let subscription = DeviceMotion.addListener(motionData => {
        if(motionData){
          setRot(motionData.rotation);
          console.log(motionData.rotation);
        }
      });
    }

  }
  const getPicture = () => {
    console.log('getting pic...')
    // if (momentState.alpha < 3){
    //   setPic('https://nasa2020-canyouhearmenow-mars-bucket.s3.eu-north-1.amazonaws.com/0.jpg')
    // } else {
    //   setPic('https://nasa2020-canyouhearmenow-mars-bucket.s3.eu-north-1.amazonaws.com/1.jpg')     
    // }
    console.log(momentState)
    axios.post('http://esa-archive.hellomars.co/takepic', momentState).then(resp => {
    console.log(resp.data);
    setPic(resp.data)
});
    
    // setPic('https://nasa2020-canyouhearmenow-mars-bucket.s3.eu-north-1.amazonaws.com/1.jpg')
    return 'this is the picture, instead of this text'
  }
  // const getPicture = () => {
  //   console.log('getting pic...')
  //   const alpha = { "alpha": momentState.alpha }
  //   console.log(alpha)
  //   axios.post('http://esa-archive.hellomars.co/takepic', alpha).then( (res) => {
  //     console.log(res)
  //     setPic(res)
  //   })
  //   return 'this is the picture, instead of this text'
  // }
  const goodAzimuth = () => {
    //momentState.alpha > 1.57
    if (true){
      return <Button title="Take Picture" onPress={getPicture}></Button>
    } else {
      return <Button disabled title="Fix Azimuth ..." ></Button>
    }
  }
  const update = async () => {
    getLocationStamp();
  }
  const sendData = () => {
    console.log('Sending ...')
    update()
    axios.post('http://esa-archive.hellomars.co:3000/data', momentState).then((res)=> setDataSentMessage('Earth: we recieved your data!'))
    //axios.post('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/rover', momentState).then((res)=> setDataSentMessage(JSON.stringify(res.data)))

  }

  const PrimaryView = () => {
    if (pic) {
      let element = (
      <View>
        <Image source={{uri: pic}}
            style={{width: 300, height: 200}} />
        <Text>Well done! Mission Control says thank you!</Text>
        <Button title="End Mission"> </Button>
      </View>

      )
      return element
    }
    return (
<View style={styles.container}>
      <View style={styles.containerM}>
      <Text style={styles.item}>x: {Number(momentState.x).toFixed(5)}</Text>
      <Text style={styles.item}>y: {Number(momentState.y).toFixed(5)}</Text>
      <Text style={styles.item}>z: {Number(momentState.z).toFixed(5)}</Text>
      <Text style={styles.item}>t: {momentState.t}</Text>
      <Text style={styles.item}>b: {(momentState.b*100).toFixed(2)}%</Text>
      <Text style={styles.item}>speed: {momentState.speed}</Text>

      <Text>beta: {Number(momentState.beta).toFixed(5)}</Text>
      <Text>gamma: {Number(momentState.gamma).toFixed(5)}</Text>
      </View>
      <Text>Azimuth: {momentState.alpha}</Text>
      <Button title="Send Data" onPress={sendData}></Button>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text>Mission Control asks you to take the picture</Text>
      <Text>of the crater. You will have to </Text>
      <Text>turn your phone as instructed:</Text>
      <Text>Azimuth has to be between 1.57 and 3.14</Text>
      {goodAzimuth()} 
      {/* <EditScreenInfo path="/screens/TabTwoScreen.js" />*/}
    </View>

    )
  }

const crater = () => {
  return (
    <ImageMapper
      imgHeight={250}
      imgWidth={300}
      imgSource={imageSource}
      imgMap={MAPPING}
      containerStyle={styles.myCustomStyle}
      selectedAreaId="my_area_id"
  />
  )
}

  return (
    <View style={{alignItems: 'center'}}>
      {crater()}
      <PrimaryView/>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerM: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
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
  item: {
    width: '33%',
    padding: 20
  }
});
