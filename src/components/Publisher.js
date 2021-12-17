import React from "react";
import { OTPublisher } from "opentok-react";
import Widgets from "./Widgets";

class Publisher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true,
      chat: false,
      chats: [],
      videoSource: "camera",
    };
  }

  setAudio = () => {
    this.setState(prevState => ({
      audio: !prevState.audio,
    }));
  };

  setVideo = () => {
    this.setState(prevState => ({
      video: !prevState.video,
    }));
  };

  changeVideoSource = videoSource => {
    this.state.videoSource !== "camera"
      ? this.setState({ videoSource: "camera" })
      : this.setState({ videoSource: "screen" });
  };

  onError = err => {
    this.setState({ error: `Failed to publish: ${err.message}` });
  };

  render() {
    return (
      <>
        <div className="publisher">
          {this.state.error ? <div id="error">{this.state.error}</div> : null}
          <OTPublisher
            properties={{
              name: "Client 1",
              publishAudio: this.state.audio,
              publishVideo: this.state.video,
              fitMode: "cover",
              videoSource:
                this.state.videoSource === "screen" ? "screen" : undefined,
            }}
            onError={this.onError}
          />
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            position: "absolute",
            bottom: 20,
            justifyContent: "center",
            zIndex: 2,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {/* <Widgets
            type="share"
            checked={this.state.videoSource === "screen" && true}
            onChange={this.changeVideoSource}
          /> */}

          <Widgets
            type="audio"
            checked={this.state.audio}
            onChange={this.setAudio}
          />

          <Widgets
            type="video"
            checked={this.state.video}
            onChange={this.setVideo}
          />
          <Widgets
            type="add"
            onChange={() => window.open("http://localhost:3001/", "_blank")}
          />

          {/* <span onClick={() => this.props.onDestroy()}>End Call</span> */}

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: -10,
            }}
          >
            <Widgets type="end_call" onChange={() => this.props.onDestroy()} />
          </div>
          {/* <Widgets type="chat" onChange={this.props.changeControl} /> */}
        </div>
      </>
    );
  }
}
export default Publisher;
