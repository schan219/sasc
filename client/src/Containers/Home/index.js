import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/authActions';
import PropTypes from 'prop-types';
import './styles.css';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <h2>Home</h2>
        {this.props.name}
      </div>
    );
  }
}

Home.propTypes = {
    name: PropTypes.string
};

function mapStateToProps(state) {
    return { message: state.auth.name };
}

export default connect(mapStateToProps, actions)(Home);