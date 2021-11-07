import React from 'react';
import { Button, View, StyleSheet} from 'react-native';
import Text from './Text';
import {FormikInput, FormikPassWordInput} from './FormikTextInput'
import { Formik } from 'formik';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useHistory } from 'react-router-native';


const initialValues = {
  userName: '',
  passWord:  '',
};

const styles = StyleSheet.create({
   flexItemA: {
    flexDirection: "column",
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 5,
   }
});

const validationSchema = yup.object().shape({
  userName: yup
    .string()
    .min(4, 'Username must be longer than four letters')
    .required('Username is required'),
  passWord: yup
    .string()
    .min(4, 'Password must be longer than four letters')
    .required('Password is required'),
});

const LoginForm = ({onSubmit}) => {
  
  return(
 <View style={styles.flexItemA}>
      <FormikInput name="userName" placeholder="Username" />
        
      <FormikPassWordInput  name="passWord" placeholder="Password" />
      
      <Button title="Sign in" onPress={onSubmit} >
        <Text fontWeight="bold"fontSize="subheading" color="white">Sign in</Text>
      </Button >
      </View>
  )}

const SignIn = () => {

const history = useHistory();
const [signIn] = useSignIn();


const onSubmit = async (value) => {
  const password = value.passWord
  const username = value.userName
  //console.log(username, password)

    try {
     const {data} = await signIn({ username, password });
      //console.log(data.authorize.accessToken)
     history.push(`/`)
    } catch (e) {
      console.log(e);
    }
  }

return (
    
     <Formik initialValues={initialValues}  onSubmit={onSubmit} validationSchema={validationSchema}>
    {({ handleSubmit }) => <LoginForm onSubmit={handleSubmit} />}
      </Formik>
    
  );
};
export default SignIn;