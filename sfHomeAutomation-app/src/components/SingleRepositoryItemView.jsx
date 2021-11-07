import React from 'react';
import Text from './Text'
import { FlatList, Image, View, StyleSheet, Button, TouchableOpacity} from 'react-native';
import useSingleRepository from '../hooks/useSingleRepository';
import { useQuery } from '@apollo/react-hooks';
import * as WebBrowser from 'expo-web-browser';
import { format } from 'date-fns'

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
});

const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepositoryItemView = ({itemID}) => { 
const { repositoryLoading, reviewItems, item, fetchMore} = useSingleRepository({ id: itemID});

const openGitHubPage = (url) => {
     console.log(url)
     WebBrowser.openBrowserAsync(url);
}

if(repositoryLoading ){
  return(
    <View>
    <Text fontWeight="bold"fontSize="subheading" color="secondary">Loading...</Text>
    </View>
  )
}

let roundedStars = item.stargazersCount
  if(item.stargazersCount >= 1000){
    roundedStars=`${(item.stargazersCount/1000).toFixed(1)} k`
  }
   let roundedForks = item.forksCount
  if(item.forksCount >= 1000){
    roundedForks=`${(item.forksCount /1000).toFixed(1)} k`
  }


const SingleRepositoryInfo = () => {
  
  return( 
  <View>   

        <View style={styles.rowContainer}>
        <Image style={styles.roundedImageContainer} source={{uri: item.ownerAvatarUrl}} /> 
        <View  style={styles.columnContainer}>   
        <Text testID="fullName" fontWeight="bold"fontSize="subheading" color="secondary">{ item.fullName }</Text>
        <Text testID="description" fontWeight="normal"fontSize="subheading" color="textSecondary">{item.description }</Text>
        </View>
        </View>
          <View style={styles.rowContainer}>
          <Image style={{width: 50}} /> 
          <View style={styles.textContainer}>
        <Text testID="language" fontWeight="normal"fontSize="subheading" color="white">{item.language }</Text>
        </View>
         </View>
         <View style={styles.lowerRowsContainer}>
         <View style={styles.lowerColumnsContainer}>  
        <Text testID="stars"  fontWeight="bold"fontSize="subheading" color="secondary">{roundedStars}</Text>
        <Text fontWeight="normal"fontSize="subheading" color="textSecondary">Stars</Text>
        </View>
         <View style={styles.lowerColumnsContainer}>  
        <Text testID="forks" fontWeight="bold"fontSize="subheading" color="secondary">{roundedForks} </Text>
         <Text fontWeight="normal"fontSize="subheading" color="textSecondary">Forks</Text>
         </View>
          <View style={styles.lowerColumnsContainer}>  
        <Text testID="review" fontWeight="bold"fontSize="subheading" color="secondary">{item.reviewCount } </Text>
        <Text fontWeight="normal"fontSize="subheading" color="textSecondary"> Rewiews </Text>
        </View>
         <View style={styles.lowerColumnsContainer}>  
        <Text testID="rating"  fontWeight="bold"fontSize="subheading" color="secondary">{item.ratingAverage} </Text>
         <Text fontWeight="normal"fontSize="subheading" color="textSecondary">Rating</Text>
        </View>
        </View>
             <View style={styles.urlContainer}>
     <Button title="Open in GitHub" color='#0366d6'fontWeight="bold"fontSize="subheading" onPress={()=>openGitHubPage(data.repository.url)}/>
    </View>
        </View>   
   
     
    )}

   

    const RepositoryReview = ({item}) => {
  
  return( 
   

        <View style={styles.rowContainer}>
        <View style={styles.circleContainer}>  
        <Text style={{fontSize: 20}} fontWeight="bold" color="primary"> { item.rating }</Text>
        </View>
        <View  style={styles.columnContainer}>   
        <Text testID="fullName" fontWeight="bold"fontSize="subheading" color="secondary">{ item.user.username }</Text>
        <Text testID="description" fontWeight="normal"fontSize="subheading" color="textSecondary">{format(new Date(item.createdAt), 'dd.MM.yyyy')}</Text>
        <Text testID="language" fontWeight="normal"fontSize="subheading" color="secondary">{item.text }</Text>
        </View>
        </View>
         
   
     
    )}

     const onEndReach = () => {
    fetchMore();
    console.log('You have reached the end of the list');
  };

    return(
     <FlatList
      
      data={reviewItems}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={({ id }) => id}
      renderItem={({item}) => (
      <RepositoryReview item={item}/>
)} 
      ListHeaderComponent={() => <SingleRepositoryInfo />} 
       onEndReached={onEndReach}
     onEndReachedThreshold={0.5}
    />  

    )}

     

export default SingleRepositoryItemView;