import React from "react";
import "./App.css";
import { OTSession, OTStreams, preloadScript } from "opentok-react";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";

import { updateLayout } from "opentok-react-layout";
import Chat from "./components/Chat";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.otSession = React.createRef();
    this.state = {
      error: null,
      connected: false,
      streams: [],
      chat: false,
      chats: [],
    };
    this.sessionEvents = {
      streamCreated: event => {
        this.setState(
          {
            streams: [...this.state.streams, event.stream],
          },
          () => updateLayout(this.state.streams)
        );
      },
      streamDestroyed: event => {
        this.setState(
          prevState => ({
            streams: prevState.streams.filter(
              stream => stream?.id !== event.stream.id
            ),
          }),
          () => updateLayout(this.state.streams)
        );
      },
      sessionConnected: event => {
        event.preventDefault();
        this.setState({
          connected: true,
        });
      },
      sessionDisconnected: event => {
        event.preventDefault();
        this.setState({ connected: false });
      },
    };
  }

  componentDidMount() {
    this.otSession.current.sessionHelper.session.on(
      "signal:text_message",
      event => {
        this.setState({
          chats: [
            {
              participantType:
                event.from.connectionId ===
                this.otSession.current.sessionHelper?.session.connection
                  .connectionId
                  ? "mine"
                  : "theirs",
              data: event.data,
            },
            ...(this.state?.chats || []),
          ],
        });
      }
    );
  }

  sendSignal = (msg = "", type = "text_message") => {
    this.otSession.current.sessionHelper.session.signal(
      {
        type,
        data: msg,
      },
      function (error) {
        if (error) {
          console.log("signal error: " + error.message);
        } else {
          console.log("chat sent");
        }
      }
    );
  };

  onError = err => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  };

  onDestroySession = event => {
    if (this.state.connected) {
      if (this.otSession.current.sessionHelper?.session) {
        this.otSession.current.sessionHelper.session.disconnect();
        window.close();
      }
    }
  };

  render() {
    return (
      <>
        {this.state.chat && (
          <aside
            className="call-notes aside-bar"
            style={{
              width: "20%",
            }}
          >
            <div>
              <Chat chats={this.state.chats} onChange={this.sendSignal} />
            </div>
          </aside>
        )}
        <div
          className={"call-container"}
          style={{
            width: this.state.chat ? "80%" : "100%",
          }}
        >
          <OTSession
            apiKey={this.props.apiKey}
            sessionId={this.props.sessionId}
            token={this.props.token}
            eventHandlers={this.sessionEvents}
            onError={this.onError}
            ref={this.otSession}
          >
            {this.state.error ? <div id="error">{this.state.error}</div> : null}
            <Publisher
              chatControl={this.state.chat}
              changeControl={() =>
                this.setState(prevState => ({ chat: !prevState.chat }))
              }
              onDestroy={this.onDestroySession}
            />

            <OTStreams>
              <Subscriber />
            </OTStreams>
          </OTSession>
        </div>
      </>
    );
  }
}

export default preloadScript(App);
