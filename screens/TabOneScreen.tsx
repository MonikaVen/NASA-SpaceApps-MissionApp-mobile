import * as React from 'react';
import { Button, StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import axios from 'axios';
// import perseverance from '../assets/images/perseverance.jpg';
export default function TabOneScreen() {
  const [messageState, setMessageState] = React.useState('')
  function retrieveMessage() {
    // let message = fetch('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/');
    setMessageState('Retrieving message...');
    axios.get('http://esa-archive.hellomars.co:3000/mars').then((res)=> setMessageState(res.data))
  }
  return (
    <View style={styles.container}>
      <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mars_Reconnaissance_Orbiter_spacecraft_model.png/1280px-Mars_Reconnaissance_Orbiter_spacecraft_model.png'}}
            style={{width: 300, height: 200}} />
      <Text>{messageState}</Text>
      <Button title="Say hello to Mars Orbiter!" onPress={retrieveMessage}></Button>
      <Text></Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      {/* <EditScreenInfo path="/screens/TabOneScreen.js" /> */}
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
