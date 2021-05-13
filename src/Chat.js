import * as React from "react";
import { ChatInput, ChatFeed, Message } from "react-chat-ui";

const clicked = () => {};

const onMessageSubmit = (user, e) =>
  window.parent.postMessage({ type: "roamIframeAPI.data.block.create", block: {string: `${user['display-name']}: ${e}` }}, "*");

const Query = () => {
  const [state, setState] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [input, setInput] = React.useState("");
  React.useEffect(() => {
    window.parent.postMessage({ type: "roamIframeAPI.ready" }, "*");
    window.addEventListener("message", (e) => {
      console.log(e);
      if (!typeof e.data === "object" || !e.data["roam-data"]) {
        return;
      }
      const data = e.data["roam-data"];
      console.log(data)
      if (data) {
        setState(
          data['blocks-below'] &&
            data['blocks-below'].children &&
            data['blocks-below'].children.map((x) => {
              const [name, msg] = x.string.split(":");
              return new Message({
                id: name,
                message: msg,
                senderName: name,
              });
            })
        );
        setUser(data.user);
      }
    });
  }, []);
  
  return (
    <div
      style={{
        width: "550px",
        border: "2px",
        borderStyle: "solid",
        borderColor: "blue",
      }}
    >
      <ChatFeed
        messages={state || []} // Array: list of message objects
        hasInputField={false} // Boolean: use our input, or use your own
        showSenderName // show the name of the user who sent the message
        bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
        // JSON: Custom bubble styles
      />
      <form
        onSubmit={() => {
          onMessageSubmit(user, input);
          setInput("");
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
      </form>
    </div>
  );
};

export default Query;
