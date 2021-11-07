import React from 'react';
import Text from './Text'
import { FlatList, Image, View, StyleSheet, Button, TouchableOpacity, Alert} from 'react-native';
import useAuthorizedUser from '../hooks/useAuthorizedUser';
import { useQuery } from '@apollo/react-hooks';
import { format } from 'date-fns'
import { useHistory } from "react-router-native";
import useDeleteReview from '../hooks/useDeleteReview';


const styles = StyleSheet.create({

  rowContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 15,
  },
    lowerRowsContainer: {
    flexGrow: 1,
    flexDirection: "row",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    justifyContent: "space-between"
  },
    lowerColumnsContainer: {
    flexWrap: "nowrap",
    paddingTop: 2,
    paddingLeft: 10,
    flexShrink: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
    roundedImageContainer: {
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    width: 50,
    height: 50
  },

  columnContainer: {
    flexWrap: "nowrap",
    paddingTop: 2,
    paddingLeft: 10,
    flexShrink: 1,
    flexDirection: "column",
    marginRight: 10
  },
   textContainer: {
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 5,
    backgroundColor:'#0366d6',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#0366d6',
  },
    urlContainer: {
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 5,
  },
  separator: {
  borderWidth: 10, 
  borderColor: `#f5f5f5`
  },
circleContainer: {
flexDirection: "column",
width: 50,
height: 50,
borderRadius: 25,
borderColor: '#0366d6',
borderWidth: 3,
justifyContent: "center",
alignItems: "center"
  },
    blueButtonContainer: {
        flex: 1,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'#0366d6',
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#0366d6',
  },
    redButtonContainer: {
        flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor:"crimson",
     borderRadius:5,
    borderWidth: 1,
    borderColor: "crimson",
  },
   buttonRowContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 15,
  },
});



const ItemSeparator = () => <View style={styles.separator} />;

const MyReviews = () => { 
let history = useHistory();
const [deleteReview] = useDeleteReview();
const {authorizedUserLoading, reviewItems} = useAuthorizedUser("getReviews");

const showSingleRepository = (item) => {
  console.log(item.id)
     history.push(`/repositories/${item.id}`);
}

  const createTwoButtonAlert = (item) =>
    Alert.alert(
      "Delete review",
      "Are you sure you want to delete this review?",
      [
        {
          text: "CANCEL",
          onPress: () => console.log("Cancel Pressed")
        },
        { text: "DELETE", onPress: () => onDelete(item) }
      ],
      { cancelable: false }
    );

const onDelete = async (item) => {

    try {
     await deleteReview({id: item});
    } catch (e) {
      console.log(e);
    }
  }

if(authorizedUserLoading){
  return(
    <View>
    <Text fontWeight="bold"fontSize="subheading" color="secondary">Loading...</Text>
    </View>
  )
}

    const RepositoryReview = ({item}) => {
  
  return( 
   
        <>
        <View style={styles.rowContainer}>
        <View style={styles.circleContainer}>  
        <Text style={{fontSize: 20}} fontWeight="bold" color="primary"> { item.rating }</Text>
        </View>
        <View  style={styles.columnContainer}>   
        <Text testID="fullName" fontWeight="bold"fontSize="subheading" color="secondary">{ item.repository.fullName }</Text>
        <Text testID="description" fontWeight="normal"fontSize="subheading" color="textSecondary">{format(new Date(item.createdAt), 'dd.MM.yyyy')}</Text>
        <Text testID="language" fontWeight="normal"fontSize="subheading" color="secondary">{item.text }</Text>
      </View>
        </View>
         <View style={styles.buttonRowContainer}>
        <View style={styles.blueButtonContainer}>  
        <TouchableOpacity activeOpacity={0.8} onPress={()=>showSingleRepository(item.repository)} >
        <Text fontWeight="bold"fontSize="subheading" color="white">Show repository</Text>
        </TouchableOpacity >
        </View>
        <View style={styles.redButtonContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={()=>createTwoButtonAlert(item.id)}>
        <Text fontWeight="bold"fontSize="subheading" color="white">Delete review</Text>
        </TouchableOpacity>
      </View>
      </View>
      </>

         
     
    )}



    return(
     <FlatList
      
      data={reviewItems}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={({ id }) => id}
      renderItem={({item}) => (
      <RepositoryReview item={item}/>)} />  
    )}

     

export default MyReviews;