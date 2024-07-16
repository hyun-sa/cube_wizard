/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';
import * as Blockly from 'blockly/core';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['add_text'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const color =
    generator.valueToCode(block, 'COLOR', Order.ATOMIC) || "'#ffffff'";

  const addText = generator.provideFunction_(
    'addText',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text, color) {

  // Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  textEl.style.color = color;
  outputDiv.appendChild(textEl);
}`
  );
  // Generate the function call for this block.
  const code = `${addText}(${text}, ${color});\n`;
  return code;
};

forBlock['consolePrint'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";

  const consolePrint = generator.provideFunction_(
    'consolePrint',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {

  // Log text to the console.
  console.log(text);
}`
  );
  // Generate the function call for this block.
  const code = `${consolePrint}(${text});\n`;
  return code;
};

forBlock['Alert'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";

  const Alert = generator.provideFunction_(
    'printAlert',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {

  // Show text in an alert dialog.
  alert(text);
}`
  );
  // Generate the function call for this block.
  const code = `${Alert}(${text});\n`;
  return code;
};

forBlock['stack_push'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'stack_push',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(value,list) {
  list.push(value);
}`
  );

  const code = `${functionName}(${value},${list});\n`;
  return code;
};

forBlock['stack_pop'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'stack_pop',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(list) {
  return list.pop();
}`
  );

  return [`${functionName}(${list})`, 0];
};

forBlock['stack_top'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'stack_top',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(list) {
  return list[list.length - 1];
}`
  );

  return [`${functionName}(${list})`, 0];
};

forBlock['is_empty'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'is_empty',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(list) {
  return list.length === 0;
}`
  );

  return [`${functionName}(${list})`, 0];
};

forBlock['newline'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  return ['"\\n"', 0];
};

forBlock['sort'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'sort',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(list) {
  list.sort()
}`
  );

  return `${functionName}(${list})\n`;
};

//----------------------------------------------------------------------------------------------

forBlock['enque'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const list = generator.valueToCode(block,'LIST',Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'queue_enqueue',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, queue) {
      queue.push(value);
    }`
  );
  const code = `${functionName}(${value}, ${list});\n`;
  return code;
};

forBlock['deque'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'queue_dequeue',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(queue) {
      return queue.shift();
    }`
  );

  const code = `${functionName}(${list})\n`;
  return code;
};

//-------------------------------------------------------------------------------

forBlock['deque_add_front'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const deque = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_add_front',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, deque) {
      deque.unshift(value);
    }`
  );
  const code = `${functionName}(${value}, ${deque});\n`;
  return code;
};

forBlock['deque_add_back'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const deque = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_add_back',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, deque) {
      deque.push(value);
    }`
  );
  const code = `${functionName}(${value}, ${deque});\n`;
  return code;
};

forBlock['deque_remove_front'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const deque = generator.valueToCode(block, 'DEQUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_remove_front',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(deque) {
      return deque.shift();
    }`
  );
  return [`${functionName}(${deque})`, 0];
};

forBlock['deque_remove_back'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const deque = generator.valueToCode(block, 'DEQUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'deque_remove_back',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(deque) {
      return deque.pop();
    }`
  );
  return [`${functionName}(${deque})`, 0];
};

forBlock['priority_queue_enqueue'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const priority = generator.valueToCode(block, 'PRIORITY', Order.NONE) || "0";
  const queue = generator.valueToCode(block, 'QUEUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'priority_queue_enqueue',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, priority, queue) {
      queue.push({value: value, priority: priority});
      queue.sort((a, b) => a.priority - b.priority);
    }`
  );
  const code = `${functionName}(${value}, ${priority}, ${queue});\n`;
  return code;
};

forBlock['priority_queue_dequeue'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const queue = generator.valueToCode(block, 'QUEUE', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'priority_queue_dequeue',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(queue) {
      return queue.shift().value;
    }`
  );
  return [`${functionName}(${queue})`, 0];
};

forBlock['linked_list_add'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'linked_list_add',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(value, list) {
      list.push({value: value, next: null});
      if (list.length > 1) {
        list[list.length - 2].next = list[list.length - 1];
      }
    }`
  );
  const code = `${functionName}(${value}, ${list});\n`;
  return code;
};

forBlock['linked_list_remove_first'] = function (block: Blockly.Block, generator: Blockly.CodeGenerator) {
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || "[]";
  const functionName = generator.provideFunction_(
    'linked_list_remove_first',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(list) {
      if (list.length > 0) {
        const removedValue = list[0].value;
        list.shift();
        return removedValue;
      } else {
        return null;
      }
    }`
  );
  return [`${functionName}(${list})`, 0];
};