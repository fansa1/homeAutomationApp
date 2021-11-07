import  React, {useState, useEffect} from 'react';
import firebase from 'firebase/app'
import "firebase/auth"
import Constants from 'expo-constants';


const firebaseConfig = {
  apiKey: Constants.manifest.extra.key,
  databaseURL: Constants.manifest.extra.database,
  projectId: Constants.manifest.extra.project,
  appId: Constants.manifest.extra.app,
};

const resetPasswordReducer = (state = {resetFail: false, resetSuccess: false}, action) => {

 switch (action.type) {
    
    case 'RESET_PASSWORD':

      if(action.content==="fail"){
      return {resetFail: true, resetSuccess: false}
      }
      return {resetFail: false, resetSuccess: true}

    case 'RESET_PASSWORD_ERROR_RESET':
      return {resetFail: false, resetSuccess: false}

      default:
      return state
  }
}


export const resetPasswordErrorReset = () => {
    return async dispatch => {
    try{
    dispatch(
    {type: 'RESET_PASSWORD_ERROR_RESET'})
    }catch(exception){
    }
  }
}

export const resetPassword = (credential) => {

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

    return async dispatch => {
    try{
       await firebase.auth().sendPasswordResetEmail(credential.email.toString())
       dispatch(
       {type: 'RESET_PASSWORD',
       content: "success"})
      }catch (exception) {
        try{
        dispatch(
       {type: 'RESET_PASSWORD',
       content: "fail"})
      }catch(error){}}
}
}

export default resetPasswordReducer