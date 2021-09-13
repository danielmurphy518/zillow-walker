/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, TouchableOpacity, Image} from 'react-native';
import RNLocation from 'react-native-location';
const parseString = require('react-native-xml2js').parseString;
import Config from 'react-native-config';
import ButtonWithBackground from './ButtonWithBackground';
import SwitchButton from './SwitchButton'
import {Compass} from './Compass';



var token = Config.ZILLOW_KEY;
var key = Config.GOOGLE_KEY;

RNLocation.configure({
  distanceFilter: null,
});

const App = ({url}) => {
  let testData = [
    [37.5056491, -122.2810426],
    [37.5074878, -122.2839398],

  ];

  [viewLocation, isViewLocation] = useState(testData[2]);
  const [address, setAddress] = useState(0);
  const [value, setValue] = useState(0);
  const [image, setImage] = useState('https://i.ibb.co/hsgQp01/blank.png');
  const [buttonText, setButtonText] = useState("Get Property Value");
  const debug = 1
  const [iteration,setIteration] = useState(0)
  const [appview, setAppView] = useState(false)
  const [viewtext, setViewtext] = useState("View Map")
  const [map, setMap] = useState('https://i.ibb.co/hsgQp01/blank.png')
  const [mapview, setMapview] = useState(false)
  const images = ['https://photos.zillowstatic.com/fp/d40169ce0ecb59345d22991a63b6e8d0-cc_ft_1536.webp','https://photos.zillowstatic.com/fp/55ed45262f29e7892c0bdd0714c94225-cc_ft_1536.webp']


const degree_update_rate = 3; // Number of degrees changed before the callback is triggered

  const getAddress = async () => {
    console.log("iteration is" +iteration)
    await getLocation()
    let googleResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${testData[iteration][0]},${testData[iteration][1]}&key=${key}`)
    let googleJson = await googleResponse.json()
    setAddress(googleJson.results[0].address_components[0].long_name+' '+googleJson.results[0].address_components[1].long_name + ', '+googleJson.results[0].address_components[2].long_name)
    var streetAddress = googleJson.results[0].address_components[0].long_name + ' ' + googleJson.results[0].address_components[1].long_name +'&citystatezip=' + googleJson.results[0].address_components[2].long_name + ' ' + googleJson.results[0].address_components[4].short_name
    var formattedStreetAddress = streetAddress.split(' ').join('+');
    zillow_url = `https://www.zillow.com/webservice/GetSearchResults.htm?zws-id=${token}&address=`+ formattedStreetAddress
    fetch(zillow_url)
    .then(response => response.text())
    .then((response) => {
        parseString(response, function (err, result) {
            zillowResponse = (result)
            var zestimate = zillowResponse["SearchResults:searchresults"].response[0].results[0].result[0].zestimate[0].amount[0]._
            var formattedZestimate =(zestimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            setValue(formattedZestimate);
            setImage(images[iteration])
            setMap(`https://maps.googleapis.com/maps/api/staticmap?center=${googleJson.results[0].address_components[0].long_name+' '+googleJson.results[0].address_components[1].long_name + ', '+googleJson.results[0].address_components[2].long_name}&zoom=18&size=600x300&markers=${googleJson.results[0].address_components[0].long_name+' '+googleJson.results[0].address_components[1].long_name + ', '+googleJson.results[0].address_components[2].long_name}&maptype=roadmap&key=${key}`)
            if (iteration == 1){
              setIteration(0)
            }
            else{
            setIteration(iteration+1)
            }
        });
    }).catch((err) => {
        console.log('fetch', err)
    })

  };
  

  const getLocation = async () => {
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    console.log(permission);

    let location;
    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse',
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
      console.log(permission);
      location = await RNLocation.getLatestLocation({timeout: 100});
      console.log(location);
      console.log(testData[0])
      isViewLocation(location);
    } else {
      location = await RNLocation.getLatestLocation({timeout: 100});
      console.log(location);
      isViewLocation(location);
    }
  };

  const changeView = () =>{
    if (appview == false){
      getAddress()
      setMapview(false)
    }
    setAppView(appview => !appview)
    if (buttonText == "Get Property Value"){
      setButtonText("Back")
    }
    else{
      setButtonText("Get Property Value")
    }
    
  }

  const mapSwitch = () =>{
    setMapview(mapview=> !mapview)
    if (viewtext == "View Map"){
      setViewtext("View Image")
    }
    else{
      setViewtext("View Map")
    }
  }


  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: 'column',
        },
      ]}>
      <View style={{flex: 1, backgroundColor: '#22b2ea'}}>
        <Text style={{textAlign: 'center', padding: 50}}>
          Daniel's Zillow App
        </Text>
        {appview == true && <SwitchButton text={viewtext} onPress={mapSwitch}></SwitchButton>}
        
      </View>
      <View style={{flex: 4, backgroundColor: '#ddeaee'}}>
      {appview == true && mapview == false && <Image source={{uri: image}} style={{width: 400, height: 370}} />}
      {mapview == true && appview == true && <Image source={{uri: map}} style={{width: 400, height: 370}} />}
        {appview == true  != 0 && (
          <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold'}}>
            {address}
          </Text>
        )}
        {appview == true  && (
          <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold'}}>
            Zestimate®:${value}
          </Text>
        
          
        )}
      {appview == false && (<Compass></Compass>)}
      
      </View>
      
      <View style={{flex: 1, backgroundColor: '#22b2ea'}}>
        <View style={{position: 'absolute', justifyContent: 'center'}} />
        <ButtonWithBackground text = {buttonText} onPress={changeView} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
});

export default App;
