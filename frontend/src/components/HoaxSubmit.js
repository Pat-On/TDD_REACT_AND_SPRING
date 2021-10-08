import React, { Component } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { connect } from "react-redux";
import * as apiCalls from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";

class HoaxSubmit extends Component {
  state = {
    focus: false,
    content: undefined,
    pendingApiCall: false,
  };

  onChangeContent = (event) => {
    const value = event.target.value;
    this.setState({
      content: value,
    });
  };

  onClickHoaxify = () => {
    const body = {
      content: this.state.content,
    };
    this.setState({ pendingApiCall: true });
    apiCalls
      .postHoax(body)
      .then((response) => {
        this.setState({ focus: false, content: "", pendingApiCall: false });
      })
      .catch((error) => {
        this.setState({ pendingApiCall: false });
      });
  };

  onFocus = () => {
    this.setState({ focus: true });
  };

  onClickCancel = () => {
    this.setState({ focus: false, content: "" });
  };
  render() {
    return (
      <div className="card d-flex flex-row p-1 ">
        <ProfileImageWithDefault
          className="rounded-circle m-1"
          width="32"
          height="32"
          image={this.props.loggedInUser.image}
        />
        <div className="flex-fill">
          <textarea
            className="form-control w-100"
            rows={this.state.focus ? 3 : 1}
            onFocus={this.onFocus}
            value={this.state.content}
            onChange={this.onChangeContent}
          />
          {this.state.focus && (
            <div className="text-right mt-1">
              <ButtonWithProgress
                className="btn btn-success"
                disabled={this.state.pendingApiCall}
                onClick={this.onClickHoaxify}
                pendingApiCall={this.state.pendingApiCall}
                text="Hoaxify"
              />

              <button
                className="btn btn-light ml-1"
                disabled={this.state.pendingApiCall}
                onClick={this.onClickCancel}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

export default connect(mapStateToProps)(HoaxSubmit);
