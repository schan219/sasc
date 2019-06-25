import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import "./styles.css";

class Queue extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="Queue">
                <h2>Please wait to be connected...</h2>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

Queue.propTypes = {
    history: PropTypes.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Queue);
