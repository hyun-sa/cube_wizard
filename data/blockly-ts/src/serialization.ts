/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { setMainWorkspace } from 'blockly/core/common';
import { javascriptGenerator } from 'blockly/javascript';
import { toolbox } from './toolbox';
import { workspaceCommentOption } from 'blockly/core/contextmenu';
import { rejections } from 'winston';

const storageKey = 'mainWorkspace';

// 파일 저장
export class fileFacade {
  private static instance: fileFacade;

  private static jsonData: string;
  private static loadData: string;
  private static isLoaded: boolean;

  private static workspace: Blockly.Workspace;

  private static codeDiv = document.getElementById('generatedCode')?.firstChild;
  private static outputDiv = document.getElementById('output');
  // private static blocklyDiv = document.getElementById('blocklyDiv');
  // private static blocklyWidgetDiv = document.getElementById('blocklyWidgetDiv');
  // private static ws = fileFacade.blocklyDiv && Blockly.inject(fileFacade.blocklyDiv, {toolbox});

  private static promise: Promise<number> | null = null;
  private static stopFlag = false;

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
    
    if (data !== null && fileFacade.workspace) {

      Blockly.Events.disable();
      Blockly.serialization.workspaces.load(JSON.parse(data), fileFacade.workspace);
      if (fileFacade.outputDiv) fileFacade.outputDiv.innerHTML = 'success';
      Blockly.Events.enable();
    }
    

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
    fileFacade.stopFlag = true;
    // fileFacade.promise = null;
    this.runWebSocket();
  });

  
  runWebSocket = (() => {
    var W3CWebSocket = require('websocket').w3cwebsocket;
    var client = new W3CWebSocket('ws://localhost:9998/');

    // if (fileFacade.promise === null) {
      fileFacade.promise = new Promise<number>(() => {
      // 비동기 작업
      console.log("server start");
      


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
      if (fileFacade.stopFlag) {
        fileFacade.stopFlag = false;
        // client.close();
        // return;
      }
    });
    // fileFacade.promise.then();///
  // }

    
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

