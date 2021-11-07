import 'react-native-gesture-handler';
import  React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, HelperText, Text, TextInput, Card, Title, Checkbox, Subheading } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import {signIn} from '../reducers/userReducer' 

function Login({navigation}) {

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

  flexItemText: {
    marginLeft:10,
    marginRight:10,
    flexGrow: 0,
    flexShrink: 1,

  },

    flexItemPasswordReset: {
    marginTop:10,
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

  const dispatch  = useDispatch()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] =   useState(false);
  const loginFail = useSelector(state => state.user.signInFail)

  
  const clearAndDispatch = () => {
  dispatch(signIn({username, password}))
  setUsername('')
  setPassword('')
  }

const checkAndResetPassword = () => {
  setChecked(!checked)
  setTimeout(() => {
  navigation.navigate('ResetPassword')
  }, 500)
  setTimeout(() => {
  setChecked(checked) 
   }, 500)
  
  }
  


  return (
    <>
      <View style={styles.flexItemCard}>
      <Card>
    <Card.Title title="Login"/>
    <Card.Content>
      
        <TextInput
        mode="outlined"
        label="Username"
        placeholder="Type your email here"
        value={username}
        onChangeText={setUsername}
        right={<TextInput.Icon name="account" />}
      />
      <HelperText type="error" visible={loginFail}>
        Wrong email or password!
      </HelperText>
      <TextInput
        mode="outlined"
        label="Password"
        placeholder="Type your password here"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        right={<TextInput.Icon name="lock" />}
      />

      <View style={styles.flexItemButton}>
      <Button mode="outlined" onPress={() => clearAndDispatch()}>
      Sign in!
      </Button> 
      </View>
      
      <View style={styles.flexItemText}>
      <Text>
      Signup by invite only. If you want to apply for credentials, email samuel.fanta@helsinki.fi
      </Text>
      </View>

      <View style={styles.flexItemPasswordReset}>
      <Checkbox
      status={checked ? 'checked' : 'unchecked'}
      onPress={() => {
        checkAndResetPassword();
      }}
    />
    <Subheading>Forgot password?</Subheading>
     </View>

    </Card.Content>
  </Card>
   
      
    </View>
    </>
  );
}

export default Login;