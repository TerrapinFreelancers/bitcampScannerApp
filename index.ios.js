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


class bitcampScannerApp extends Component {

  constructor(props){
    super(props);
    this.alertPopup = this.alertPopup.bind(this);
    this.readQrCode = this.readQrCode.bind(this);
    this.welcome = null;
    this.state = {
      requesting:false,
      dataFound:false
    };
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

    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          onBarCodeRead={this.readQrCode}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
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

    if (!this.state.requesting){
      this.setState({requesting:true});
      var thisBinded = this;

      fetch('https://zkrpy6ly94.execute-api.us-east-1.amazonaws.com/prod/?status=success&email=' + data.data, {
        method: 'GET',
        headers:{
          'x-api-key': ''
        }
      })
        .then(function(response){

          // Alert.alert('Barcode Found!',
          // // "Status: " + response._bodyInit.status + "\nEmail: " + response._bodyInit.email + "\nName: " + response._bodyInit.name,
          // JSON.stringify(response),
          // [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);

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
  }

  takePicture() {
    // fetch('https://sheets.googleapis.com/v4/spreadsheets/1Gs_4u3apbF_z0ekOaiN98jh4nntB9wYMmGYiJpuJNAM/values/Sheet1!A1:B2')
    //   .then((response) => AlertIOS.alert("Response", response));
    // this.camera.capture()
    //   .then((data) => console.log(data))
    //   .catch(err => console.error(err));
    if (!this.state.requesting){
      this.setState({requesting:true});
      var thisBinded = this;

      fetch('https://zkrpy6ly94.execute-api.us-east-1.amazonaws.com/prod/?key=gU8WEIv4bu3QmJYg20gja8NkoeP2SGaQaveH0qdv&status=success&email=warunayapa619@gmail.com')
      .then(function(response){
        console.log(response);
        console.log((typeof response));
        console.log(response._bodyInit);
        let temporary = JSON.parse(response._bodyInit);
        console.log(temporary);
        console.log(temporary['body-json']);
        let actualData = JSON.parse(temporary['body-json']);
        console.log(actualData);
        console.log(actualData.status + actualData.email+actualData.name)
      Alert.alert('Barcode Found!',
      // "Status: " + response._bodyInit.status + "\nEmail: " + response._bodyInit.email + "\nName: " + response._bodyInit.name,
      // JSON.stringify(response),
      [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);

      }).catch((error)=>{
      Alert.alert('ERROR',
      error,
      [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);

      });

      // setTimeout(function(){
      //   let name = "George Tong";
      //
      //   thisBinded.welcome = <View style={styles.progressOverlay}>
      //                     <View>
      //                       <View style={styles.welcomeBox}>
      //                         <Text style={styles.welcomeText}>Welcome</Text>
      //                         <Text style={styles.welcomeText}>{name}</Text>
      //                       </View>
      //                       <Button
      //                           onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
      //                           title="OK"
      //                           color="blue"
      //                       />
      //                     </View>
      //                   </View>;
      //   thisBinded.welcome = <View style={styles.progressOverlay}>
      //                     <View>
      //                       <View style={styles.errorBox}>
      //                         <Text style={styles.welcomeText}>ERROR</Text>
      //                         <Text style={styles.welcomeText}>User not found</Text>
      //                       </View>
      //                       <Button
      //                           onPress={()=>thisBinded.setState({requesting:false, dataFound:false})}
      //                           title="OK"
      //                       />
      //                     </View>
      //                   </View>;
      //   thisBinded.setState({dataFound:true});
      //   // Alert.alert('Barcode Found!',
      //   // "Type: \nData: ",
      //   // [{text:'OK', onPress: () => thisBinded.setState({requesting:false})}]);
      // }, 1000);
      //sheets api call

    }
  }
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
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

AppRegistry.registerComponent('bitcampScannerApp', () => bitcampScannerApp);
