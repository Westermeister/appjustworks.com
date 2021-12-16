<!--
  Vue SFC for: RPN Calculator | App Just Works
  Copyright (c) 2021 Westermeister. All rights reserved.
-->

<template>
  <div id="display">
    <div v-if="hasIndex(stack.length - 3)" id="row-3">
      {{ stack[stack.length - 3] }}
    </div>
    <div v-else id="row-3">&nbsp;</div>

    <div v-if="hasIndex(stack.length - 2)" id="row-2">
      {{ stack[stack.length - 2] }}
    </div>
    <div v-else id="row-2">&nbsp;</div>

    <div class="variable-row">
      <div class="variable">y:</div>
      <div v-if="hasIndex(stack.length - 1)" id="row-1">
        {{ stack[stack.length - 1] }}
      </div>
      <div v-else id="row-1">&nbsp;</div>
    </div>

    <div class="variable-row">
      <div class="variable">x:</div>
      <div id="input-field">{{ inputField }}</div>
    </div>
  </div>
  <div class="row g-1">
    <!-- Radian/degree toggle, percent and percent diff ops, inverse op, and rounding function -->

    <div class="col-2">
      <button
        id="rad"
        type="button"
        :class="{
          'calc-btn-highlight': usingRadians,
          'calc-btn-num': !usingRadians,
        }"
        @click="usingRadians = true"
      >
        rad
      </button>
    </div>
    <div class="col-2">
      <button
        id="deg"
        type="button"
        :class="{
          'calc-btn-num': usingRadians,
          'calc-btn-highlight': !usingRadians,
        }"
        @click="usingRadians = false"
      >
        deg
      </button>
    </div>
    <div class="col-2">
      <button
        id="percent"
        type="button"
        class="calc-btn-generic"
        @click="percent"
      >
        %
      </button>
    </div>
    <div class="col-2">
      <button
        id="percentDiff"
        type="button"
        class="calc-btn-generic"
        @click="binaryOperation('percentDiff')"
      >
        &#x25B3;%
      </button>
    </div>
    <div class="col-2">
      <button
        id="invert"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('invert')"
      >
        1/x
      </button>
    </div>
    <div class="col-2">
      <button
        id="round"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('round')"
      >
        round
      </button>
    </div>

    <!-- Trig functions -->

    <div class="col-2">
      <button
        id="sin"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('sin')"
      >
        sin
      </button>
    </div>
    <div class="col-2">
      <button
        id="cos"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('cos')"
      >
        cos
      </button>
    </div>
    <div class="col-2">
      <button
        id="tan"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('tan')"
      >
        tan
      </button>
    </div>
    <div class="col-2">
      <button
        id="asin"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('asin')"
      >
        asin
      </button>
    </div>
    <div class="col-2">
      <button
        id="acos"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('acos')"
      >
        acos
      </button>
    </div>
    <div class="col-2">
      <button
        id="atan"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('atan')"
      >
        atan
      </button>
    </div>

    <!-- Exponents and square roots -->
    <!-- Note the use of subscripts instead of superscripts b/c the former doesn't change the button's height. -->

    <div class="col-2">
      <button
        id="powerOf10"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('powerOf10')"
      >
        <sub>10</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        id="powerOfE"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('powerOfE')"
      >
        <sub>e</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        id="powerOf2"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('powerOf2')"
      >
        <sub>2</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        id="powerOfY"
        type="button"
        class="calc-btn-generic"
        @click="binaryOperation('powerOfY')"
      >
        <sub>y</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        id="sqrt"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('sqrt')"
      >
        &#x221A;x
      </button>
    </div>
    <div class="col-2">
      <button
        id="xRootY"
        type="button"
        class="calc-btn-generic"
        @click="binaryOperation('xRootY')"
      >
        <small>x</small><sub>&#x221A;y</sub>
      </button>
    </div>

    <!-- More exponents, logarithms, and pi -->

    <div class="col-2">
      <button
        id="logBase10"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('logBase10')"
      >
        log<sub>10</sub>
      </button>
    </div>
    <div class="col-2">
      <button
        id="naturalLog"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('naturalLog')"
      >
        ln
      </button>
    </div>
    <div class="col-2">
      <button
        id="logBase2"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('logBase2')"
      >
        log<sub>2</sub>
      </button>
    </div>
    <div class="col-2">
      <button
        id="logBaseY"
        type="button"
        class="calc-btn-generic"
        @click="binaryOperation('logBaseY')"
      >
        log<sub>y</sub>x
      </button>
    </div>
    <div class="col-2">
      <button
        id="square"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('square')"
      >
        <sub>X</sub><small>2</small>
      </button>
    </div>
    <div class="col-2">
      <button id="pi" type="button" class="calc-btn-generic" @click="pi">
        &#x3C0;
      </button>
    </div>

    <!-- Operations incl. factorial, positive/negative, swap, roll, modulus, and e constant -->

    <div class="col-2">
      <button
        id="factorial"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('factorial')"
      >
        x!
      </button>
    </div>
    <div class="col-2">
      <button
        id="negate"
        type="button"
        class="calc-btn-generic"
        @click="unaryOperation('negate')"
      >
        +/-
      </button>
    </div>
    <div class="col-2">
      <button id="swap" type="button" class="calc-btn-generic" @click="swap">
        swap
      </button>
    </div>
    <div class="col-2">
      <button id="roll" type="button" class="calc-btn-generic" @click="roll">
        roll
      </button>
    </div>
    <div class="col-2">
      <button
        id="mod"
        type="button"
        class="calc-btn-generic"
        @click="binaryOperation('modulus')"
      >
        mod
      </button>
    </div>
    <div class="col-2">
      <button
        id="e"
        type="button"
        class="calc-btn-generic"
        @click="eulersNumber"
      >
        e
      </button>
    </div>

    <!-- Top numerical row: includes AC, memory add, numbers, and division -->

    <div class="col-2">
      <button id="AC" type="button" class="calc-btn-generic" @click="allClear">
        AC
      </button>
    </div>
    <div class="col-2">
      <button
        id="m-add"
        type="button"
        class="calc-btn-generic"
        @click="memoryAdd"
      >
        m+
      </button>
    </div>
    <div class="col-2">
      <button
        id="num7"
        type="button"
        class="calc-btn-num"
        @click="addDigit('7')"
      >
        7
      </button>
    </div>
    <div class="col-2">
      <button
        id="num8"
        type="button"
        class="calc-btn-num"
        @click="addDigit('8')"
      >
        8
      </button>
    </div>
    <div class="col-2">
      <button
        id="num9"
        type="button"
        class="calc-btn-num"
        @click="addDigit('9')"
      >
        9
      </button>
    </div>
    <div class="col-2">
      <button
        id="divide"
        type="button"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('divide')"
      >
        &#xF7;
      </button>
    </div>

    <!-- Includes memory clear, memory subtract, numbers, and multiplication -->

    <div class="col-2">
      <button
        id="MC"
        type="button"
        class="calc-btn-generic"
        @click="memoryClear"
      >
        MC
      </button>
    </div>
    <div class="col-2">
      <button
        id="m-"
        type="button"
        class="calc-btn-generic"
        @click="memorySubtract"
      >
        m-
      </button>
    </div>
    <div class="col-2">
      <button
        id="num4"
        type="button"
        class="calc-btn-num"
        @click="addDigit('4')"
      >
        4
      </button>
    </div>
    <div class="col-2">
      <button
        id="num5"
        type="button"
        class="calc-btn-num"
        @click="addDigit('5')"
      >
        5
      </button>
    </div>
    <div class="col-2">
      <button
        id="num6"
        type="button"
        class="calc-btn-num"
        @click="addDigit('6')"
      >
        6
      </button>
    </div>
    <div class="col-2">
      <button
        id="multiply"
        type="button"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('multiply')"
      >
        &#xD7;
      </button>
    </div>

    <!-- Second to last row: includes CE, memory input, numbers, and subtraction -->

    <div class="col-2">
      <button
        id="CE"
        type="button"
        class="calc-btn-generic"
        @click="clearEntry"
      >
        CE
      </button>
    </div>
    <div class="col-2">
      <button
        id="m-in"
        type="button"
        class="calc-btn-generic"
        @click="memoryInput"
      >
        m in
      </button>
    </div>
    <div class="col-2">
      <button
        id="num1"
        type="button"
        class="calc-btn-num"
        @click="addDigit('1')"
      >
        1
      </button>
    </div>
    <div class="col-2">
      <button
        id="num2"
        type="button"
        class="calc-btn-num"
        @click="addDigit('2')"
      >
        2
      </button>
    </div>
    <div class="col-2">
      <button
        id="num3"
        type="button"
        class="calc-btn-num"
        @click="addDigit('3')"
      >
        3
      </button>
    </div>
    <div class="col-2">
      <button
        id="subtract"
        type="button"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('subtract')"
      >
        &#x2212;
      </button>
    </div>

    <!-- Final row: includes drop, memory recall, 0, decimal point, enter, and addition -->

    <div class="col-2">
      <button id="drop" type="button" class="calc-btn-generic" @click="drop">
        drop
      </button>
    </div>
    <div class="col-2">
      <button
        id="m-re"
        type="button"
        class="calc-btn-generic"
        @click="memoryRecall"
      >
        m re
      </button>
    </div>
    <div class="col-2">
      <button
        id="num0"
        type="button"
        class="calc-btn-num"
        @click="addDigit('0')"
      >
        0
      </button>
    </div>
    <div class="col-2">
      <button
        id="decimal"
        type="button"
        class="calc-btn-num fw-bold"
        @click="addDigit('.')"
      >
        .
      </button>
    </div>
    <div class="col-2">
      <button
        id="enter"
        type="button"
        class="calc-btn-highlight"
        @click="enter"
      >
        enter
      </button>
    </div>
    <div class="col-2">
      <button
        id="add"
        type="button"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('add')"
      >
        &#x2B;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Holds calculator state.
