import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import userReducer from './src/reducers/userReducer'
import resetPasswordReducer from './src/reducers/resetPasswordReducer'

const reducer = combineReducers({
  user: userReducer,
  resetPassword: resetPasswordReducer
})

const store = 
  createStore(reducer, 
  composeWithDevTools(
  applyMiddleware(thunk)))

export default store