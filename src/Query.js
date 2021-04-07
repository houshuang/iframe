import * as React from "react";

const remove = (uid) => {
  window.parent.postMessage({ type: "addBlock", string: uid }, "*");
};

const clicked = (e, uid) => {
  e.preventDefault();
  if (e.shiftKey) {
    window.parent.postMessage({ type: "shiftZoom", uid }, "*");
  } else {
    window.parent.postMessage({ type: "zoom", uid }, "*");
  }
};

const Query = () => {
  const [state, setState] = React.useState([]);
  React.useEffect(() => {
    window.parent.postMessage({ type: "ready" }, "*");
    window.addEventListener("message", (e) => {
      console.log(e);
      if (!typeof e.data === "object" || !e.data["roam-data"]) {
        return;
      }
      const data = e.data["roam-data"];
      if (data && data.query) {
        const exclusions =
          data.below &&
          data.below.children &&
          data.below.children.map((x) => x.string);
        const links = data.query.reduce((acc, page) => {
          page[1].forEach((item) => acc.push(item));
          return acc;
        }, []);
        setState(links.filter((x) => x.string && !exclusions.includes(x.uid)));
      }
    });
  }, []);
  console.log(state);
  return state ? (
    <ul>
      {state.map((x) => (
        <li key={x.uid}>
          <span onClick={() => remove(x.uid)}>[X]</span>{" "}
          <span onClick={(e) => clicked(e, x.uid)}>{x.string}</span>
        </li>
      ))}
    </ul>
  ) : (
    <>Waiting for data</>
  );
};

export default Query;
