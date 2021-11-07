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

const userReducer = (state = {userUid: null, isSignout: true, isLoading: false, signInFail: false}, action) => {

  switch (action.type) {

    case 'SIGNING_IN':
       return {userUid: null, isSignout: true, isLoading: true, signInFail: false}
    
    case 'SIGN_IN':

      if(action.content===null){        
      return {userUid: null, isSignout: true, isLoading: false, signInFail: true}
      }
      return {userUid: action.content, isSignout: false, isLoading: false, signinFail: false}

    case 'SIGN_IN_FAIL_RESET':
      return {userUid: null, isSignout: true, isLoading: false, signInFail: false}

    case 'SIGN_OUT':
      return {userUid: null, isSignout: true, isLoading: false, signInFail: false}

    case 'RESTORE_TOKEN':
      if(action.content===null){
      return {userUid: null, isSignout: true, isLoading: false, signInFail: false}
      }
      return {userUid: action.content, isSignout: false, isLoading: false, signInFail: false}
 
      default:
      return state
      }
  }

export const signIn = (logincredentials) => {

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
    
    return async dispatch => {
    try{
       dispatch(
       {type: 'SIGNING_IN'})
       await firebase.auth().signInWithEmailAndPassword(logincredentials.username, logincredentials.password)
       const user = await firebase.auth().currentUser
       dispatch(
       {type: 'SIGN_IN',
       content: user.uid})
      }catch (exception) {
        try{
      setTimeout(() => {
         dispatch(
       {type: 'SIGN_IN_FAIL_RESET'})
       }, 3000)
     dispatch(
      {type: 'SIGN_IN',
      content: null})  
      }catch(error){}}
}
}

export const signOut = () => {

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()


    return async dispatch => {
    try{
    await firebase.auth().signOut()
    dispatch(
    {type: 'SIGN_OUT',
    }
    )
    }catch(exception){

    }
  }
}

export const restoreToken = (uid) => {
    return async dispatch => {
    try{
    dispatch(
    {type: 'RESTORE_TOKEN',
    content: uid})
    //console.log(uid)
    }
    catch(exception){
    }
  }
}








export default userReducer