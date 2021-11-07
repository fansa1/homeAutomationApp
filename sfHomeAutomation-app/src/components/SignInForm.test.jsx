import React from 'react';
import { Button, View, StyleSheet} from 'react-native';
import Text from './Text';
import {FormikUserNameInput, FormikPassWordInput} from './FormikTextInput'
import { Formik } from 'formik';
import * as yup from 'yup';
import { render, fireEvent, waitFor, act} from '@testing-library/react-native';

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
 <View style={styles.flexItem}>
  <View style={styles.flexItemInput}>
      <FormikUserNameInput name="userName" placeholder="Username" testID="userNameField" />
        </View>
          <View style={styles.flexItemInput}>
      <FormikPassWordInput  name="passWord" placeholder="Password" testID="passWordField"/>
          </View>
      <Button title="Sign in" onPress={onSubmit} testID="submitButton" >
        <Text fontWeight="bold"fontSize="subheading" color="white">Sign in</Text>
      </Button >
      </View>
  )}



describe('Form', () => {
  it('calls function provided by onSubmit prop after pressing the submit button', async () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<Formik initialValues={initialValues}  onSubmit={onSubmit} validationSchema={validationSchema}>
    {({ handleSubmit }) => <LoginForm onSubmit={handleSubmit} />}
      </Formik>);
   
   act(() => {
     fireEvent.changeText(getByTestId('userNameField'), 'kalle');
});

   act(() => {
     fireEvent.changeText(getByTestId('passWordField'), 'password');
});

act(() => {
     fireEvent.press(getByTestId('submitButton'));
});
  
 
       

await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({
      userName: 'kalle',
      passWord: 'password',
    });
});
  })
  });