const stack = ref([] as string[]);

// Holds the state of the input field.
const inputField = ref("0");

// Enables completely overwriting the entry row.
// Activates after pressing enter, then immediately deactivates.
const readyForOverwrite = ref(false);

// Controls whether the calculator is in radians or degrees mode.
const usingRadians = ref(true);

// Holds a single number in storage.
const memoryValue = ref(0);

/**
 * Caps the maximum number of significant figures in a number.
 * @param value - The value to cap.
 * @returns The value but capped at 15 significant figures or fewer.
 */
function capSigFigs(value: number): number {
  return Number(value.toPrecision(15));
}

/** Replaces input with Euler's number. */
function eulersNumber(): void {
  inputField.value = String(capSigFigs(Math.E));
}

/** Replaces input with pi. */
function pi(): void {
  inputField.value = String(capSigFigs(Math.PI));
}

/** Stores input into memory. */
function memoryInput(): void {
  memoryValue.value = Number(inputField.value);
}

/** Returns the value from memory, overwriting the input field. */
function memoryRecall(): void {
  inputField.value = String(memoryValue.value);
}

/** Add input to memory. */
function memoryAdd(): void {
  memoryValue.value = capSigFigs(memoryValue.value + Number(inputField.value));
}

/** Subtract input from memory. */
function memorySubtract(): void {
  memoryValue.value = capSigFigs(memoryValue.value - Number(inputField.value));
}

