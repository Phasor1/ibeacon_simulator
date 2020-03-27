import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Item
} from 'react-native';
import BeaconBroadcast from 'react-native-ibeacon-simulator';
import { DeviceEventEmitter } from 'react-native'
import Beacons from 'react-native-beacons-manager'
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
            state: false,
            beacons: []
        }
        let me = this;
        BeaconBroadcast.checkTransmissionSupported()
            .then(() => {
                console.log('inside')
                me.setState({state: true})
              BeaconBroadcast.stopAdvertisingBeacon()
              BeaconBroadcast.startAdvertisingBeaconWithString('eb8c7d67-58b0-4ff7-a5e2-32f2f5bcb36c', '228', 300, 301)
              // BeaconBroadcast.startAdvertisingBeaconWithString('2bc54024-6487-11ea-bc55-0242ac130003', '128', 200, 201)
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

        Beacons.detectCustomBeaconLayout('m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24')
        Beacons.detectIBeacons();
        // Range beacons inside the region
        Beacons
            .startRangingBeaconsInRegion("REGION1") // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
            .then(() => console.log('Beacons ranging started succesfully'))
            .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

        Beacons.setRssiFilter(Beacons.ARMA_RSSI_FILTER, 1.0);
        setTimeout(() =>{
            me.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
                'beaconsDidRange',
                (data) => {
                    if(data.beacons.length){
                        data.beacons.forEach(b => {
                            // console.log(b.uuid b.distance)
                            if(!me.state.beacons.filter(bc => bc.uuid == b.uuid).length){
                                let beacons = this.state.beacons;
                                b.key = b.uuid;
                                beacons.push(b);
                                this.setState({beacons: beacons});
                            }
                        })
                        console.log(this.state.beacons)
                    }
                }
                // this.beaconsRSSI = bc;
            );
        }, 3000)
    }
    render(){
        let working = this.state.state;
        let beacons = this.state.beacons;
        console.log('render', this.state.beacons)
        return (    
            <View style={styles.page}>
                <Text style={[styles.text, {color: working ? 'green' : 'red'}]} >{working ? 'i\'m working :)' : 'not working :(\ncheck bluetooth connection, if enabled i cannot simulate ibeacon behaviour'}</Text>
                <View>
                    <Text>List of beacon around</Text>
                </View>
                <View style={styles.list}>
                    <FlatList
                        style={{flex: 1, marginLeft: 10, marginRight: 10}}
                        data={this.state.beacons}
                        renderItem={({ item }) => (
                            <View style={styles.beacon} key={item.key}>
                                <View style={styles.beaconParam}><Text style={styles.beaconParamText}>{item.minor}</Text></View>
                                <View style={styles.beaconParam}><Text style={styles.beaconParamText}>{item.distance.toFixed(2)}</Text></View>
                                <View style={styles.beaconParam}><Text style={styles.beaconParamText}>{item.rssi.toFixed(2)}</Text></View>
                            </View>
                        )}
                    />
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    text: {
        fontSize: 30
    },
    list: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        height: 100
    },
    beacon: {
        flex:1,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    beaconParam: {
        flex:1
    },
    beaconParamText: {
        textAlign: 'center'
    }
}); 

