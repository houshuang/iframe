// @flow

import * as React from 'react';
import './react-datasheet.css';
import {evaluate} from 'mathjs';
import { assign, each } from 'lodash';
import Datasheet from 'react-datasheet';

export const cloneDeep = (o) => {
  let newO;
  let i;

  if (typeof o !== 'object') return o;

  if (!o) return o;
  if (o instanceof Date) return new Date(o.valueOf());
  if (Object.prototype.toString.apply(o) === '[object Array]') {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = cloneDeep(o[i]);
    }
    return newO;
  }

  newO = {};
  // eslint-disable-next-line no-restricted-syntax
  for (i in o) {
    if (Object.prototype.hasOwnProperty.call(o, i)) {
      newO[i] = cloneDeep(o[i]);
    }
  }
  return newO;
};

const numberRegex = new RegExp(/^-?\d*\.?,?\d+$/);

const alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const flattenOne = (ary) =>
  ary.reduce(
    (acc, x) => (Array.isArray(x) ? [...acc, ...x] : [...acc, x]),
    []
  );

const getLetter = index =>
  index < 26
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index]
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(index / 26) - 1] +
      getLetter(index - Math.floor(index / 26) * 26);

const createArrayAlphabet = length =>
  length < 0 ? [] : [...createArrayAlphabet(length - 1), getLetter(length - 1)];

const dataStructure = (query = '') => {
  console.log('')
  const val = query.split('=')
  let rows = 4
  let cols = 4
  if(val && val.length === 2){
    const [newrows,newcols] = val[1].split('x')
    rows=parseInt(newrows,10)
    cols =parseInt(newcols,10)
  }
  console.log(rows, cols)
  return (
  Array((rows || 4) + 1)
    .fill(0)
    .map((_, i) =>
      alphabet.slice(0, (cols || 4) + 1).map((col, j) => {
        if (i === 0 && j === 0) {
          return { readOnly: true, value: '                ' };
        }
        if (i === 0) {
          return {
            readOnly: true,
            value: col
          };
        }
        if (j === 0) {
          return { readOnly: true, value: i };
        }
        return { value: '', key: col + i, col: j, row: i };
      })
    )
)};

const generateOneRow = (cols, row) =>
  alphabet.slice(0, cols + 1).map((i, j) => {
    if (j === 0) {
      return { readOnly: true, value: row };
    }
    return { value: '', key: i + row + '', col: j, row };
  });


class Spreadsheet extends React.Component {
  state = {defaultData: dataStructure(document.location.search), data: dataStructure(document.location.search)}
  validateExp(trailKeys, expr) {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.forEach(match => {
      if (trailKeys.indexOf(match) > -1) {
        valid = false;
      } else {
        valid = this.validateExp(
          [...trailKeys, match],
          this.props.data[match].expr
        );
      }
    });
    return valid;
  }

  computeExpr(key, expr, scope) {
    let value = null;
    if (!expr) {
      return;
    }
    if (expr.charAt(0) !== '=') {
      return { className: '', value: expr, expr };
    } else {
      try {
        value = evaluate(expr.substring(1), scope);
      } catch (e) {
        value = null;
      }

      if (value !== null) {
        // && this.validateExp([key], expr))
        return { className: 'equation', value, expr };
      } else {
        return { className: 'error', value: 'error', expr: '' };
      }
    }
  }

  cellUpdate(changeCell, expr, col, row) {
    const {data} = this.state
    const scope = flattenOne(data).reduce(
      (acc, x) => ({
        ...acc,
        [x.key]: Number.isNaN(x.value) ? 0 : parseFloat(x.value)
      }),
      {}
    );
    const updatedCell = assign(
      {},
      changeCell,
      this.computeExpr(changeCell.key, expr, scope)
    );
    const {newData} = this.state
    const existing = newData && newData.find(x => x.string.split(':')[0] === changeCell.key)
    if(existing) {
    window.parent.postMessage({ type: "roamIframeAPI.data.block.update", block: {string: changeCell.key+': '+ updatedCell.value , uid: existing.uid }}, "*");
    } else {
    window.parent.postMessage({ type: "roamIframeAPI.data.block.create", block: {string: changeCell.key+': '+ updatedCell.value }}, "*");
    }
    
    data[row][col] = updatedCell
    console.log(data)
    this.setState({data})
  }

  onCellsChanged = changes => {
    changes.forEach(({ cell, value, col, row }) => {
      this.cellUpdate(cell, value, col, row);
    });
  };


  componentDidMount = () => {
    window.parent.postMessage({ type: "roamIframeAPI.ready" }, "*");
    window.addEventListener("message", (e) => {
      if (!typeof e.data === "object" || !e.data["roam-data"]) {
        return;
      }
      console.log('DATA', e.data)
      const newData = e.data["roam-data"]["blocks-below"].children
    let data = cloneDeep(this.state.defaultData)  
    if(newData) {
      newData.forEach(cell => {
        const [idx, val] = cell.string.split(':')
        if(!val) { return }
    
        const [letter, numberStr] = idx.split('')
        const letteridx = alphabet.findIndex(x=>x===letter)
        const number = parseInt(numberStr,10)
        try{
          data[number][letteridx].value=val
        } catch(e) { console.error(e)}
      }
    )}
    this.setState({data,newData});
    });
  }
  
  render() {
    const {data} = this.state
    return (data ? (
      <div
        style={{
          fontSize: '1.3em',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <Datasheet
            style={{ width: '100%' }}
            data={data}
            dataRenderer={cell => cell.expr}
            valueRenderer={cell => cell.value}
            onCellsChanged={this.onCellsChanged}
          />
          
        </div>
      </div>
    ): null);
  }
}


export default Spreadsheet;
