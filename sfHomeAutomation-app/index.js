import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React from 'react'
import AppWithoutStore from './App';
import store from './store'
import { Provider as StoreProvider  } from 'react-redux'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';



const App = () => (
     <StoreProvider store={store}>
     <PaperProvider>
     <AppWithoutStore />
     </PaperProvider>
     </StoreProvider>
)
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);