'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Button,
  AlertIOS
} from 'react-native';
import Camera from 'react-native-camera';
import * as Progress from 'react-native-progress';
import Orientation from 'react-native-orientation';

import config from './config/config.json';

class bitcampScannerApp extends Component {

  constructor(props){
    super(props);
    this.alertPopup = this.alertPopup.bind(this);
    this.readQrCode = this.readQrCode.bind(this);
    this.welcome = null;
    this.state = {
      requesting:false,
      dataFound:false,
      reading: false,
   };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  render() {
    let overlay = null;
    let progressCircle = null;
    if (this.state.requesting === true){
      overlay = <View style={styles.overlay}/>;
      progressCircle = <View style={styles.progressOverlay}>
                        <Progress.CircleSnail
                        size={50}
                        color={['rgba(255, 63, 70, 1)', 'rgba(255, 111, 63, 1)', 'rgba(255, 175, 63, 1)']} />
                      </View>;
    }
    console.log(this.state.reading);
    let cameraState;
    let status;
    if(this.state.reading){
        cameraState = 
        (<Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={this.readQrCode}>
        </Camera>);
        status = "SEARCHING"
      }
      else{
        cameraState = 
        (<Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
        </Camera>);
        status = "STANDBY"
      }
   return (
      <View style={styles.container}>
        {cameraState}
        <TouchableHighlight style={styles.button} onPress={() => this.setState({
          reading:!this.state.reading
        })} underlayColor="black">
          <Text style={{fontWeight: 'bold', color: '#527fe4', fontSize: 35}}>{status}</Text>
        </TouchableHighlight>
        {this.state.requesting && !this.state.dataFound && overlay}
        {this.state.requesting && !this.state.dataFound && progressCircle}
        {this.state.dataFound && this.welcome}
      </View>
    );
  }

  alertPopup(){
      Alert.alert('Barcode Found!',
      "Type: " + data.type + "\nData: " + data.data,
      [{text:'OK', onPress: () => this.setState({requesting:false})}]);
  }

  readQrCode(data){
    console.log(this.state.reading);
    if (!this.state.requesting){
      this.setState({requesting:true});
      var thisBinded = this;

      fetch('https://32zll6wft7.execute-api.us-east-1.amazonaws.com/final/?status=success&email=' + data.data, {
        method: 'GET',
        headers:{
          'x-api-key': config.apiKey
        }
      })
        .then(function(response){

          // Alert.alert('Barcode Found!',
          // // "Status: " + response._bodyInit.status + "\nEmail: " + response._bodyInit.email + "\nName: " + response._bodyInit.name,
          // JSON.stringify(response),
          // [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);

          console.log(response);
          if (response.status === 200){
            let temporary = JSON.parse(response._bodyInit);
            let actualData = JSON.parse(temporary['body-json']);
            let name = response.name;
            if (actualData.status === "success"){
              thisBinded.welcome = <View style={styles.progressOverlay}>
                                <View>
                                  <View style={styles.welcomeBox}>
                                    <Text style={styles.welcomeText}>Welcome</Text>
                                    <Text style={styles.welcomeText}>{actualData.name}</Text>
                                  </View>
                                  <Button
                                      onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
                                      title="OK"
                                      color="blue"
                                  />
                                </View>
                              </View>;
            }else{
              thisBinded.welcome = <View style={styles.progressOverlay}>
                                <View>
                                  <View style={styles.errorBox}>
                                    <Text style={styles.welcomeText}>ERROR</Text>
                                    <Text style={styles.welcomeText}>User not found</Text>
                                  </View>
                                  <Button
                                      onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
                                      title="OK"
                                  />
                                </View>
                              </View>;
            }
          }else{
            thisBinded.welcome = <View style={styles.progressOverlay}>
                              <View>
                                <View style={styles.errorBox}>
                                  <Text style={styles.welcomeText}>ERROR</Text>
                                  <Text style={styles.welcomeText}>API Key incorrect</Text>
                                </View>
                                <Button
                                    onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
                                    title="OK"
                                />
                              </View>
                            </View>;

          }
          thisBinded.setState({dataFound:true});
        }).catch((error) => {
          thisBinded.welcome = <View style={styles.progressOverlay}>
                            <View>
                              <View style={styles.errorBox}>
                                <Text style={styles.welcomeText}>ERROR</Text>
                                <Text style={styles.welcomeText}>{error}</Text>
                              </View>
                              <Button
                                  onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
                                  title="OK"
                              />
                            </View>
                          </View>;
          thisBinded.setState({dataFound:true})
        });
    }
    this.setState({
     reading:!this.state.reading
    })
  }

  //takePicture() {
  //  // fetch('https://sheets.googleapis.com/v4/spreadsheets/1Gs_4u3apbF_z0ekOaiN98jh4nntB9wYMmGYiJpuJNAM/values/Sheet1!A1:B2')
  //  //   .then((response) => AlertIOS.alert("Response", response));
  //  // this.camera.capture()
  //  //   .then((data) => console.log(data))
  //  //   .catch(err => console.error(err));
  //  if (!this.state.requesting){
  //    this.setState({requesting:true});
  //    var thisBinded = this;

  //    fetch('https://zkrpy6ly94.execute-api.us-east-1.amazonaws.com/prod/?key=' + config.apiKey + '&status=success&email=' + config.email)
  //    .then(function(response){
  //      console.log(response);
  //      console.log((typeof response));
  //      console.log(response._bodyInit);
  //      let temporary = JSON.parse(response._bodyInit);
  //      console.log(temporary);
  //      console.log(temporary['body-json']);
  //      let actualData = JSON.parse(temporary['body-json']);
  //      console.log(actualData);
  //      console.log(actualData.status + actualData.email+actualData.name)
  //    Alert.alert('Barcode Found!',
  //    // "Status: " + response._bodyInit.status + "\nEmail: " + response._bodyInit.email + "\nName: " + response._bodyInit.name,
  //    // JSON.stringify(response),
  //    [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);

  //    }).catch((error)=>{
  //    Alert.alert('ERROR',
  //    error,
  //    [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);

  //    });

  //    // setTimeout(function(){
  //    //   let name = "George Tong";
  //    //
  //    //   thisBinded.welcome = <View style={styles.progressOverlay}>
  //    //                     <View>
  //    //                       <View style={styles.welcomeBox}>
  //    //                         <Text style={styles.welcomeText}>Welcome</Text>
  //    //                         <Text style={styles.welcomeText}>{name}</Text>
  //    //                       </View>
  //    //                       <Button
  //    //                           onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
  //    //                           title="OK"
  //    //                           color="blue"
  //    //                       />
  //    //                     </View>
  //    //                   </View>;
  //    //   thisBinded.welcome = <View style={styles.progressOverlay}>
  //    //                     <View>
  //    //                       <View style={styles.errorBox}>
  //    //                         <Text style={styles.welcomeText}>ERROR</Text>
  //    //                         <Text style={styles.welcomeText}>User not found</Text>
  //    //                       </View>
  //    //                       <Button
  //    //                           onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
  //    //                           title="OK"
  //    //                       />
  //    //                     </View>
  //    //                   </View>;
  //    //   thisBinded.setState({dataFound:true});
  //    //   // Alert.alert('Barcode Found!',
  //    //   // "Type: \nData: ",
  //    //   // [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);
  //    // }, 1000);
  //    //sheets api call

  //  }
  //}
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcomeText:{
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  errorBox:{
    alignItems:'center',
    width: 200,
    padding:5,
    borderBottomWidth: 1,
    borderColor: 'black',
    backgroundColor: 'orangered'
  },
  welcomeBox:{
    alignItems:'center',
    width: 200,
    padding:5,
    borderBottomWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightgreen'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  progressOverlay:{
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    top: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: .5,
    backgroundColor: 'white',
    height: Dimensions.get('window').height - 150,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  button:{

    opacity: .5,
    alignItems: 'center',
    padding: 10,
    margin: 40,
  }
});

AppRegistry.registerComponent('bitcampScannerApp', () => bitcampScannerApp);
