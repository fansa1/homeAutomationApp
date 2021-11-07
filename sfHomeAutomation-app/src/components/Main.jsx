import React from 'react';
import Constants from 'expo-constants';
import RepositoryList from './RepositoryList'
import SingleRepositoryItemView from './SingleRepositoryItemView'
import SignIn from './SignIn'
import RewiewForm from './RewiewForm'
import SignUpForm from './SignUpForm'
import MyReviews from './MyReviews'
import { View, StyleSheet} from 'react-native';
import Text from './Text'
import AppBar from './AppBar'
import { Route, Router, Switch, Redirect } from 'react-router-native';
import theme from './theme';


const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  

  return (
    <View style={styles.container}>
    <AppBar/>
    <Switch>
    <Route exact path="/"  render={() => <RepositoryList/>} />
    <Route path="/repositories/:id" render={({ match }) =>
    <SingleRepositoryItemView itemID={(match.params.id)} />} />
   <Route exact  path="/my_reviews" component={MyReviews} />
    <Route path="/signup" component={SignUpForm} />
    <Route path="/signin" component={SignIn} />
     <Route exact  path="/review" component={RewiewForm} />
    <Redirect to="/" />
    </Switch>
    
    
    </View>
  );
};

export default Main;