/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const storageKey = 'mainWorkspace';

/**
 * Saves the state of the workspace to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export const save = function (workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 */
export const load = async function (workspace: Blockly.Workspace) {
  // const data = window.localStorage?.getItem(storageKey);

  async function readFile(path: string = 'load_test.cw'): Promise<string> {
    try {
      const response = await fetch('http://localhost:8081/' + path);
      const data = await response.text();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error reading file:', error);
      console.log('{}'+ error);
      return '{}';
    }
  }

  const data = await readFile()

  if (!data) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace, undefined);
  Blockly.Events.enable();
};
