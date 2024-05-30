/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import { blocks } from './blocks/custom';
import { stblocks } from './blocks/stack';
import { forBlock } from './generators/javascript';
import { forBlock2 } from './generators/python';
import { javascriptGenerator } from 'blockly/javascript';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
import './index.css';
import { fileFacade } from './serialization';

import { saveAs } from 'file-saver';
// import { pythonGenerator } from './generators/python';
import { pythonGenerator } from 'blockly/python';

// import {WebSocketClient} from './WebSocket';
// import { WebSocket } from 'ws';
const WebSocket = require('ws');
const WebSocketClient = require('websocket').client;
// import ws, { WebSocketServer } from "ws";


// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Blockly.common.defineBlocks(stblocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
Object.assign(pythonGenerator.forBlock,forBlock2);


// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode')?.firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = blocklyDiv && Blockly.inject(blocklyDiv, { toolbox });

const websocket = fileFacade.getIstance();


// const promise = new Promise<number>(() => {
  // 비동기 작업

  // This function resets the code and output divs, shows the
  // generated code from the workspace, and evals the code.
  // In a real application, you probably shouldn't use `eval`.
  const runCode = () => {
    // const jsCode = javascriptGenerator.workspaceToCode(ws);
    // const pyCode = pythonGenerator.workspaceToCode(ws);



    const jsElement = document.getElementById('javascript');
    const pyElement = document.getElementById('python');

    // var code = null;

    var language = 'javascript'

    // if (jsElement) {
    //   jsElement.addEventListener('click', function () {
    //     language = 'javascript';
    //     const code = javascriptGenerator.workspaceToCode(ws);
    //     if (codeDiv) codeDiv.textContent = code;
    //     alert('js clicked!');
    //   });
    // }
    // if (pyElement) {
    //   pyElement.addEventListener('click', function () {
    //     language = 'python';
    //     const code = pythonGenerator.workspaceToCode(ws);
    //     if (codeDiv) codeDiv.textContent = code;
    //     alert('python clicked!');
    //   });
    // }

    var code = null;

    if (jsElement) {
      jsElement.addEventListener('click', function () {
        language = 'javascript';
        code = javascriptGenerator.workspaceToCode(ws);
        if (codeDiv) codeDiv.textContent = code;
      });
    }
    if (pyElement) {
      pyElement.addEventListener('click', function () {
        language = 'python';
        code = pythonGenerator.workspaceToCode(ws);
        if (codeDiv) codeDiv.textContent = code;
      });
    }

    // if (codeDiv) codeDiv.textContent = code;

    // const pythonCode = pythonGenerator.workspaceToCode(ws);
    // if (codeDiv) codeDiv.textContent = pythonCode;

    if (outputDiv) outputDiv.innerHTML = '';

    if(code) eval(code);
  };


  if (ws) {
    // Load the initial state from storage and run the code.
    websocket.setWorkspace(ws);
    websocket.runWebSocket();
    load(ws);
    runCode();

    // Every time the workspace changes state, save the changes to storage.
    ws.addChangeListener((e: Blockly.Events.Abstract) => {
      // UI events are things like scrolling, zooming, etc.
      // No need to save after one of these.
      if (e.isUiEvent) return;

      var tempData = save(ws);
      console.log(tempData);
      // saveFile(save(ws));
      // saveObjectAsJson(tempData, "./temp");
    });


    // Whenever the workspace changes meaningfully, run the code again.
    ws.addChangeListener((e: Blockly.Events.Abstract) => {
      // Don't run the code when the workspace finishes loading; we're
      // already running it once when the application starts.
      // Don't run the code during drags; we might have invalid state.
      if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
        ws.isDragging()) {
        return;
      }
      runCode();
    });
  };
// });