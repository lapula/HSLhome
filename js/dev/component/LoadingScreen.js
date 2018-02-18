import React from 'react';

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStop: null,
    };
  }

  render() {
    return (
      <div className="ui-content" onClick={this.props.setNoGpsMode}>
         <p>Hello TAU!</p>
         <p>Hi TAU!</p>
         <p>Hi TAU!</p>
         <p>Hi TAU!</p>
      </div>
    );
  }
}
export default LoadingScreen;
