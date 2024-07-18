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

import { HalsteadComplexityAnalyzer } from './complex';

import { saveAs } from 'file-saver';
// import { pythonGenerator } from './generators/python';
import { pythonGenerator } from 'blockly/python';
import { string } from 'blockly/core/utils';

import { loadPyodide } from 'pyodide';

declare const Sk: any;

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

    const compareButton = document.getElementById('compare'); 
    const complexityOutputDiv = document.getElementById('complexity');
    const runButton = document.getElementById('run');
    // var code = null;

    var language = 'javascript';



    var code: string = '';

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


    if (runButton) {
      runButton.addEventListener('click', function () {
        // if (outputDiv) outputDiv.textContent = '';
        if (language === 'javascript') {
          code = javascriptGenerator.workspaceToCode(ws);
          //result code

          let capturedLog: string | null = null;
  
          const originalConsoleLog = console.log;
          console.log = function(...args) {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            capturedLog = message;
            originalConsoleLog.apply(console, [message]);
          };


          function evalAndCapture(code: string): string | null {
            capturedLog = null;
            eval(code);
            return capturedLog;
          }
    
          if (outputDiv) outputDiv.textContent += evalAndCapture(code) || '';
        }
        else if (language === 'python') {
          function outf(text: string) { 
            if (outputDiv) outputDiv.textContent += text;
          } 
          function builtinRead(x: string) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                    throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
          }
          function runit(code: string) { 
            Sk.pre = "output";
            Sk.configure({output:outf, read:builtinRead}); 
            (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
            var myPromise = Sk.misceval.asyncToPromise(function() {
                return Sk.importMainWithBody("<stdin>", false, code, true);
            });
            myPromise.then(function(mod: any) {
                console.log('success');
            },
                function(err: { toString: () => any; }) {
                console.log(err.toString());
            });
          } 

          runit(code);

        }
        


      });
    }

    if (compareButton) {
      let result: any = null;
      let analyzer = null;
      compareButton.addEventListener('click', function () {
        if (language == 'javascript') {
          analyzer = new HalsteadComplexityAnalyzer(code, 'javascript');
          result  = analyzer.analyze();
          console.log('JavaScript Halstead Complexity:', analyzer.analyze());
          if (complexityOutputDiv){
            complexityOutputDiv.innerHTML = 'JavaScript Halstead Complexity: ' + JSON.stringify(analyzer.analyze());}
        } else if (language == 'python') {
          analyzer = new HalsteadComplexityAnalyzer(code, 'python');
          result  = analyzer.analyze();
          console.log(analyzer.analyze());
        }
        if (complexityOutputDiv){
          const { metrics, complexity } = result;
          const complexityOutput = 
          `n1=${metrics.n1}\t\tlength=${complexity.programLength}\n` +
          `n2=${metrics.n2}\t\tvocabulary=${complexity.vocabulary}\n` +
          `N1=${metrics.N1}\t\tvolume=${complexity.volume}\n` +
          `N2=${metrics.N2}\t\tdifficulty=${complexity.difficulty}\n` +
          `\t\teffort=${complexity.effort}\n` +
          `\t\ttime=${complexity.time}\n` +
          `\t\tbugs=${complexity.bugs}`;

          console.log(complexityOutput);
          complexityOutputDiv.innerHTML = complexityOutput; 
        }
      });
    }

    
    // const pythonAnalyzer = new HalsteadComplexityAnalyzer(pythonCode, 'python');
    // const jsAnalyzer = new HalsteadComplexityAnalyzer(jsCode, 'javascript');
  
    // console.log('Python Halstead Complexity:', pythonAnalyzer.analyze());
    // console.log('JavaScript Halstead Complexity:', jsAnalyzer.analyze());
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
      // runCode();
    });
  };
// });
