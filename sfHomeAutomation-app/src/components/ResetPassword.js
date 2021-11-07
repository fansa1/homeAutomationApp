import 'react-native-gesture-handler';
import  React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, HelperText, Text, TextInput, Card, Title, Checkbox, Subheading } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { resetPassword, resetPasswordErrorReset} from '../reducers/resetPasswordReducer' 

function ResetPassword({navigation}) {

  const styles = StyleSheet.create({
  flexItemCard: {
    flexGrow: 0,
    flexShrink: 1,
    marginLeft:10,
    marginRight:10,
    marginTop:30,
    marginBottom: 25,
    paddingLeft: 10,
    paddingRight: 10,
        
  },
    
    flexItemButton: {
    marginTop:30,
    marginBottom: 25,
    flexGrow: 0,
    flexShrink: 1,

  },
});

  const dispatch  = useDispatch()
  const [email, setEmail] = useState('');
  const resetFail = useSelector(state => state.resetPassword.resetFail)
  const resetSuccess = useSelector(state => state.resetPassword.resetSuccess)
  console.log(`siis resetti${resetFail}`)
  if(resetFail===true){
    setTimeout(() => {
    dispatch(resetPasswordErrorReset())
    }, 500)
   }

   if(resetSuccess===true){
    dispatch(resetPasswordErrorReset())
    Alert.alert("Check your email and login with your new password")
    
   }

  const clearAndDispatch = () => {
  dispatch(resetPassword({email}))
  setEmail('')
  }


  return (
    <>
    <View style={styles.flexItemCard}>
      <Card>
    <Card.Title title="Reset Password"/>
    <Card.Content>
      
        <TextInput
        mode="outlined"
        label="email address"
        placeholder="Type your email here"
        value={email}
        onChangeText={setEmail}
        right={<TextInput.Icon name="email" />}
      />
      <HelperText type="error" visible={resetFail}>
        No such registered email!
      </HelperText>
     

      <View style={styles.flexItemButton}>
      <Button mode="outlined" onPress={() => clearAndDispatch()}>
      Reset Password!
      </Button> 
      </View>

    
      
    </Card.Content>
  </Card>
   
      
    </View>
    </>
  );
}

export default ResetPassword;