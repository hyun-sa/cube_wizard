/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { setMainWorkspace } from 'blockly/core/common';
import { javascriptGenerator } from 'blockly/javascript';
import { toolbox } from './toolbox';

const storageKey = 'mainWorkspace';

// 파일 저장
export class fileFacade {
  private static instance: fileFacade;

  private static jsonData: string;
  private static loadData: string;
  private static isLoaded: boolean;

  private static workspace: Blockly.Workspace;
  // private static workspace: Blockly.Workspace = Blockly.getMainWorkspace();

  // constructor() {
  //   this.jsonData = undefined;
  // }


  private static codeDiv = document.getElementById('generatedCode')?.firstChild;
  private static outputDiv = document.getElementById('output');
  private static blocklyDiv = document.getElementById('blocklyDiv');
  private static blocklyWidgetDiv = document.getElementById('blocklyWidgetDiv');
  // private static ws = fileFacade.blocklyDiv && Blockly.inject(fileFacade.blocklyDiv, {toolbox});




  private runCode = () => {
    const code = javascriptGenerator.workspaceToCode(fileFacade.workspace);
    if (fileFacade.codeDiv) fileFacade.codeDiv.textContent = code;

    if (fileFacade.outputDiv) fileFacade.outputDiv.innerHTML = 'dw';

    eval(code);
  };

  private clearCode = () => {
    const code = javascriptGenerator.workspaceToCode(fileFacade.workspace);
    if (fileFacade.codeDiv) fileFacade.codeDiv.textContent = "";

    if (fileFacade.outputDiv) fileFacade.outputDiv.innerHTML = 'dw';

    eval(code);
  };

  public static getIstance() {
    if (!fileFacade.instance) {
      fileFacade.instance = new fileFacade();
    }

    return fileFacade.instance;
  }

  constructor() {
    fileFacade.isLoaded = false;
  }

  setWorkspace = ((ws: Blockly.Workspace) => {
    fileFacade.workspace = ws;
  });


  isloaded = (() => {
    return fileFacade.isLoaded;
  });

  loading = () => {

    const data = this.isloaded() ? this.getData()! : false;
    // console.log(data);
    if (!data) return;
    console.log("load" + data);



    // load(workspace);
    // Don't emit events during loading.
    // Blockly.Events.disable();
    // const ws = fileFacade.blocklyDiv && Blockly.inject(fileFacade.blocklyDiv, {toolbox});
    // if (ws) {
    //   Blockly.serialization.workspaces.load(JSON.parse(data), ws, undefined);
    // }

    // Blockly.Events.enable();
    // this.runCode();
    // const serializer = new Blockly.serialization.variables.VariableSerializer();
    // const state = serializer.save(fileFacade.workspace);
    // this.clearCode();
    Blockly.Events.disable();

    if (data !== null) {
      // serializer.load(JSON.parse(data), fileFacade.workspace);
      // if (fileFacade.outputDiv) fileFacade.outputDiv.innerHTML = 'success';
      Blockly.serialization.workspaces.load(JSON.parse(data), fileFacade.workspace);
      if (fileFacade.outputDiv) fileFacade.outputDiv.innerHTML = 'succe2212ss';
    }
    Blockly.Events.enable();
    // this.runCode();

  };
  setData = ((data: string) => {
    console.log("setData" + data);
    fileFacade.jsonData = data;
  });

  getData = (() => {
    if (this.isloaded()) {
      return fileFacade.loadData;
    }
  });

  savefile = (() => {
    var W3CWebSocket = require('src/WebSocket').w3cwebsocket;
    const promise = new Promise<number>(() => {
      // 비동기 작업
      console.log("server start");
      var client = new W3CWebSocket('ws://localhost:9998/');

      function sendJSON(jsonData: string) {
        if (client.readyState === client.OPEN) {
          console.log("send data" + jsonData);
          client.send(jsonData);
          setTimeout(sendJSON, 1000);
        }
      }

      client.onerror = () => {
        console.log('Connection Error');
      };

      client.onopen = () => {
        console.log('WebSocket Client Connected');
        sendJSON(fileFacade.jsonData);
        // client.close();
      };

      client.onmessage = (e: any) => {
        // if (fileFacade.outputDiv) fileFacade.outputDiv.innerHTML = e.data;
        if (e.data !== 'undefined') {
          fileFacade.loadData = e.data;
          fileFacade.isLoaded = true;
          if (fileFacade.outputDiv) fileFacade.outputDiv.innerHTML = fileFacade.loadData;
          this.loading();

        }

      };

      client.onclose = function () {
        console.log('echo-protocol Client Closed');
      };
    });

    promise.then();
  });

}


/**
 * Saves the state of the workspace to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export const save = function (workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  const jsonData = JSON.stringify(data);
  console.log(data);
  console.log(jsonData);
  const pythonSideFacade = fileFacade.getIstance();
  pythonSideFacade.setData(jsonData);
  pythonSideFacade.savefile();
  // saveFile(Blockly.serialization.workspaces.save(workspace));

  // window.localStorage?.setItem(storageKey, jsonData);
};



/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 */
export const load = function (workspace: Blockly.Workspace) {
  var data = window.localStorage?.getItem(storageKey);
  console.log(data);

  if (!data) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace, undefined);
  Blockly.Events.enable();
};

