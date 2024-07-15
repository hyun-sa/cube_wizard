/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.


/* 
말 그대로 블럭의 모양과 특징을 정의함
'type'은 제너레이터의 이름과 동일해야함 나중에 toolbox.js에서도 type을 맞춰져야만 오류 발생 X
'name','check'는 잘 모르겠다.
previousStatement, next~ 는 위아래 꼭지 생성 여부 true 면 생성 (위 아래로 다른 블럭들 붙히기)
'colour'는 말 그대로 블럭 색깔 toolbox의 카테고리와 같은 색깔로 통일시키면 될듯;4
*/


const enqueue = {
  "type": "enque",
  "message0": "Enque %1 onto %2",
  "args0": [
    {
      "type": "input_value",
      "name": "VALUE",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 700,
  "tooltip": "Adds a value to the end of the queue",
  "helpUrl": ""
};


const dequeue = {
  "type": "dequeue",
  "message0": "Dequeue from queue %1",
  "args0": [
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "output": "Number",
  "colour": 700,
  "tooltip": "Removes and returns the value from the front of the queue",
  "helpUrl": ""
};

//--------------------------------------------------------------------------------------

const deque_add_front = {
  "type": "deque_add_front",
  "message0": "Add %1 to front of deque %2",
  "args0": [
    {
      "type": "input_value",
      "name": "VALUE",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 260,
  "tooltip": "Adds a value to the front of the deque",
  "helpUrl": ""
}

const deque_add_back ={
  "type": "deque_add_back",
  "message0": "Add %1 to back of deque %2",
  "args0": [
    {
      "type": "input_value",
      "name": "VALUE",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 260,
  "tooltip": "Adds a value to the back of the deque",
  "helpUrl": ""
}

const deque_remove_front ={
  "type": "deque_remove_front",
  "message0": "Remove from front of deque %1",
  "args0": [
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "output": "Number",
  "colour": 260,
  "tooltip": "Removes and returns the value from the front of the deque",
  "helpUrl": ""
}

const deque_remove_back ={
  "type": "deque_remove_back",
  "message0": "Remove from back of deque %1",
  "args0": [
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "output": "Number",
  "colour": 260,
  "tooltip": "Removes and returns the value from the back of the deque",
  "helpUrl": ""
}
// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const stblocks = Blockly.common.createBlockDefinitionsFromJsonArray([enqueue, dequeue, deque_add_back, deque_add_front, deque_remove_back, deque_remove_front]);
