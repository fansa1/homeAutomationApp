import 'react-native-gesture-handler';
import  React, {useState, useEffect, Component} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { computeBoxplotStats } from 'react-boxplot'

import { View, StyleSheet, Image, ScrollView, Dimensions} from 'react-native';
import { Appbar, Avatar, Switch, Button, ActivityIndicator, Card, DataTable, Title, Text, Checkbox, Subheading, Paragraph} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';


import firebase from 'firebase/app';
import "firebase/firestore"
import "firebase/auth"
import "firebase/database"
import Constants from 'expo-constants';
import {LineChart} from "react-native-chart-kit";


const firebaseConfig = {
  apiKey: Constants.manifest.extra.key,
  databaseURL: Constants.manifest.extra.database,
  projectId: Constants.manifest.extra.project,
  appId: Constants.manifest.extra.app,
};

  const styles = StyleSheet.create({
  flexItemCard: {
    flexGrow: 0,
    flexShrink: 1,
    marginLeft:10,
    marginRight:10,
    marginTop:30,
    marginBottom: 25,
    paddingLeft: 10,
    paddingRight: 10,   
  },
});
    

function GreenHouse ({navigation}) {
  const dateToday = new Date()
  const [tempGraphAndTableData, setTempGraphAndTableData] = useState([]);
  const [humidityGraphAndTableData, setHumidityGraphAndTableData] = useState([]);
  const [tempArrayReady, setTempArrayReady] = useState(false);
  

  
  const getAndSetGraphAndTableData = async (today) => {
  let tempTodayArray = []
  let humidityTodayArray = []
  let xAxisArray = []
  let tempWeekArray = []
  let tempMonthArray = []
  let humidityWeekArray = []
  let humidityMonthArray= []

  !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
  const db = firebase.firestore();
  let tempsRef = db.collection('greenHouseTemperatures');
  let humidityRef = db.collection('greenHouseHumidity');

   try{
     let allTemps = await tempsRef.where('time', '>', new Date(today.getFullYear(), today.getMonth()-1, today.getDate())).orderBy('time', 'asc').get()
     for(const doc of allTemps.docs){
 
      if(doc.data().time.toDate().getDate()===today.getDate() && doc.data().time.toDate().getMonth()===today.getMonth() && doc.data().time.toDate().getYear()===today.getYear() && doc.data().temperature!==undefined){
      tempTodayArray =  tempTodayArray.concat(doc.data().temperature)
      }
      if(doc.data().time.toDate() > new Date(today.getFullYear(), today.getMonth(), today.getDate()-7) && doc.data().temperature!==undefined){
      tempWeekArray= tempWeekArray.concat(doc.data().temperature)
      }
       if(doc.data().temperature!==undefined){
      tempMonthArray= tempMonthArray.concat(doc.data().temperature)
       }
      }     
  }catch{
    console.log("Something in get temp data from firestore failed")
  }

  
   try{
     let allHumidity = await humidityRef.where('time', '>', new Date(today.getFullYear(), today.getMonth()-1, today.getDate())).orderBy('time', 'asc').get();
     for(const doc of allHumidity.docs){
      if(doc.data().time.toDate().getDate()===today.getDate() && doc.data().time.toDate().getMonth()===today.getMonth() && doc.data().time.toDate().getYear()===today.getYear() && doc.data().humidity!==undefined){
      humidityTodayArray =  humidityTodayArray.concat(doc.data().humidity)
      }
      if(doc.data().time.toDate() > new Date(today.getFullYear(), today.getMonth(), today.getDate()-7) && doc.data().humidity!==undefined) {
      humidityWeekArray= humidityWeekArray.concat(doc.data().humidity)
      //console.log(humidityWeekArray)
     }
     if(doc.data().humidity!==undefined){
      humidityMonthArray= humidityMonthArray.concat(doc.data().humidity)
     }
      }
  }catch{
    console.log("Something in get humidity data from firestore failed")
  }

 
  if(tempTodayArray.length>8){
     for (let i = 0; i < tempTodayArray.length; i++) {
     if(i===0 || i%3===0){
     xAxisArray = xAxisArray.concat((i).toString())
     }else{
    xAxisArray = xAxisArray.concat("")
     }
    }
  }else{
     for (let i = 0; i < tempTodayArray.length; i++) {
     xAxisArray = xAxisArray.concat((i).toString())
     }
  }



try{
   let tempWeekStats = {"quartile2": "Not available", "whiskerLow": "Not available", "whiskerHigh": "Not available"} 
   let tempMonthStats = {"quartile2": "Not available", "whiskerLow": "Not available", "whiskerHigh": "Not available"} 
   let humidityWeekStats = {"quartile2": "Not available", "whiskerLow": "Not available", "whiskerHigh": "Not available"}   
   let humidityMonthStats = {"quartile2": "Not available", "whiskerLow": "Not available", "whiskerHigh": "Not available"} 

   let tableDataArray = [tempWeekArray, tempMonthArray, humidityWeekArray, humidityMonthArray]
   let calculatedResultsDataArray = [tempWeekStats, tempMonthStats, humidityWeekStats, humidityMonthStats]
   console.log(humidityWeekArray)

      const setTableDataArray = (dataArray, resultsArray) => {
   for (let i = 0; i < dataArray.length; i++) {
     if(dataArray[i].length!==0){
         const stats = computeBoxplotStats(dataArray[i])
         resultsArray[i]={"quartile2":  Math.round(stats.quartile2*10)/10, "whiskerLow": Math.round(stats.whiskerLow*10)/10, "whiskerHigh": Math.round(stats.whiskerHigh*10)/10}
         //console.log(resultsArray)
        }
      }
    }

setTableDataArray(tableDataArray, calculatedResultsDataArray)
//console.log(calculatedResultsDataArray[2])

setTempGraphAndTableData([tempTodayArray, xAxisArray, {"title": "Green house temperature", "subtitle": `Date: ${today.getDate()}.${today.getMonth()+1}.${today.getYear()+1900}`}, {"date": "Date", "median": "Median (°C)", "min": "Min (°C)", "max": "Max (°C)"}, 
 [{"id": 1, "date": `Last week`, "median":  calculatedResultsDataArray[0].quartile2, "min": calculatedResultsDataArray[0].whiskerLow, "max": calculatedResultsDataArray[0].whiskerHigh},
  {"id": 2, "date": `Last month`, "median":  calculatedResultsDataArray[1].quartile2, "min": calculatedResultsDataArray[1].whiskerLow, "max": calculatedResultsDataArray[1].whiskerHigh},
  ],{"unit": "°C"}])


setHumidityGraphAndTableData([humidityTodayArray, xAxisArray, {"title": "Green house humidity", "subtitle": `Date: ${today.getDate()}.${today.getMonth()+1}.${today.getYear()+1900}`}, {"date": "Date", "median": "Median (%)", "min": "Min (%)", "max": "Max (%)"}, 
 [{"id": 1, "date": `Last week`, "median":  calculatedResultsDataArray[2].quartile2, "min": calculatedResultsDataArray[2].whiskerLow, "max": calculatedResultsDataArray[2].whiskerHigh},
  {"id": 2, "date": `Last month`, "median":  calculatedResultsDataArray[3].quartile2, "min": calculatedResultsDataArray[3].whiskerLow, "max": calculatedResultsDataArray[3].whiskerHigh},
  ], {"unit": "%"}])

 setTempArrayReady(true)
 }catch{
  console.log("data calculations or structuring failed")
  }
}

  
 useEffect(() => {
    getAndSetGraphAndTableData(dateToday)
  }, [])


const GraphAndTable = ({graphData, graphLabels, graphTitle, tableTitles, tableData, unit}) => {

return(
     <View>
       <Card>
<Card.Content>
<Card.Title title={graphTitle.title} subtitle={graphTitle.subtitle} />
  <LineChart
    data={ {
      labels: graphLabels,
      datasets: [
        {
          data: graphData
        }
      ]
    }}
    width={Dimensions.get("window").width*0.8} // from react-native
    height={220}
   yAxisSuffix={unit.unit}
   
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#3498db",//"#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 1, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
  <Text>Time in hours</Text>
  </Card.Content>
  </Card>
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>{tableTitles.date}</DataTable.Title>
        <DataTable.Title numeric >{tableTitles.median}</DataTable.Title>
        <DataTable.Title numeric>{tableTitles.min}</DataTable.Title>
        <DataTable.Title numeric>{tableTitles.max}</DataTable.Title>
      </DataTable.Header>
      
      {tableData.map(o=> {
        return(
      <DataTable.Row key={o.id}>
        <DataTable.Cell>{o.date}</DataTable.Cell>
        <DataTable.Cell numeric>{o.median}</DataTable.Cell>
        <DataTable.Cell numeric>{o.min}</DataTable.Cell>
        <DataTable.Cell numeric>{o.max}</DataTable.Cell>
      </DataTable.Row>
        )})}
 
    </DataTable>
  </View>
  )
}
if(tempArrayReady===false){
    return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Title>Loading data</Title>
      <ActivityIndicator animating={true}/>
    </View>
    )
}else{
return(
    <ScrollView>
     <View style={styles.flexItemCard}>
      <GraphAndTable graphData={tempGraphAndTableData[0]} graphLabels={tempGraphAndTableData[1]} graphTitle={tempGraphAndTableData[2]} tableTitles={tempGraphAndTableData[3]} tableData={tempGraphAndTableData[4]} unit={tempGraphAndTableData[5]}/>
      <GraphAndTable graphData={humidityGraphAndTableData[0]} graphLabels={humidityGraphAndTableData[1]} graphTitle={humidityGraphAndTableData[2]} tableTitles={humidityGraphAndTableData[3]} tableData={humidityGraphAndTableData[4]} unit={humidityGraphAndTableData[5]}/>
     
      </View>
       </ScrollView>
)}
}

export default GreenHouse;





    