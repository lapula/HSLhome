import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <header className="ui-header">
         <h2 className="ui-title" id="header_text">{this.props.headerText}</h2>
      </header>
    );
  }
}
export default Header;
