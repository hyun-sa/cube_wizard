/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/python';
import * as Blockly from 'blockly/core';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock2 = Object.create(null);

forBlock2['add_text'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const color =
    generator.valueToCode(block, 'COLOR', Order.ATOMIC) || "'#ffffff'";

  const addText = generator.provideFunction_(
    'addText',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(text, color): {

  # Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  textEl.style.color = color;
  outputDiv.appendChild(textEl);
}`
  );
  // Generate the function call for this block.
  const code = `${addText}(${text}, ${color})\n`;
  return code;
};

forBlock2['consolePrint'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";

  const consolePrint = generator.provideFunction_(
    'consolePrint',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(text):

  # Log text to the console.
  print(text);
`
  );
  // Generate the function call for this block.
  const code = `${consolePrint}(${text})\n`;
  return code;
};

forBlock2['Alert'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";

  const Alert = generator.provideFunction_(
    'printAlert',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(text):

  # Show text in an alert dialog.
  print(text)
`
  );
  // Generate the function call for this block.
  const code = `${Alert}(${text})\n`;
  return code;
};

forBlock2['stack_push'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'stack_push',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, list): 
  list.append(value)
`
  );

  const code = `${functionName}(${value},${list})\n`;
  return code;
};

forBlock2['stack_pop'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'stack_pop',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return list.pop()
`
  );

  return [`${functionName}(${list})`, 0];
};

forBlock2['stack_top'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'stack_top',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return list[-1]
`
  );

  return [`${functionName}(${list})`, 0];
};

forBlock2['is_empty'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'is_empty',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return len(list) == 0
`
  );

  return [`${functionName}(${list})`, 0];
};

forBlock2['newline'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  return ['"\\n"', 0];
};

forBlock2['sort'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'sort',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  list.sort()
`
  );

  return `${functionName}(${list})\n`;
};

//-------------------------------------------------------------------------

forBlock2['enque'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'stack_push',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, list): 
  list.append(value)
`
  );

  const code = `${functionName}(${value},${list})\n`;
  return code;
};

forBlock2['deque'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'queue_dequeue',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return list.pop(0)`
  );

  const code = `${functionName}(${list})\n`;
  return code;
};

//-------------------------------------------------------------------------------

forBlock2['deque_add_front'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const deque = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_add_front',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, list):
  list.insert(0, value)`
  );
  const code = `${functionName}(${value}, ${deque})\n`;
  return code;
};

forBlock2['deque_add_back'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const deque = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_add_back',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, list):
  list.append(value)`
  );
  const code = `${functionName}(${value}, ${deque})\n`;
  return code;
};

forBlock2['deque_remove_front'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const deque = generator.valueToCode(block, 'DEQUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_remove_front',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return list.pop(0)`
  );
  return [`${functionName}(${deque})`, 0];
};

forBlock2['deque_remove_back'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const deque = generator.valueToCode(block, 'DEQUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_remove_back',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return list.pop()`
  );
  return [`${functionName}(${deque})`, 0];
};