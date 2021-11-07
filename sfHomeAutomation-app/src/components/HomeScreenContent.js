import 'react-native-gesture-handler';
import  React, {useState, useEffect, Component} from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { Alert, View, Platform, StyleSheet, Image, ScrollView, Dimensions, Button, Text} from 'react-native';
import { Appbar, Avatar, Switch, List, ActivityIndicator, Card, DataTable, Badge, Title, Checkbox, Subheading} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import firebase from 'firebase/app';
import "firebase/firestore"
import "firebase/auth"
import "firebase/database"

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {PieChart, LineChart} from "react-native-chart-kit";


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
    

const chartConfig = {
  backgroundGradientFrom: "#000000",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#000000",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 6, // optional, default 3
  //barPercentage: 0.5,
  fillShadowGradient: "#000000",
  fillShadowGradientOpacity: 1,
  useShadowColorFromDataset: false,
  };

  const TempOutSide = () => {
    return(
      <>
      <Badge>10</Badge>
      </>
    )
  }
    
function HomeScreenContent ({navigation}) {
 const [pieChartData, setPieChartData] = useState([]);
 const [pieChartTitles, setPieChartTitles] = useState('');
 const [fanData, setFanData] = useState([]);
 const [humidityData, setHumidityData] = useState([]);
 const [upStairsTempNow, setUpStairsTempNow]=useState('')
 const [downStairsTempNow, setDownStairsTempNow]=useState('')
 const [upStairsTempMin, setUpStairsTempMin]=useState('')
 const [downStairsTempMin, setDownStairsTempMin]=useState('')
 const [upStairsTempMax, setUpStairsTempMax]=useState('')
 const [downStairsTempMax, setDownStairsTempMax]=useState('')
const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);
 
 const dateToday = new Date()
 const today= `Date: ${dateToday.getDate()}.${dateToday.getMonth()+1}.${dateToday.getYear()+1900}`
 let bypassTime = 0
 let heatRecoveryTime = 0
 let defrostingTime = 0
 let bypassPercentage = 0
 let heatRecoveryPercentage = 0
 let defrostingPercentage = 0
 let fanArray = []
 let humidityArray = []
 let timeArray = []
 let xAxisArray = []
 let houseTemp = ''

 !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
 const db = firebase.firestore();
 const time = firebase.firestore.Timestamp.now()
const Kokeilu = () => {
  return(
    <>
    <List.Item
    title={pieChartTitles.defrostingTime}
    left={props => <List.Icon {...props} color="#DBDA69" icon="circle" />}
  />
  </>
  )
}

const getAndSetData = async () => {
   let houseRef = ''
   if(db.collection('houseData')){
     houseRef = db.collection('houseData')
   };
   let houseTempRef = ''
    if(db.collection('houseTemp')){
     houseTempRef = db.collection('houseTemp')
   };

   try{
     let allRefs = await houseRef.orderBy('time', 'asc').get();
     for(const doc of allRefs.docs){
      if(doc.data().time.toDate().getDate()===dateToday.getDate() && doc.data().time.toDate().getMonth()===dateToday.getMonth() && doc.data().time.toDate().getYear()===dateToday.getYear()){
      bypassTime =  bypassTime + doc.data().bypassTime
      heatRecoveryTime =  heatRecoveryTime + doc.data().heatRecoveryTime
      defrostingTime =  defrostingTime + doc.data().defrostingTime
      
      fanArray= fanArray.concat(doc.data().fanSpeed.max)
      
      humidityArray= humidityArray.concat(doc.data().humidity.max)
      
      timeArray = timeArray.concat(doc.data().time.toDate().getHours())
      console.log(timeArray)
      }
      }     
  }catch{
    console.log("could not get houseData")
  }
   try{
     const houseTemp = await houseTempRef.doc('tempNow').get(); 
     setUpStairsTempNow(Math.round(houseTemp.data().upStairsTempNow*10)/10)
     setDownStairsTempNow(Math.round(houseTemp.data().downStairsTempNow*10)/10)
     setUpStairsTempMin(Math.round(houseTemp.data().upStairsMinTemp*10)/10)
     setDownStairsTempMin(Math.round(houseTemp.data().downStairsMinTemp*10)/10)
     setUpStairsTempMax(Math.round(houseTemp.data().upStairsMaxTemp*10)/10)
     setDownStairsTempMax(Math.round(houseTemp.data().donwStairsMaxTemp*10)/10)
   }catch{
    console.log("could not get houseTemp")
  }

  

 if((bypassTime+heatRecoveryTime+defrostingTime)!==0){
 bypassPercentage = bypassTime/(bypassTime+heatRecoveryTime+defrostingTime)*100
 heatRecoveryPercentage = heatRecoveryTime/(bypassTime+heatRecoveryTime+defrostingTime)*100
 defrostingPercentage = defrostingTime/(bypassTime+heatRecoveryTime+defrostingTime)*100
 }
   setPieChartData([
  {
    name: "% Bypass Time",
    population: bypassPercentage,
    color: "#2F6A8F",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "% Heat Recovery Time",
    population: heatRecoveryPercentage,
    color: "#DB5454",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "% Defrosting Time",
    population: defrostingPercentage,
    color: "#DBDA69",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }])

  setPieChartTitles({heatRecoveryTime: `Heat Recovery Time ${heatRecoveryPercentage}%`, bypassTime: `Bypass Time ${bypassPercentage}%`, defrostingTime: `Defrosting Time ${defrostingPercentage}%`})
   
   if(timeArray.length>6){
     for (let i = 0; i < timeArray.length; i++) {
     if(i===0 || i%3===0){
     xAxisArray = xAxisArray.concat((timeArray[i]).toString())
     //console.log(timeArray[i])
     }else{
    xAxisArray = xAxisArray.concat("")
     }
    }
  }else{
     for (let i = 0; i < timeArray.length; i++) {
     xAxisArray = xAxisArray.concat((i).toString())
     }
  }
  setFanData([fanArray, xAxisArray])
  setHumidityData([humidityArray, xAxisArray])
}


  
    
 
  useEffect(() => {
  getAndSetData() 
  db.collection('getTemp')
  .doc('tempNow')
  .set({
    time: time,
  })
  }, [])

