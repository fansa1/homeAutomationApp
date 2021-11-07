import React from 'react';
import Text from './Text'
import { Image, View, StyleSheet, TouchableOpacity,} from 'react-native';



const styles = StyleSheet.create({

  flexItemA: {
    flexGrow: 0,
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 15,
  },
    flexItemLowerRows: {
    flexGrow: 1,
    flexDirection: "row",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    justifyContent: "space-between"
  },
    flexItemLowerColumns: {
    flexWrap: "nowrap",
    paddingTop: 2,
    paddingLeft: 10,
    flexShrink: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
    flexItemRoundedImage: {
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    width: 50,
    height: 50
  },

  flexItemB: {
    flexWrap: "nowrap",
    paddingTop: 2,
    paddingLeft: 10,
    flexShrink: 1,
    flexDirection: "column",
  },
   flexItemC: {
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 5,
    backgroundColor:'#0366d6',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
  },
});



export const RenderItem = ({ item}) => {
  

  let roundedStars = item.stargazersCount
  if(item.stargazersCount >= 1000){
    roundedStars=`${(item.stargazersCount/1000).toFixed(1)} k`
  }
   let roundedForks = item.forksCount
  if(item.forksCount >= 1000){
    roundedForks=`${(item.forksCount /1000).toFixed(1)} k`
  }



  return( 
  <View>   

  

        <View style={styles.flexItemA}>
        <Image style={styles.flexItemRoundedImage} source={{uri: item.ownerAvatarUrl}} /> 
        <View  style={styles.flexItemB}>   
        <Text testID="fullName" fontWeight="bold"fontSize="subheading" color="secondary">{ item.fullName }</Text>
        <Text testID="description" fontWeight="normal"fontSize="subheading" color="textSecondary">{item.description }</Text>
        </View>
        </View>
          <View style={styles.flexItemA}>
          <Image style={{width: 50}} /> 
          <View style={styles.flexItemC}>
        <Text testID="language" fontWeight="normal"fontSize="subheading" color="white">{item.language }</Text>
        </View>
         </View>
         <View style={styles.flexItemLowerRows}>
         <View style={styles.flexItemLowerColumns}>  
        <Text testID="stars"  fontWeight="bold"fontSize="subheading" color="secondary">{roundedStars}</Text>
        <Text fontWeight="normal"fontSize="subheading" color="textSecondary">Stars</Text>
        </View>
         <View style={styles.flexItemLowerColumns}>  
        <Text testID="forks" fontWeight="bold"fontSize="subheading" color="secondary">{roundedForks} </Text>
         <Text fontWeight="normal"fontSize="subheading" color="textSecondary">Forks</Text>
         </View>
          <View style={styles.flexItemLowerColumns}>  
        <Text testID="review" fontWeight="bold"fontSize="subheading" color="secondary">{item.reviewCount } </Text>
        <Text fontWeight="normal"fontSize="subheading" color="textSecondary"> Rewiews </Text>
        </View>
         <View style={styles.flexItemLowerColumns}>  
        <Text testID="rating"  fontWeight="bold"fontSize="subheading" color="secondary">{item.ratingAverage} </Text>
         <Text fontWeight="normal"fontSize="subheading" color="textSecondary">Rating</Text>
        </View>
        </View>
        </View>   
        
    )}