/** Clear the value from memory. */
function memoryClear(): void {
  memoryValue.value = 0;
}

/**
 * Adds a digit to the input field.
 * @param digit - The digit to add. Can be a decimal point as well.
 */
function addDigit(digit: string): void {
  if (inputField.value === "0" && digit === ".") {
    inputField.value += digit;
  } else if (inputField.value === "0") {
    inputField.value = digit;
  } else if (readyForOverwrite.value) {
    inputField.value = digit;
    readyForOverwrite.value = false;
  } else if (digit === "." && inputField.value.includes(".")) {
    return;
  } else {
    inputField.value += digit;
  }
}

/** Enters a number onto the stack. */
function enter(): void {
  // Cap maximum precision (but allow less precision).
  const toAdd = capSigFigs(Number(inputField.value));
  stack.value.push(String(toAdd));
  readyForOverwrite.value = true;
}

/**
 * Tells whether the stack has an index or not.
 * @param index - Stack index to check.
 * @returns Whether the given index exists in the stack.
 */
function hasIndex(index: number): boolean {
  if (stack.value.length === 0 || index < 0 || index >= stack.value.length) {
    return false;
  }
  return true;
}

/** Swaps the input field's value and the top stack value. */
function swap(): void {
  if (stack.value.length === 0) {
    return;
  }
  const temp = inputField.value;
  inputField.value = String(stack.value[stack.value.length - 1]);
  stack.value[stack.value.length - 1] = temp;
}

/** Adds input field to the BOTTOM of the stack, and replaces it with the value at the TOP of the stack. */
function roll(): void {
  if (stack.value.length >= 1) {
    stack.value.unshift(inputField.value);
    inputField.value = stack.value.pop() as string;
  }
}

/** Computes X percent of the top of the stack. */
function percent(): void {
  // Note this is a binary operation, but it doesn't affect the stack like the other binary operations.
  // That's why this function is separated from useMathOperation above.
  if (stack.value.length === 0) {
    return;
  }
  const percentage = Number(inputField.value) / 100;
  const topOfStack = Number(stack.value[stack.value.length - 1]);
  const result = capSigFigs(percentage * topOfStack);
  inputField.value = String(result);
}

/** Clears the stack, the input field, and memory i.e. clears everything. */
function allClear(): void {
  stack.value = [];
  inputField.value = "0";
  memoryClear();
}

/** Implements CE button by clearing all or part of the input field, depending on certain conditions. */
function clearEntry(): void {
  if (inputField.value === "0") {
    return;
  }
  if (
    inputField.value.length === 1 ||
    inputField.value === "Infinity" ||
    inputField.value === "NaN" ||
    inputField.value.includes("e+") ||
    inputField.value.includes("e-")
  ) {
    inputField.value = "0";
    return;
  }
  inputField.value = inputField.value.slice(0, -1);
}

