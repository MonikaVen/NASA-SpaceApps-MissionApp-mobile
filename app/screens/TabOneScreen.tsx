import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import axios from 'axios';


export default function TabOneScreen() {
  const [messageState, setMessageState] = React.useState('None')
  function retrieveMessage() {
    // let message = fetch('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/');
    setMessageState('Retrieving message...');
    axios.get('http://ec2-52-15-90-21.us-east-2.compute.amazonaws.com:3000/').then((res)=> setMessageState(res.data))
  }
  return (
    <View style={styles.container}>
      <Text >Hello Martian!</Text>
      <Text style={styles.title}>Today you will be permoning a mission on a surface of Mars</Text>
      <Text>You will send data to Earth</Text>
      <Text></Text>
      <Text style={styles.title}>Misssion</Text>
      <Text>{messageState}</Text>
      <Button title="Say hello to Mars Orbiter!" onPress={retrieveMessage}></Button>
      <Text></Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.js" />
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
