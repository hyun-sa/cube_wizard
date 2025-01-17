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


const stack_push = {
  "type": "stack_push",
  "message0": "Push %1 onto %2",
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
  "colour": 1000,
  "tooltip": "Pushes a value onto the stack",
  "helpUrl": ""
};


const stack_pop = {
  "type": "stack_pop",
  "message0": "Pop from %1",
  "args0": [
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    },
  ],
  "output": "Number",
  "colour": 1000,
  "previousStatement": null,
  "tooltip": "Pops the top value from the stack",
  "helpUrl": ""
};

const stack_top = {
  "type": "stack_top",
  "message0": "Top of %1",
  "args0": [
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    },
  ],
  "output": "Number",
  "colour": 1000,
  "previousStatement": null,
  "tooltip": "Returns the top value of the stack",
  "helpUrl": ""
}

const is_empty ={
  "type": "is_empty",
  "message0": "Is %1 empty?",
  "args0": [
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "output": "Boolean",
  "colour": 1000,
  "tooltip": "Returns true if the stack is empty, false otherwise",
  "helpUrl": ""
}

const newline ={
  "type": "newline",
  "message0": "new line",
  "output":"String",
  "colour": 200,
  "tooltip": "new line",
  "helpUrl": ""
}

const sort ={
  "type": "sort",
  "message0": "Sort %1",
  "args0": [
    {
      "type": "input_value",
      "name": "LIST",
      "check": "Array"
    }
  ],
  "colour": 200,
  "previousStatement": null,
  "nextStatement": null,
  "tooltip": "list sort",
  "helpUrl": ""
}
// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const stblocks = Blockly.common.createBlockDefinitionsFromJsonArray([stack_pop, stack_push, stack_top, is_empty, newline,sort]);
