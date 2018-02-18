import React from 'react';
import '../../../lib/tau/wearable/js/tau.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      next: null,
      operation: null,
    };
  }

  componentDidMount() {


    if (!tizen.preference.exists('stops')) {
  		tizen.preference.setValue('stops', "0412,0401,2047,3028,3036,2041,2024,2045,2043,2046");
  	}
    const page = this.refs.main;
    const list = this.refs.snapList;
    let listHelper;
  	page.addEventListener('pageshow', function() {
  	    listHelper = tau.helper.SnapListMarqueeStyle.create(list, {marqueeDelay: 1000});
  	});
  	page.addEventListener('pagehide', function() {
  	    listHelper.destroy();
  	});
  }

  render() {
    return (
      <div className="ui-page ui-page-active" ref="main">
       <header className="ui-header">
          <h2 className="ui-title" id="refresh_time"></h2>
       </header>
       <div className="ui-content">
          <ul className="ui-listview ui-snap-listview expand-list" ref="snapList">
             <li className="li-has-3line">
             	<div className="ui-marquee ui-marquee-gradient">Loading...</div>
                <div className="li-text-sub ui-li-sub-text">Loading...</div>
                <div className="li-text-sub ui-li-sub-text">Loading...</div>
             </li>
             <li className="li-has-3line">
             	<div className="ui-marquee ui-marquee-gradient">Loading...</div>
                <div className="li-text-sub ui-li-sub-text">Loading...</div>
                <div className="li-text-sub ui-li-sub-text">Loading...</div>
             </li>
             <li className="li-has-3line">
             	<div className="ui-marquee ui-marquee-gradient">Loading...</div>
                <div className="li-text-sub ui-li-sub-text">Loading...</div>
                <div className="li-text-sub ui-li-sub-text">Loading...</div>
             </li>
             <li id="options">
                <div className="ui-marquee ui-marquee-gradient" ><a href="#settings">Settings</a></div>
             </li>
          </ul>
       </div>
    </div>
    );
  }
}
export default App;
