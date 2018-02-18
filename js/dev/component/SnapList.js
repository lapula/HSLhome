import React from 'react';
import '../../../lib/tau/wearable/js/tau.js';

class SnapList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      next: null,
      operation: null,
    };
  }

  componentDidMount() {



    const page = document.getElementById('main');
    console.log(this.props.pageRef)
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

    );
  }
}
export default SnapList;
