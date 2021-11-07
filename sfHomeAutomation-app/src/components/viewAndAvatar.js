//<Avatar.Icon size={40} icon="home-floor-1" />
  // <Avatar.Icon size={40} icon="home-floor-2" />
   //<Avatar.Icon size={40} icon="weather-cloudy" />
   // <Avatar.Icon size={40} icon="water-pump" />
   // <Avatar.Icon size={40} icon="water-boiler" />
    //<Avatar.Icon size={40} icon="home-outline" />
//<Avatar.Icon size={40} icon="flash" />
//<Avatar.Icon size={40} icon="sprout" />
//<Avatar.Icon size={40} icon="home-assistant" />
//<Avatar.Icon size={40} icon="rabbit" />
//<Avatar.Icon size={40} icon="panda" />
//<Avatar.Icon size={40} icon="dog" />
//<Avatar.Icon size={40} icon="lipstick" />
//<Avatar.Icon size={40} icon="elephant" />
//<Avatar.Icon size={40} icon="star-outline" />

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
    
    flexItemButton: {
    marginTop:30,
    marginBottom: 25,
    flexGrow: 0,
    flexShrink: 1,

  },

   flexItemsInRow: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop:10,
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

   CardsInRow: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "space-between"
    
  },

    AvatarAndSwitch: {
    flexGrow: 0,
    flexShrink: 1,
    marginRight: 10,
    marginLeft: 10,
    
  },

   tinyLogo: {
    width: 50,
    height: 50
}
});





[
  {
    name: "Bypass Time",
    minutes: 20,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Heat Recovery Time",
    population: 50,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Defrosting Time",
    population: 10,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
]


     const month = doc.data().time.toDate().getMonth()+1
      const year = doc.data().time.toDate().getYear()+1900
      const temperature = doc.data().temperature
      //console.log(doc.data().time.toDate().getDate())
  
      tempAllArray = tempAllArray.concat({"month": month, "year": year, "temp": temperature})

       let monthArray = []
 let longTermXLabels = []
 let sum = 0
 let mean = null
 let min =null
 let max =null
 let index = 0

     for (let i = 0; i < tempAllArray.length; i++) {
     if(i<=tempAllArray.length-2 && tempAllArray[i+1].month===tempAllArray[i].month && tempAllArray[i+1].year===tempAllArray[i].year){
     sum = sum + tempAllArray[i].temp
     if(min===null){
      min =tempAllArray[i].temp
     }
     if(tempAllArray[i].temp>=min){
         min=min
     }
     if(tempAllArray[i].temp<min){
         min=tempAllArray[i].temp
     }
     if(max===null){
         max = tempAllArray[i].temp
     }
      if(tempAllArray[i].temp>=max){
         max=tempAllArray[i].temp
     }
      if(tempAllArray[i].temp<max){
         max=max
     }
     index = index+1
     if (index > 0){
         mean = sum/index
     }
     }else{
     monthArray = monthArray.concat({"month": tempAllArray[i].month, "mean": mean, "min": min, "max": max})
     //console.log(monthArray)
     mean = null
     min = null
     max = null
     sum = 0
     index = 0
     }
    }

    if(monthArray.length>8){
     for (let i = 0; i < monthArray.length; i++) {
     if(i===0 || i%3===0){
     longTermXLabels = longTermXLabels.concat((i/12).toString())
     }else{
    longTermXLabels = longTermXLabels.concat("")
     }
    }
  }else{
     for (let i = 0; i < monthArray.length; i++) {
     longTermXLabels = longTermXLabels.concat((i/12).toString())
     }
  }

   setTempAll({"graphData": [{data: monthArray.map(o=>o.max)},{data: monthArray.map(o=>o.mean)},{data: monthArray.map(o=>o.min)}],
 "graphLabels": longTermXLabels, "graphTitle": "Green house temperatures"})


<Text>Time in years starting from 16.8.2021</Text>
  </Card.Content>
  </Card>
  </View>
    )
}
// 
  <LongTermDataGraph graphData={tempAll} graphLabels={tempAll} graphTitle={tempAll}/>

  const LongTermDataGraph = ({graphData, graphLabels, graphTitle}) => {
    //console.log(graphTitle.graphTitle)
    //
    return(
     <View>
       <Card>
<Card.Content>
<Card.Title title={graphTitle.graphTitle} subtitle="Data presented as max, mean, min" />
    <LineChart
    data={ {
      labels: graphLabels.graphLabels,
      datasets: [
        graphData.graphData[0], graphData.graphData[1], graphData.graphData[2]
      ]
    }}
   
    width={Dimensions.get("window").width*0.8} // from react-native
    height={220}
   yAxisSuffix="(°C)"
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