import React from 'react';
import { TouchableWithoutFeedback, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Constants from 'expo-constants';
import Text from './Text'
import { useContext } from 'react';
import { Link } from "react-router-native";
import { useQuery } from '@apollo/react-hooks';
import useAuthorizedUser from '../hooks/useAuthorizedUser';
import AuthStorageContext from '../contexts/AuthStorageContext';
import AuthStorage from '../utils/authStorage';
import {useApolloClient} from  '@apollo/react-hooks';

const styles = StyleSheet.create({
  flexItemA: {
    flexGrow: 0,
    flexShrink: 1,
    marginLeft:10,
    marginTop:30,
    marginBottom: 25,
    backgroundColor: '#24292e',
    paddingLeft: 10,
    paddingRight: 10,
        
  },
    flexItemRow: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: "row",
     

  },
});

const AppBar = () => {
const authStorage = useContext(AuthStorageContext);
const client = useApolloClient();
const {authorizedUserLoading, authorizedUser} = useAuthorizedUser();

const logout = async () => {
  try{
  await authStorage.removeAccessToken()
  client.resetStore()
   } catch(error){
   }
}

  if(authorizedUserLoading){
    return(
        <View style={styles.flexItemA}>
     <Text fontWeight="bold"fontSize="subheading" color="white">Loading...</Text>
    </View>

    )
  }

  if(!authorizedUser){
   return(
     <>
     <View style={styles.flexItemRow}>
     <ScrollView horizontal contentContainerStyle={{backgroundColor: '#24292e', flexWrap: "nowrap"}}>
     <View style={styles.flexItemA}>
     <Link to="/signin" component={TouchableOpacity} activeOpacity={0.8}>
     <Text fontWeight="bold"fontSize="subheading" color="white">Sign in</Text>
    </Link>
    </View>
        <View style={styles.flexItemA}>
     <Link to="/signup" component={TouchableOpacity} activeOpacity={0.8}>
     <Text fontWeight="bold"fontSize="subheading" color="white">Sign up</Text>
    </Link>
    </View>
    <View style={styles.flexItemA}>
     <Link to="/" component={TouchableOpacity} activeOpacity={0.8}>
     <Text fontWeight="bold"fontSize="subheading" color="white">Repositories</Text>
     </Link>
       </View>
    </ScrollView>
    </View>
    
   </>
   )
  }
  if(authorizedUser)
  return(
    <>
     <View style={styles.flexItemRow}>
     <ScrollView horizontal contentContainerStyle={{backgroundColor: '#24292e', flexWrap: "nowrap"}}>
  
    <View style={styles.flexItemA}>
    <Link to="/" component={TouchableOpacity} activeOpacity={0.8}>
     <Text  fontWeight="bold"fontSize="subheading" color="white">Repositories</Text>
     </Link>
       </View>

         
    <View style={styles.flexItemA}>
    <Link to="/review" component={TouchableOpacity} activeOpacity={0.8}>
     <Text  fontWeight="bold"fontSize="subheading" color="white">Create a review</Text>
     </Link>
       </View>

    <View style={styles.flexItemA}>
    <Link to="/my_reviews" component={TouchableOpacity} activeOpacity={0.8}>
     <Text  fontWeight="bold"fontSize="subheading" color="white">My reviews</Text>
     </Link>
       </View>


         <View style={styles.flexItemA}>
     <Text component={TouchableOpacity} activeOpacity={0.8} onPress={()=>logout()} fontWeight="bold"fontSize="subheading" color="white">Sign out</Text>
    </View>


    </ScrollView>
    </View>
    
   </>
     
  )};

export default AppBar;