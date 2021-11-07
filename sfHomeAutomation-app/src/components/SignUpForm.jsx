import React from 'react';
import { Button, View, StyleSheet} from 'react-native';
import Text from './Text'
import {FormikInput, FormikPassWordInput} from './FormikTextInput'
import { Formik } from 'formik';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import useSignUp from '../hooks/useSignUp';
import { useHistory } from 'react-router-native';


const initialValues = {
  userName:'',
  passWord:'',
  passWordConfirmation: '',
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
    .min(1, 'Username must be longer than one character')
    .max(30, 'Username must not be longer than  30 characters')
    .required('Username is required'),
  passWord: yup
    .string()
    .min(5, 'Password must be longer than five characters')
    .max(50, 'Password must not be longer than 50 characters')
    .required('Password is required'),
  passWordConfirmation: yup
  .string()
  .oneOf([yup.ref('passWord'), null], 'Passwords do not match')
  .required('Password confirmation is required')
  });




const SubmitSignUpForm = ({onSubmit}) => {
  
  return(
 <View style={styles.flexItemA}>
  
      <FormikInput name="userName" placeholder="Username" />
 
      <FormikPassWordInput name="passWord" placeholder="Password" />

        <FormikPassWordInput  name="passWordConfirmation" placeholder="Password confirmation" />
        
      <Button title="Sign up" onPress={onSubmit} >
        <Text fontWeight="bold"fontSize="subheading" color="white">Sign up</Text>
      </Button >
      </View>
  )}

const SignUpForm = () => {

const history = useHistory();
const [signUp] = useSignUp();
const [signIn] = useSignIn();


const onSubmit = async (value) => {
  const password = value.passWord
  const username = value.userName
  
  //console.log(username, password)

    try {
     await signUp({ username, password });
     await signIn({ username, password });
      //console.log(data.authorize.accessToken)
     history.push(`/`)
    } catch (e) {
      console.log(e);
    }
  }

return (
    
     <Formik initialValues={initialValues}  onSubmit={onSubmit} validationSchema={validationSchema}>
    {({ handleSubmit }) => <SubmitSignUpForm onSubmit={handleSubmit} />}
      </Formik>
    
  );
};
export default SignUpForm;