//today = Date: 6.10.2020
  
    if(pieChartData.length===0 || fanData.length===0 || humidityData.length===0){
      //console.log("toimii")
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
    
  <Card>
<Card.Content>
<Card.Title title= "Temperatures (°C)" subtitle={today} />

  <List.Section title="Accordions">
      <List.Accordion
        title="outside temp now +5"
        left={props => <List.Icon {...props} icon="thermometer-lines" />}>
        <List.Item title="min temp -1" />
        <List.Item title="max temp +8" />
      </List.Accordion>
      <List.Accordion
        title="downstairs temp now +5"
        left={props => <List.Icon {...props} icon="home-floor-1" />}>
        <List.Item title="min temp -1" />
        <List.Item title="max temp +8" />
      </List.Accordion>
  </List.Section>

    <DataTable>


            <DataTable.Header>
        <DataTable.Title>     </DataTable.Title>
        <DataTable.Title numeric >Now</DataTable.Title>
        <DataTable.Title numeric>Min</DataTable.Title>
        <DataTable.Title numeric>Max</DataTable.Title>
      </DataTable.Header>
      
      <DataTable.Row key="1">
        <DataTable.Cell>Outside</DataTable.Cell>
        <DataTable.Cell numeric>10</DataTable.Cell>
        <DataTable.Cell numeric>7.2</DataTable.Cell>
        <DataTable.Cell numeric>14.1</DataTable.Cell>
      </DataTable.Row>

           <DataTable.Row key="2">
        <DataTable.Cell>Upstairs</DataTable.Cell>
        <DataTable.Cell numeric>{upStairsTempNow}</DataTable.Cell>
        <DataTable.Cell numeric>{upStairsTempMin}</DataTable.Cell>
        <DataTable.Cell numeric>{upStairsTempMax}</DataTable.Cell>
      </DataTable.Row>

       <DataTable.Row key="3">
        <DataTable.Cell>Downstairs</DataTable.Cell>
        <DataTable.Cell numeric>{downStairsTempNow}</DataTable.Cell>
        <DataTable.Cell numeric>{downStairsTempMin}</DataTable.Cell>
        <DataTable.Cell numeric>{downStairsTempMax}</DataTable.Cell>
      </DataTable.Row>

          <DataTable.Row key="4">
        <DataTable.Cell>Storage</DataTable.Cell>
        <DataTable.Cell numeric>14.2</DataTable.Cell>
        <DataTable.Cell numeric>15.1</DataTable.Cell>
        <DataTable.Cell numeric>13.8</DataTable.Cell>
      </DataTable.Row>
 
    </DataTable>
    </Card.Content>
  </Card> 
   
    <Card>
<Card.Content>
<Card.Title title="Cell state" subtitle={today}/>
  <PieChart
  data={pieChartData}
  width={Dimensions.get("window").width} 
  height={200}
  chartConfig={chartConfig}
  accessor={"population"}
  backgroundColor={"transparent"}
  paddingLeft={Dimensions.get("window").width/ 3}
   center={[0,0]}
   hasLegend={false}
  absolute
/>    
<List.Item
    title={pieChartTitles.heatRecoveryTime}
    left={props => <List.Icon {...props} color="#DB5454" icon="circle" />}
  />
  <List.Item
    title={pieChartTitles.bypassTime}
    left={props => <List.Icon {...props} color="#2F6A8F" icon="circle" />}
  />
  <List.Item
    title={pieChartTitles.defrostingTime}
    left={props => <List.Icon {...props} color="#DBDA69" icon="circle" />}
  />
  
  </Card.Content>
  </Card>    
<Card>
<Card.Content>
<Card.Title title="Fan speed & humidity" subtitle={today}/>
  <LineChart
    data={{
      labels: fanData[1],
      datasets: [         
        {data: fanData[0]},
        {data: humidityData[0], color: (opacity) => `rgba(197,219,105, 0.9)`, strokeWidth: 5}
      ]
    // 219,84,84 
    }}
    withVerticalLines = {false}
    withHorizontalLines = {false}
    withShadow={false}
    withDots = {false}
    width={Dimensions.get("window").width*0.8} // from react-native
    height={300}
   yAxisSuffix="%"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={chartConfig}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
  <Text>Time in hours</Text>
    <List.Item
    title="fan speed"
    left={props => <List.Icon {...props} color="#DB5454" icon="circle" />}
  />
  <List.Item
    title="humidity"
    left={props => <List.Icon {...props} color='#C5DB69' icon="circle" />}
  />
  </Card.Content>
  </Card>   
    </View>
    </ScrollView>
  )
}
}







export default HomeScreenContent;





    