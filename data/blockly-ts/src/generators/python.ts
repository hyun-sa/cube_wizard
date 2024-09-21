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
  const deque = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_remove_front',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return list.pop(0)`
  );
  return [`${functionName}(${deque})`, 0];
};

forBlock2['deque_remove_back'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const deque = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_remove_back',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
  return list.pop()`
  );
  return [`${functionName}(${deque})`, 0];
};

forBlock2['priority_queue_enqueue'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const priority = generator.valueToCode(block, 'PRIORITY', Order.NONE) || "0";
  const queue = generator.valueToCode(block, 'QUEUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'priority_queue_enqueue',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, priority, queue):
      queue.append((value, priority))
      queue.sort(key=lambda x: x[1])
    `
  );
  const code = `${functionName}(${value}, ${priority}, ${queue})\n`;
  return code;
};

forBlock2['priority_queue_dequeue'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const queue = generator.valueToCode(block, 'QUEUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'priority_queue_dequeue',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(queue):
      return queue.pop(0)[0] if queue else None
    `
  );
  return [`${functionName}(${queue})`, 0];
};

forBlock2['linked_list_add'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'linked_list_add',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, list):
      node = {'value': value, 'next': None}
      if list:
        list[-1]['next'] = node
      list.append(node)
    `
  );
  const code = `${functionName}(${value}, ${list})\n`;
  return code;
};

forBlock2['linked_list_remove_first'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'linked_list_remove_first',
    `def ${generator.FUNCTION_NAME_PLACEHOLDER_}(list):
      if list:
        removed_value = list[0]['value']
        list.pop(0)
        return removed_value
      return None
    `
  );
  return [`${functionName}(${list})`, 0];
};

forBlock2['input'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const variable = generator.nameDB_?.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  const message = generator.valueToCode(block, 'MESSAGE', Order.NONE) || "''";
  
  const code = `
${variable} = input(${message})
try:
    ${variable} = float(${variable}) if '.' in ${variable} else int(${variable})
except ValueError:
    ${variable} = ${variable}.lower() == 'true' if ${variable}.lower() in ['true', 'false'] else ${variable}
`;
  
  return code;
}

forBlock2['c_input'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const variable = generator.nameDB_?.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  const message = block.getFieldValue('MESSAGE') ? `"${block.getFieldValue('MESSAGE')}"` : "";
  
  const code = `
${variable} = input(${message})
try:
    ${variable} = float(${variable}) if '.' in ${variable} else int(${variable})
except ValueError:
    ${variable} = ${variable}.lower() == 'true' if ${variable}.lower() in ['true', 'false'] else ${variable}
`;
  
  return code;
}