/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * location=-33.8670,151.1957&radius=500&types=food&key=YOUR_API_KEY
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

import MapView, {Marker, Callout} from 'react-native-maps'

export default class googleMapsTest extends Component {  
  constructor(){
    super()
    this.state = {
      lat: null,
      long: null,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922,
      places: null
    }
  }
  
  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        this.setState({lat, long})
        this.getPlaces()
      }
    )
  }

  getPlaces(){
    const url = this.getUrlWithParameters(this.state.lat, this.state.long, 1500, 'food', 'AIzaSyCqbos4y9u3Wp5pxWvuC0Aovzy8L0K3x0k')
    fetch(url)
      .then((data) => data.json())
      .then((res) => {
        const arrayMarkers = [];
        res.results.map((element, i) => {
          arrayMarkers.push(
            <Marker 
              key={i}
              coordinate={{
                latitude: element.geometry.location.lat,
                longitude: element.geometry.location.lng
              }}
            >
              <Callout>
                <View>
                  <Text>{element.name}</Text>
                  <Text>Open: {element.opening_hours.open_now ? 'YES' : 'NO'}</Text>
                </View>
              </Callout>
            </Marker>
          )
        })
        this.setState({places: arrayMarkers});
      })
  }

  getUrlWithParameters(lat, long, radius, type, API){
      const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
      const location = `location=${lat},${long}&radius=${radius}`;
      const typeData = `&types=${type}`;
      const key = `&key=${API}`
      return `${url}${location}${typeData}${key}`;
  }
  render() {
    console.log(this.state.latitudeDelta);
    return (
      <View style={styles.container}>
        {this.state.lat ? <MapView 
          style={{flex: 1}}
          provider={MapView.PROVIDER_GOOGLE}
          initialRegion={{
            latitude: this.state.lat,
            longitude: this.state.long,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
        >
        <Marker 
          coordinate={{
            latitude: this.state.lat,
            longitude: this.state.long,
          }}
        >
          <View>
            <Image style={{width: 50, height: 50}} source={require("./img/marker.png")}/>
          </View>
        </Marker>
          {this.state.places}
        </MapView>: null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row'
  },
  zoomButton: {
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
  }
});

AppRegistry.registerComponent('googleMapsTest', () => googleMapsTest);
