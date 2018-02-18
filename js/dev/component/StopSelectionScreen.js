import React from 'react';

class StopSelectionScreen extends React.Component {
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
  }


  handleClick() {
    this.props.setNoGpsMode();
  }

  

  render() {
    return (
      <div className="ui-content" onClick={this.handleClick()}>
         <p>Hello TAU!</p>
         <p>Hi TAU!</p>
         <p>Hi TAU!</p>
         <p>Hi TAU!</p>
      </div>
    );
  }
}
export default StopSelectionScreen;
