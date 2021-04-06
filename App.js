import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
const screen_height = Dimensions.get('window').height;
const screen_width = Dimensions.get('screen').width;
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
      stateDetail: [],
      individualStateDetail: [],
      updatedDate: '',
      error: ''
    };
  }
  // Getting API DATA
  
  async UNSAFE_componentWillMount() {
    try {

      const stateWiseData = await fetch(
        'https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise',
      );
      const dataJson = await stateWiseData.json();
      this.setState({ data: dataJson.data.total, stateDetail: dataJson.data.statewise, updatedDate: dataJson.data.lastRefreshed });
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 100)
    } catch (err) {
      this.setState({
        error: err
      })
      setTimeout(() => {
        this.setState({ isLoading: true });
      }, 5000)
      Alert.alert('Oops!', err, [
        { text: 'Okay' }
      ]);

    }
  }

  // Fetch Index in API

  onChangeItem = (item, index) => {
    var individualStateDetail = this.state.stateDetail[index]
    this.setState({ isLoading: true });
    this.setState({
      data: individualStateDetail
    });
    setTimeout(() => {
      this.setState({ isLoading: false });

    }, 1000)
  }
  
  // UI Text

  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={{ flex: 1 }}>

        <View style={styles.firstHalf}>
          <Text style={{ paddingTop: 25, fontSize: 25, fontWeight: 'bold', textAlign: 'center',fontStyle:'italic' }}>
            COVID 19 METRICS
                    </Text>
          <Text style={{ paddingVertical: 50, fontSize: 20, fontWeight: 'bold', textAlign: 'center',fontStyle:'italic' }}> India </Text>
          <View style={{
            flexDirection: 'row', alignItems: 'center'
          }}>
            <Text style={{ fontStyle: 'italic', fontSize: 20, paddingHorizontal: 20 }}> State </Text>
            <DropDownPicker
              items={this.state.stateDetail.map((item, index) => ({ label: item.state, value: index }))}
              placeholder={'All'}
              style={{
                alignItems: "center", justifyContent: "center"
              }}
              containerStyle={{ height: 40, width: screen_width - 125 }}
              style={{
                backgroundColor: '#fafafa',
                borderRadius: 6, fontSize: 30
                
              }}
              itemStyle={{fontStyle:'italics'}}
              onChangeItem={(item, index) => this.onChangeItem(item, index)}
              dropDownStyle={{
                backgroundColor: 'white',


              }}
            />
          </View>

        </View>

       

        <View style={styles.secondHalf}>
          {isLoading == true ? (
            <View style={{ justifyContent: "space-evenly", alignItems: 'center', marginTop: 100 }}>
              <ActivityIndicator size={100} color={'grey'} />
              <Text style={{ textAlign: 'center', color: 'black', fontStyle: 'italic', }}> Getting Data....</Text>

            </View>
          ) : (

            <View
              style={{
                margin: 50,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 5,
                backgroundColor: '#fff',
                borderRadius: 10
              }}>
              <Text style={{ textAlign: 'center', fontStyle: 'italic', color: 'grey', padding: 20 }}>As on {this.state.updatedDate}</Text>
              <Text style={{ color: 'black', fontStyle: 'italic', padding: 20, textAlign: 'center' }}>
                Active: {data.active}
              </Text>
              <Text style={{ color: 'black', fontStyle: 'italic', padding: 20, textAlign: 'center' }}>
                Confirmed: {data.confirmed}
              </Text>
              <Text style={{ color: 'black', fontStyle: 'italic', padding: 20, textAlign: 'center' }}>
                Recovered: {data.recovered}
              </Text>
              <Text style={{ color: 'black', fontStyle: 'italic', padding: 20, textAlign: 'center' }}>
                Death: {data.deaths}
              </Text>
            </View>

          )}
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstHalf: {
    height: screen_height / 2,
    backgroundColor: 'grey',

  },
  secondHalf: {
    height: screen_height / 2,
    backgroundColor: '#f6f6f6',
  },
});
