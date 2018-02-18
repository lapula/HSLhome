import React from 'react';
import SnapList from './SnapList.js';
import Header from './Header.js';
import LoadingScreen from './LoadingScreen.js';
import * as HSLQuery from '../HSLQuery.js';
import '../../../lib/tau/wearable/js/tau.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        lat: null,
        lon: null
      },
      selectedStop: null,
      noGpsMode: false,
    };
    this.setNoGpsMode = this.setNoGpsMode.bind(this);
  }

  componentDidMount() {
    if (!tizen.preference.exists('stops')) {
  		tizen.preference.setValue('stops', "0412,0401,2047,3028,3036,2041,2024,2045,2043,2046");
  	}
    HSLQuery.queryStopToNameData(tizen.preference.getValue('stops').split(',')).then((value) => {
      console.log(value)
    });
  }

  setNoGpsMode() {
    this.setState({noGpsMode: true});
  }


  render() {
    return (
      <div className="ui-page ui-page-active" id="main" ref="main">
        <Header headerText={"gps: " + this.state.noGpsMode}/>
        <LoadingScreen setNoGpsMode={this.setNoGpsMode}/>
      </div>
    );
  }
}
export default App;

/*
<Header headerText="Hello"/>
<SnapList pageRef={this.refs.main}/>
*/
