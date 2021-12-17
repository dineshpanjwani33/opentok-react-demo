import React from "react";
import WidgesIcons from "./WidgesIcons";

class Widgets extends React.Component {
  render() {
    return (
      <button
        onClick={this.props.onChange}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          width: 30,
          height: 30,
          paddingRight: this.props.type !== "end_call" ? 60 : 10,
          paddingTop: this.props.type === "end_call" && 5,
        }}
      >
        <WidgesIcons
          type={`${this.props.type}_${this.props.checked ? "on" : "off"}`}
        />
      </button>
    );
  }
}
export default Widgets;
