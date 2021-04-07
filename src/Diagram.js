import * as React from "react";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import "beautiful-react-diagrams/styles.css";

// the diagram model
const initialSchema = createSchema({
  nodes: [
    { id: "node-1", content: "Node 1", coordinates: [250, 60] },
    { id: "node-2", content: "Node 2", coordinates: [100, 200] },
    { id: "node-3", content: "Node 3", coordinates: [250, 220] },
    { id: "node-4", content: "Node 4", coordinates: [400, 200] },
  ],
});

const onChange = (e) => {
  console.log(e);
};

const UncontrolledDiagram = () => {
  // create diagrams schema

  return (
    <div style={{ height: "22.5rem" }}>
      <Diagram schema={initialSchema} onChange={onChange} />
    </div>
  );
};

export default UncontrolledDiagram;

// const remove = (uid) => {
//   window.parent.postMessage({ type: "addBlock", string: uid }, "*");
// };

// const clicked = (e, uid) => {
//   e.preventDefault();
//   if (e.shiftKey) {
//     window.parent.postMessage({ type: "shiftZoom", uid }, "*");
//   } else {
//     window.parent.postMessage({ type: "zoom", uid }, "*");
//   }
// };

// const Query = () => {
//   const [state, setState] = React.useState([]);
//   React.useEffect(() => {
//     window.parent.postMessage({ type: "ready" }, "*");
//     window.addEventListener("message", (e) => {
//       console.log(e);
//       if (!typeof e.data === "object" || !e.data["roam-data"]) {
//         return;
//       }
//       const data = e.data["roam-data"];
//       if (data && data.query) {
//         const exclusions =
//           data.below &&
//           data.below.children &&
//           data.below.children.map((x) => x.string);
//         const links = data.query.reduce((acc, page) => {
//           page[1].forEach((item) => acc.push(item));
//           return acc;
//         }, []);
//         setState(links.filter((x) => x.string && !exclusions.includes(x.uid)));
//       }
//     });
//   }, []);
//   console.log(state);
//   return state ? (
//     <ul>
//       {state.map((x) => (
//         <li key={x.uid}>
//           <span onClick={() => remove(x.uid)}>[X]</span>{" "}
//           <span onClick={(e) => clicked(e, x.uid)}>{x.string}</span>
//         </li>
//       ))}
//     </ul>
//   ) : (
//     <>Waiting for data</>
//   );
// };

// export default Query;
