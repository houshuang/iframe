import * as React from "react";
import { ChatInput, ChatFeed, Message } from "react-chat-ui";

const remove = (uid) => {
  window.parent.postMessage({ type: "addBlock", string: uid }, "*");
};

const clicked = () => {};

const onMessageSubmit = (name, e) =>
  window.parent.postMessage({ type: "addBlock", string: `${name}: ${e}` }, "*");

const Query = () => {
  const [state, setState] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [input, setInput] = React.useState("");
  React.useEffect(() => {
    window.parent.postMessage({ type: "ready" }, "*");
    window.addEventListener("message", (e) => {
      console.log(e);
      if (!typeof e.data === "object" || !e.data["roam-data"]) {
        return;
      }
      const data = e.data["roam-data"];
      if (data && data.query) {
        setState(
          data.below &&
            data.below.children &&
            data.below.children.map((x) => {
              const [name, msg] = x.string.split(":");
              console.log(name.trim(), data.name);
              return new Message({
                id: name.trim() === data.name + "" ? 0 : 1,
                message: msg,
                senderName: name.trim() === data.name + "" ? undefined : name,
              });
            })
        );
        setUser(data.name);
      }
    });
  }, []);
  const messages = [
    new Message({
      id: 1,
      message: "I'm the recipient! (The person you're talking to)",
    }),
    new Message({
      id: 0,
      message: "I'm you",
    }),
  ];
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
