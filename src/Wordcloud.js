import * as React from "react";
import WordCloud from "react-d3-cloud";
import { orderBy } from "lodash";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

const stopwords = [
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
];

const getStrings = (data, inclHeader) => {
  return (
    (inclHeader ? data.string : " ") +
    " " +
    (data.children
      ? data.children.map((x) => getStrings(x, true)).join(" ")
      : " ")
  );
};

const getQuery = (data) => {
  return data.reduce(
    (acc, x) =>
      (acc += x[1].reduce((acc1, x) => (acc1 += x.string + " "), " ")),
    " "
  );
};

const countWords = (words) => {
  const cntDict = words.split(" ").reduce((acc, w) => {
    const x = w.toLowerCase().replace(/[\{\}\-\#\[\]\(\)\.\,]/g, "");
    if (
      stopwords.includes(x) ||
      x.includes("/") ||
      x.includes("http") ||
      x.length === 0
    ) {
      return acc;
    }
    if (!acc[x]) {
      acc[x] = 1;
    } else {
      acc[x] += 1;
    }
    return acc;
  }, {});
  const ary = Object.keys(cntDict).map((x) => ({ text: x, value: cntDict[x] }));
  return orderBy(ary, ["value"], ["desc"]).slice(0, 50);
};


const App = () => {
  const [state, setState] = React.useState([]);
  const [rawState, setRawState] = React.useState();
  React.useEffect(() => {
    window.parent.postMessage({ type: "roamIframeAPI.ready" }, "*");
    window.addEventListener("message", (e) => {
      if (!typeof e.data === "object" || !e.data["roam-data"]) {
        return;}
      setRawState(e.data["roam-data"])
    });
  }, []);
  console.log(rawState)
  return (<div style={{display: 'flex', flexDirection: 'row'}}>
  {!rawState? null : rawState['block-refs'].map(b => 
  <WordcloudComponent state={countWords(getStrings(b,true))} rawState={b}/>)}
  </div>)
}

const WordcloudComponent = ({state,rawState}) =>{
  
  const blocksRecursive = (x) => ([x, ...(x.children ? x.children.flatMap(y=>blocksRecursive(y)):[])]);

const onWordClick =(word) =>{
   const w = word.text
   const blocks = (rawState)
  const targetBlock = blocksRecursive(blocks).find(x => x.string.includes(w))
   window.parent.postMessage({ type: "roamIframeAPI.ui.right-sidebar.add-window", window: {"block-uid":  targetBlock.uid , "type": "block"}}, "*");
}

  const fontSizeMapper = (word) => Math.log2(word.value) * 15;
  const rotate = (word) => word.value % 360;

  return state ? (
    <div style={{borderStyle:"solid"}}>
    <WordCloud width={200} height={200} data={state} fontSizeMapper={fontSizeMapper} rotate={rotate} onWordClick={onWordClick}/></div>
      ) : <>Waiting for data</>;
};

export default App;
