import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Item,
  TextInput,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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
            beacons: [],
            params: [
                {name: "frequency", value: 10},
                {name: "minor", value: 300},
                {name: "major", value: 301},
                {name: "id", value: '248'},
                {name: "power", value: 'HIGH'}
            ],
            uuid: 'eb8c7d67-58b0-4ff7-a5e2-32f2f5bcb36d'
        }
        this._storeData = async (label, value) => {
            try {
                await AsyncStorage.setItem(label, value);
            } catch (error) {
                console.log(error);
            }
        };
        this._getData = async label => {
            try {
                return await AsyncStorage.getItem(label);
            } catch (error) {
                console.log(error);
            }
        };
        let me = this;
        var arr = [];
        this.state.params.forEach((p, i) => {
            me._getData(p.name).then(res => {
                // if(res !== null){
                    arr.push({name: p.name, value: (res == null ? me.state.params.filter(par => par.name == p.name)[0].value : res)})
                // }
                if(i == me.state.params.length - 1) {
                    me.setState({params: arr});
                    console.log(this.state.params)
                }
            })
        })
        BeaconBroadcast.checkTransmissionSupported()
            .then(() => {
                console.log('inside')
                me.setState({state: true})
                BeaconBroadcast.stopAdvertisingBeacon()
                let id = this.state.params.filter(p => p.name == 'id')[0].value;
                let minor = this.state.params.filter(p => p.name == 'minor')[0].value;
                let major = this.state.params.filter(p => p.name == 'major')[0].value;
                let frequency = this.state.params.filter(p => p.name == 'frequency')[0].value;
                let power = this.state.params.filter(p => p.name == 'power')[0].value;
                BeaconBroadcast.startAdvertisingBeaconWithString(
                    this.state.uuid, 
                    id,
                    parseInt(minor), 
                    parseInt(major), 
                    parseInt(frequency), 
                    power
                )
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
                        console.log(data.beacons)
                    }
                }
                // this.beaconsRSSI = bc;
            );
        }, 3000)
    }

    restartIbeacon(){
        let me = this;
        BeaconBroadcast.stopAdvertisingBeacon();
        BeaconBroadcast.checkTransmissionSupported()
            .then(() => {
                console.log('inside')
                me.setState({state: true})
                BeaconBroadcast.stopAdvertisingBeacon()
                let id = this.state.params.filter(p => p.name == 'id')[0].value;
                let minor = this.state.params.filter(p => p.name == 'minor')[0].value;
                let major = this.state.params.filter(p => p.name == 'major')[0].value;
                let frequency = this.state.params.filter(p => p.name == 'frequency')[0].value;
                let power = this.state.params.filter(p => p.name == 'power')[0].value;
                BeaconBroadcast.startAdvertisingBeaconWithString(
                    this.state.uuid, 
                    id,
                    parseInt(minor), 
                    parseInt(major), 
                    parseInt(frequency), 
                    power
                )
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
        
        this.state.params.forEach(el => {
            this._storeData(el.name, el.value.toString());
        })
    }
    render(){
        let working = this.state.state;
        let beacons = this.state.beacons;
        let minor = this.state.params.filter(p => p.name == 'minor')[0].value;
        let major = this.state.params.filter(p => p.name == 'major')[0].value;
        let frequency = this.state.params.filter(p => p.name == 'frequency')[0].value;
        let power = this.state.params.filter(p => p.name == 'power')[0].value;
        console.log('render', minor, major, frequency, power)
        return (    
            <View style={styles.page}>
                <Text style={[styles.text, {color: working ? 'green' : 'red'}]} >{working ? 'i\'m working :)' : 'not working :(\ncheck bluetooth connection, if enabled i cannot simulate ibeacon behaviour'}</Text>
                <View style={styles.inputCont}>
                    <View style={styles.inputLabel}><Text>minor</Text></View>
                    <TextInput style={styles.input} 
                        value={minor.toString()}
                        onChangeText={t => {
                            let arr = this.state.params.filter(p => p.name != 'minor');
                            arr.push({name: 'minor', value: t})
                            this.setState({params: arr});
                        }}>
                    </TextInput>
                    <TouchableOpacity style={styles.button}
                        onPress={()=>{
                            this.restartIbeacon();
                        }}>
                        <Text style={styles.buttonText}>set</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputCont}>
                    <View style={styles.inputLabel}><Text>major</Text></View>
                    <TextInput style={styles.input} 
                        value={major.toString()}
                        onChangeText={t => {
                            let arr = this.state.params.filter(p => p.name != 'major');
                            arr.push({name: 'major', value: t})
                            this.setState({params: arr});
                        }}>
                    </TextInput>
                    <TouchableOpacity style={styles.button}
                        onPress={()=>{
                            this.restartIbeacon();
                        }}>
                        <Text style={styles.buttonText}>set</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputCont}>
                    <View style={styles.inputLabel}><Text>frequency</Text></View>
                    <TextInput style={styles.input} 
                        value={frequency.toString()}
                        onChangeText={t => {
                            let arr = this.state.params.filter(p => p.name != 'frequency');
                            arr.push({name: 'frequency', value: t})
                            this.setState({params: arr});
                        }}>
                    </TextInput>
                    <TouchableOpacity style={styles.button}
                        onPress={()=>{
                            this.restartIbeacon();
                        }}>
                        <Text style={styles.buttonText}>set</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputCont}>
                    <View style={styles.inputLabel}><Text>power</Text></View>
                    <TextInput style={styles.input} 
                        value={power.toString()}
                        onChangeText={t => {
                            let arr = this.state.params.filter(p => p.name != 'power');
                            arr.push({name: 'power', value: t})
                            this.setState({params: arr});
                        }}>
                    </TextInput>
                    <TouchableOpacity style={styles.button}
                        onPress={()=>{
                            this.restartIbeacon();
                        }}>
                        <Text style={styles.buttonText}>set</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.beaconListText}>
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
        flex: 4,
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
    },
    buttonText: {
        textAlign: 'center'
    },
    inputCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        lineHeight: 30,
        marginLeft: 5,
        marginRight: 5,
    },
    input: {
        flex: 3,
        borderWidth: 2,
        width: 70,
        height: 40,
        marginLeft: 5
    },
    inputLabel: {
        flex: 1
    },
    button: {
        height: 30,
        width: 60,
        borderWidth: 2,
        borderRadius: 7,
        backgroundColor: '#ccc'
    }
}); 

