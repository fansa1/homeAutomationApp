import 'react-native-gesture-handler';
import  React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import { Alert, View, StyleSheet, Image, LogBox } from 'react-native';
import { Avatar, Appbar, Button, Card, Title, ActivityIndicator, Text} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import {restoreToken, signOut} from './src/reducers/userReducer' 
import Login from './src/components/Login' 
import GreenHouse from './src/components/GreenHouse' 
import ResetPassword from './src/components/ResetPassword' 
import HomeScreenContent from './src/components/HomeScreenContent' 

LogBox.ignoreLogs(['Setting a timer']);

import firebase from 'firebase/app'
import "firebase/auth"
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


const firebaseConfig = {
  apiKey: Constants.manifest.extra.key,
  databaseURL: Constants.manifest.extra.database,
  projectId: Constants.manifest.extra.project,
  appId: Constants.manifest.extra.app,
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


 async function registerForPushNotificationsAsync() {
   
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
   
    //console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


function CustomNavigationBarStack({ navigation, previous }) {
  return (
    <Appbar.Header>
    {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Home info app" />
    </Appbar.Header>
  );
}

function CustomNavigationBarDrawer({ navigation, previous}) {
  const uid = useSelector(state => state.user.userUid)
  const dispatch  = useDispatch()

  let name = null
  if(uid && uid==="C9pcN4VqS1XgH1xFFijJ8hina7k1"){
    
    name = "Samuel"
  }
  return (
    <Appbar.Header>
    {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
    <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      <Appbar.Content title="Home info app" subtitle={`signed in as ${name}`}/>
      <Appbar.Action icon="refresh" onPress={() => dispatch(signOut())} />
      <Appbar.Action icon="logout-variant" onPress={() => dispatch(signOut())} />
  

    </Appbar.Header>
  );
}


function GreenHouseScreen({navigation, previous}) {
  return (
      <Stack.Navigator>   
     <Stack.Screen  name="GreenHouse" component={GreenHouse} 
        options={{
        header: (props) => <CustomNavigationBarDrawer{...props} />
        }}
        />
      </Stack.Navigator>   
  );
}


function HomeScreen({ navigation, previous}) {
     return (   
     <Stack.Navigator>   
     <Stack.Screen  name="Home" component={HomeScreenContent} 
        options={{
        header: (props) => <CustomNavigationBarDrawer{...props} />
        }}
        />
      </Stack.Navigator> 
     ) 
}


export default function AppWithoutStore() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  let userName = null

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const dispatch  = useDispatch()
const isSignout = useSelector(state => state.user.isSignout)
const isLoading = useSelector(state => state.user.isLoading)
const [user, setUser] = useState();
const uid = useSelector(state => state.user.userUid)
function onAuthStateChanged(user) {
    setUser(user);
    if(user) dispatch(restoreToken(user.uid));
}
useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    //console.log(user)
    registerForPushNotificationsAsync()
      .then(token => {
      setExpoPushToken(token)})
   
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      return subscriber; 
    };
    
  }, [])

   //<ActivityIndicator animating={true}/>
  if (expoPushToken==='' || uid===undefined) {
    return(
  
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Title>Home info app</Title>
      <Avatar.Icon size={120} icon="home" />
      
    </View>
    )
}

if(!user) {
  return(
<NavigationContainer>
<Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: (props) => <CustomNavigationBarStack {...props} />,
        }}>
<Stack.Screen  name="Login" component={Login}/> 
<Stack.Screen  name="ResetPassword" component={ResetPassword}/> 
</Stack.Navigator> 
</NavigationContainer>
  )}
  else{
     console.log(expoPushToken)
    if(uid && uid==="C9pcN4VqS1XgH1xFFijJ8hina7k1"){
     userName = "Samuel"
  }
  firebase.firestore()
  .collection('ExpoPushToken')
  .doc(userName)
  .set({
    token: expoPushToken,
  })
    
return(
<>
    <NavigationContainer>

      <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="GreenHouse" component={GreenHouseScreen} />
      </Drawer.Navigator>
   
    </NavigationContainer>
    </>
  )
}
}


    