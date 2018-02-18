import React from 'react';
import SnapList from './SnapList.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      next: null,
      operation: null,
    };
  }


  render() {
    return (
      <div className="component-app">
        <div>Yello</div>
        <SnapList/>
      </div>
    );
  }
}
export default App;
