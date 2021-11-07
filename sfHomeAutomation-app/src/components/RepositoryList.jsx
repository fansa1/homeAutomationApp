import React, {useState, useEffect} from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity} from 'react-native';
import {RenderItem} from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import useFilteredRepositories from '../hooks/useFilteredRepositories';
import Text from './Text'
import { useHistory } from "react-router-native";
import RNPickerSelect from 'react-native-picker-select';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from 'use-debounce';

const ItemSeparator = () => <View style={{borderWidth: 10, borderColor: `#f5f5f5`}} />

const RepositoryList =   () => {
let history = useHistory();
const [repositoryOrder, setRepositoryOrder] = useState({orderBy:"CREATED_AT", orderDirection: "DESC"});
const [searchQuery, setSearchQuery] = useState('');
const [searchKeyWord] = useDebounce(searchQuery, 1000)

const Dropdown = () => {
    return (
        <RNPickerSelect
            onValueChange={(value) => setRepositoryOrder(value)}
            items={[
                { label: 'Latest repositories', value: {orderBy: "CREATED_AT", orderDirection: "DESC"}},
                { label: 'Highest rated repositories', value: {orderBy: "RATING_AVERAGE", orderDirection: "DESC"}},
                { label: 'Lowest rated repositories', value: {orderBy: "RATING_AVERAGE", orderDirection: "ASC"}} ,
            ]}
        />
    );
};

const SearchBar = () => {  

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={(query) => setSearchQuery(query)}
      value={searchQuery}
    />
  );
};

const {repositoriesLoading, repositoryNodes, fetchMore} = useRepositories(repositoryOrder);
const {filteredRepositoriesLoading, filteredRepositoryNodes} = useFilteredRepositories(searchKeyWord ? {searchKeyword: searchKeyWord} : {searchKeyword: ''} );
if(filteredRepositoryNodes){
  console.log("haettu")
}
const showSingleRepository = (item) => {
  console.log(item.id)
     history.push(`/repositories/${item.id}`);
}

const onEndReach = () => {
    fetchMore();
    console.log('You have reached the end of the list');
  };

if(repositoriesLoading || filteredRepositoriesLoading){
  return(
    <View>
    <Text fontWeight="bold"fontSize="subheading" color="secondary">Loading...</Text>
    </View>
  )
}

if(filteredRepositoryNodes && (searchKeyWord && searchKeyWord!=='')){
  return (
      <>
      {SearchBar()}
      <Dropdown/>
      <FlatList
      data={filteredRepositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={item => item.id}
      renderItem={({item}) => (

              <TouchableOpacity activeOpacity={0.8} onPress={()=>showSingleRepository(item)}>
             <RenderItem item={item}/>
             </TouchableOpacity>
             )}  
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
    </> 
  );
};
  return (
      <>
       {SearchBar()}
      <Dropdown/>
      <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={item => item.id}
      renderItem={({item}) => (

              <TouchableOpacity activeOpacity={0.8} onPress={()=>showSingleRepository(item)}>
             <RenderItem item={item}/>
             </TouchableOpacity>
             )}  
     onEndReached={onEndReach}
     onEndReachedThreshold={0.5}
    />
    </> 
  );
};

export default RepositoryList;