/** Drops the input field, pops the stack, and uses that value as the replacement. */
function drop(): void {
  if (stack.value.length === 0) {
    inputField.value = "0";
  } else {
    inputField.value = String(stack.value.pop());
  }
}

/**
 * Performs binary mathematical operations.
 * @param opcode - Which op to perform. Must be one of: add, sub, mul, div
 */
function binaryOperation(opcode: string): void {
  // If we don't have a second operand, do nothing.
  if (stack.value.length === 0) {
    return;
  }
  const operands = [Number(inputField.value), Number(stack.value.pop())];
  let result: number;
  switch (opcode) {
    case "add":
      result = operands[1] + operands[0];
      break;
    case "subtract":
      result = operands[1] - operands[0];
      break;
    case "multiply":
      result = operands[1] * operands[0];
      break;
    case "divide":
      result = operands[1] / operands[0];
      break;
    case "modulus":
      result = operands[1] % operands[0];
      break;
    case "logBaseY":
      result = Math.log(operands[0]) / Math.log(operands[1]);
      break;
    case "powerOfY":
      result = operands[1] ** operands[0];
      break;
    case "xRootY":
      result = operands[1] ** (1 / operands[0]);
      break;
    case "percentDiff":
      result = ((operands[0] - operands[1]) / operands[1]) * 100;
      break;
    default:
      result = NaN;
      break;
  }
  // Cap maximum precision, while also circumventing rounding errors from floating point math.
  const newValue = String(capSigFigs(result));
  inputField.value = newValue;
}

/**
 * Performs unary mathematical operations.
 * @param opcode - Which op to perform. Must be one of: factorial
 */
function unaryOperation(opcode: string): void {
  const operand = Number(inputField.value);
  let result: number;
  switch (opcode) {
    case "factorial": {
      if (operand < 0) {
        result = NaN;
      } else {
        /**
         * Compute very close approximation + round if operand is integer.
         * O(1) and supports floating points (not just integers).
         * See: https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
         * Compute Gergo Nemes' 2007 factorial approximation (first function listed, not "equivalent" one).
         */
        const z = operand + 1;
        result =
          Math.sqrt((2 * Math.PI) / z) *
          Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
        if (Number.isInteger(operand)) {
          result = Math.round(result);
        }
      }
      break;
    }
    case "negate": {
      result = -operand;
      break;
    }
    case "logBase10": {
      result = Math.log10(operand);
      break;
    }
    case "naturalLog": {
      result = Math.log(operand);
      break;
    }
    case "logBase2": {
      result = Math.log2(operand);
      break;
    }
    case "square": {
      result = operand ** 2;
      break;
    }
    case "powerOf10": {
      result = 10 ** operand;
      break;
    }
    case "powerOfE": {
      result = Math.E ** operand;
      break;
    }
    case "powerOf2": {
      result = 2 ** operand;
      break;
    }
    case "sqrt": {
      result = Math.sqrt(operand);
      break;
    }
    case "sin": {
      result = usingRadians.value
        ? Math.sin(operand)
        : Math.sin(operand * (Math.PI / 180));
      break;
    }
    case "cos": {
      result = usingRadians.value
        ? Math.cos(operand)
        : Math.cos(operand * (Math.PI / 180));
      break;
    }
    case "tan": {
      result = usingRadians.value
        ? Math.tan(operand)
        : Math.tan(operand * (Math.PI / 180));
      break;
    }
    case "asin": {
      result = usingRadians.value
        ? Math.asin(operand)
        : Math.asin(operand) * (180 / Math.PI);
      break;
    }
    case "acos": {
      result = usingRadians.value
        ? Math.acos(operand)
        : Math.acos(operand) * (180 / Math.PI);
      break;
    }
    case "atan": {
      result = usingRadians.value
        ? Math.atan(operand)
        : Math.atan(operand) * (180 / Math.PI);
      break;
    }
    case "invert": {
      result = 1 / operand;
      break;
    }
    case "round": {
      // Implement banker's rounding i.e. round half towards even.
      const roundedHalfUp = Math.round(operand);
      const roundedHalfDown = -Math.round(-operand);
      if (roundedHalfUp === roundedHalfDown) {
        result = roundedHalfUp;
      } else if (roundedHalfUp % 2 === 0) {
        result = roundedHalfUp;
      } else {
        result = roundedHalfDown;
      }
      break;
    }
    default: {
      result = NaN;
      break;
    }
  }
  const newValue = String(capSigFigs(result));
  inputField.value = newValue;
}
</script>
