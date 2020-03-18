import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from 'react-native';
import BeaconBroadcast from 'react-native-ibeacon-simulator';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            state: false
        }
        let me = this;
        BeaconBroadcast.checkTransmissionSupported()
            .then(() => {
                console.log('inside')
                me.setState({state: true})
              BeaconBroadcast.stopAdvertisingBeacon()
              BeaconBroadcast.startAdvertisingBeaconWithString('2bc54024-6487-11ea-bc55-0242ac130003', '128', 200, 201)
            })
            .catch((e) => {
                console.log('error', e)
              /* handle return errors */
              // - NOT_SUPPORTED_MIN_SDK
              // - NOT_SUPPORTED_BLE
              // - DEPRECATED_NOT_SUPPORTED_MULTIPLE_ADVERTISEMENTS
              // - NOT_SUPPORTED_CANNOT_GET_ADVERTISER
              // - NOT_SUPPORTED_CANNOT_GET_ADVERTISER_MULTIPLE_ADVERTISEMENTS
            })
    }
    render(){
        let working = this.state.state;
        return (    
            <View style={styles.page}>
                <Text style={[styles.text, {color: working ? 'green' : 'red'}]} >{working ? 'i\'m working :)' : 'not working :(\ncheck bluetooth connection, if enabled i cannot simulate ibeacon behaviour'}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        textAlign: 'center'
    },
    text: {
        fontSize: 30
    }
}); 

