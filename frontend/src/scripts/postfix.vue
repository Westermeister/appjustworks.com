<!--
  Vue SFC for: Postfix (RPN) Calculator | App Just Works (https://appjustworks.com/apps/postfix-rpn-calculator)
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
    <div v-if="hasIndex(stack.length - 1)" id="row-1">
      {{ stack[stack.length - 1] }}
    </div>
    <div v-else id="row-1">&nbsp;</div>
    <div id="input-field">{{ inputField }}</div>
  </div>
  <div class="row g-1">
    <!-- Radian/degree toggle, percent and percent diff ops, inverse op, and rounding function -->

    <div class="col-2">
      <button
        type="button"
        id="rad"
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
        type="button"
        id="deg"
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
        type="button"
        id="percent"
        class="calc-btn-generic"
        @click="percent"
      >
        %
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="percentDiff"
        class="calc-btn-generic"
        @click="binaryOperation('percentDiff')"
      >
        &#x25B3;%
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="invert"
        class="calc-btn-generic"
        @click="unaryOperation('invert')"
      >
        1/x
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="round"
        class="calc-btn-generic"
        @click="unaryOperation('round')"
      >
        round
      </button>
    </div>

    <!-- Trig functions -->

    <div class="col-2">
      <button
        type="button"
        id="sin"
        class="calc-btn-generic"
        @click="unaryOperation('sin')"
      >
        sin
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="cos"
        class="calc-btn-generic"
        @click="unaryOperation('cos')"
      >
        cos
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="tan"
        class="calc-btn-generic"
        @click="unaryOperation('tan')"
      >
        tan
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="asin"
        class="calc-btn-generic"
        @click="unaryOperation('asin')"
      >
        asin
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="acos"
        class="calc-btn-generic"
        @click="unaryOperation('acos')"
      >
        acos
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="atan"
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
        type="button"
        id="powerOf10"
        class="calc-btn-generic"
        @click="unaryOperation('powerOf10')"
      >
        <sub>10</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="powerOfE"
        class="calc-btn-generic"
        @click="unaryOperation('powerOfE')"
      >
        <sub>e</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="powerOf2"
        class="calc-btn-generic"
        @click="unaryOperation('powerOf2')"
      >
        <sub>2</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="powerOfY"
        class="calc-btn-generic"
        @click="binaryOperation('powerOfY')"
      >
        <sub>y</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="sqrt"
        class="calc-btn-generic"
        @click="unaryOperation('sqrt')"
      >
        &#x221A;x
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="xRootY"
        class="calc-btn-generic"
        @click="binaryOperation('xRootY')"
      >
        <small>x</small><sub>&#x221A;y</sub>
      </button>
    </div>

    <!-- More exponents, logarithms, and pi -->

    <div class="col-2">
      <button
        type="button"
        id="logBase10"
        class="calc-btn-generic"
        @click="unaryOperation('logBase10')"
      >
        log<sub>10</sub>
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="naturalLog"
        class="calc-btn-generic"
        @click="unaryOperation('naturalLog')"
      >
        ln
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="logBase2"
        class="calc-btn-generic"
        @click="unaryOperation('logBase2')"
      >
        log<sub>2</sub>
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="logBaseY"
        class="calc-btn-generic"
        @click="binaryOperation('logBaseY')"
      >
        log<sub>y</sub>x
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="square"
        class="calc-btn-generic"
        @click="unaryOperation('square')"
      >
        <sub>X</sub><small>2</small>
      </button>
    </div>
    <div class="col-2">
      <button type="button" id="pi" class="calc-btn-generic" @click="pi">
        &#x3C0;
      </button>
    </div>

    <!-- Operations incl. factorial, positive/negative, swap, roll, modulus, and e constant -->

    <div class="col-2">
      <button
        type="button"
        id="factorial"
        class="calc-btn-generic"
        @click="unaryOperation('factorial')"
      >
        x!
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="negate"
        class="calc-btn-generic"
        @click="unaryOperation('negate')"
      >
        +/-
      </button>
    </div>
    <div class="col-2">
      <button type="button" id="swap" class="calc-btn-generic" @click="swap">
        swap
      </button>
    </div>
    <div class="col-2">
      <button type="button" id="roll" class="calc-btn-generic" @click="roll">
        roll
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="mod"
        class="calc-btn-generic"
        @click="binaryOperation('modulus')"
      >
        mod
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="e"
        class="calc-btn-generic"
        @click="eulersNumber"
      >
        e
      </button>
    </div>

    <!-- Top numerical row: includes AC, memory add, numbers, and division -->

    <div class="col-2">
      <button type="button" id="AC" class="calc-btn-generic" @click="allClear">
        AC
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="m-add"
        class="calc-btn-generic"
        @click="memoryAdd"
      >
        m+
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num7"
        class="calc-btn-num"
        @click="addDigit('7')"
      >
        7
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num8"
        class="calc-btn-num"
        @click="addDigit('8')"
      >
        8
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num9"
        class="calc-btn-num"
        @click="addDigit('9')"
      >
        9
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="divide"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('divide')"
      >
        &#xF7;
      </button>
    </div>

    <!-- Includes memory clear, memory subtract, numbers, and multiplication -->

    <div class="col-2">
      <button
        type="button"
        id="MC"
        class="calc-btn-generic"
        @click="memoryClear"
      >
        MC
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="m-"
        class="calc-btn-generic"
        @click="memorySubtract"
      >
        m-
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num4"
        class="calc-btn-num"
        @click="addDigit('4')"
      >
        4
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num5"
        class="calc-btn-num"
        @click="addDigit('5')"
      >
        5
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num6"
        class="calc-btn-num"
        @click="addDigit('6')"
      >
        6
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="multiply"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('multiply')"
      >
        &#xD7;
      </button>
    </div>

    <!-- Second to last row: includes CE, memory input, numbers, and subtraction -->

    <div class="col-2">
      <button
        type="button"
        id="CE"
        class="calc-btn-generic"
        @click="clearEntry"
      >
        CE
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="m-in"
        class="calc-btn-generic"
        @click="memoryInput"
      >
        m in
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num1"
        class="calc-btn-num"
        @click="addDigit('1')"
      >
        1
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num2"
        class="calc-btn-num"
        @click="addDigit('2')"
      >
        2
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num3"
        class="calc-btn-num"
        @click="addDigit('3')"
      >
        3
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="subtract"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('subtract')"
      >
        &#x2212;
      </button>
    </div>

    <!-- Final row: includes drop, memory recall, 0, decimal point, enter, and addition -->

    <div class="col-2">
      <button type="button" id="drop" class="calc-btn-generic" @click="drop">
        drop
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="m-re"
        class="calc-btn-generic"
        @click="memoryRecall"
      >
        m re
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="num0"
        class="calc-btn-num"
        @click="addDigit('0')"
      >
        0
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="decimal"
        class="calc-btn-num fw-bold"
        @click="addDigit('.')"
      >
        .
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="enter"
        class="calc-btn-highlight"
        @click="enter"
      >
        enter
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        id="add"
        class="calc-btn-highlight fw-bold"
        @click="binaryOperation('add')"
      >
        &#x2B;
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";

/**
 * Caps the maximum number of significant figures in a number.
 * @param value - The value to cap.
 * @returns The value but capped at 15 significant figures or fewer.
 */
function capSigFigs(value: number): number {
  return Number(value.toPrecision(15));
}

/**
 * Responsible for all mathematical operations (excluding memory add/subtract, and percentage).
 * @param inputField - Reference to a stringified number that represents the value of the calculator's input field.
 * @param stack - Reference to the calculator's stack.
 * @param usingRadians - Reference to a boolean telling whether calculator is in radians or degrees mode.
 * @returns Methods for unary and binary mathematical operations.
 */
function useMathOperation(
  inputField: Ref<string>,
  stack: Ref<string[]>,
  usingRadians: Ref<boolean>
) {
  /**
   * Performs unary mathematical operations.
   * @param opcode - Which op to perform. Must be one of: factorial
   */
  const unaryOperation = (opcode: string): void => {
    const operand = Number(inputField.value);
    let result: number;
    switch (opcode) {
      case "factorial":
        if (operand < 0) {
          result = NaN;
        } else {
          // Compute very close approximation + round if operand is integer.
          // O(1) and supports floating points (not just integers).
          const z = operand + 1;
          result =
            Math.sqrt((2 * Math.PI) / z) *
            Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
          if (Number.isInteger(operand)) {
            result = Math.round(result);
          }
        }
        break;
      case "negate":
        result = -operand;
        break;
      case "logBase10":
        result = Math.log10(operand);
        break;
      case "naturalLog":
        result = Math.log(operand);
        break;
      case "logBase2":
        result = Math.log2(operand);
        break;
      case "square":
        result = operand ** 2;
        break;
      case "powerOf10":
        result = 10 ** operand;
        break;
      case "powerOfE":
        result = Math.E ** operand;
        break;
      case "powerOf2":
        result = 2 ** operand;
        break;
      case "sqrt":
        result = Math.sqrt(operand);
        break;
      case "sin":
        result = usingRadians.value
          ? Math.sin(operand)
          : Math.sin(operand * (Math.PI / 180));
        break;
      case "cos":
        result = usingRadians.value
          ? Math.cos(operand)
          : Math.cos(operand * (Math.PI / 180));
        break;
      case "tan":
        result = usingRadians.value
          ? Math.tan(operand)
          : Math.tan(operand * (Math.PI / 180));
        break;
      case "asin":
        result = usingRadians.value
          ? Math.asin(operand)
          : Math.asin(operand) * (180 / Math.PI);
        break;
      case "acos":
        result = usingRadians.value
          ? Math.acos(operand)
          : Math.acos(operand) * (180 / Math.PI);
        break;
      case "atan":
        result = usingRadians.value
          ? Math.atan(operand)
          : Math.atan(operand) * (180 / Math.PI);
        break;
      case "invert":
        result = 1 / operand;
        break;
      case "round":
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
      default:
        result = NaN;
        break;
    }
    const newValue = String(capSigFigs(result));
    inputField.value = newValue;
  };

  /**
   * Performs binary mathematical operations.
   * @param opcode - Which op to perform. Must be one of: add, sub, mul, div
   */
  const binaryOperation = (opcode: string): void => {
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
  };

  return {
    unaryOperation,
    binaryOperation,
  };
}

/**
 * Provides mathematical constants.
 * @param inputField - Reference to a stringified number that represents the value of the calculator's input field.
 * @returns Methods that replace the input field with the corresponding constant.
 */
function useConstant(inputField: Ref<string>) {
  /** Replaces input with Euler's number. */
  const eulersNumber = (): void => {
    inputField.value = String(capSigFigs(Math.E));
  };

  /** Replaces input with pi. */
  const pi = (): void => {
    inputField.value = String(capSigFigs(Math.PI));
  };

  return {
    eulersNumber,
    pi,
  };
}

/**
 * Responsible for all memory buttons i.e. input, add, subtract, recall, and clearing.
 * @param inputField - Reference to a stringified number that represents the value of the calculator's input field.
 * @returns Memory utilities for accessing and manipulating memory.
 */
function useMemory(inputField: Ref<string>): {
  memoryInput: () => void;
  memoryRecall: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryClear: () => void;
} {
  const memoryValue = ref(0);

  /** Stores input into memory. */
  const memoryInput = (): void => {
    memoryValue.value = Number(inputField.value);
  };

  /** Returns the value from memory, overwriting the input field. */
  const memoryRecall = (): void => {
    inputField.value = String(memoryValue.value);
  };

  /** Add input to memory. */
  const memoryAdd = (): void => {
    memoryValue.value = capSigFigs(
      memoryValue.value + Number(inputField.value)
    );
  };

  /** Subtract input from memory. */
  const memorySubtract = (): void => {
    memoryValue.value = capSigFigs(
      memoryValue.value - Number(inputField.value)
    );
  };

  /** Clear the value from memory. */
  const memoryClear = (): void => {
    memoryValue.value = 0;
  };

  return {
    memoryInput,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryClear,
  };
}

const App = defineComponent({
  setup() {
    // Holds calculator state.
    const stack = ref([] as string[]);
    // Holds the state of the input field.
    const inputField = ref("0");
    // Enables completely overwriting the entry row.
    // Activates after pressing enter, then immediately deactivates.
    const readyForOverwrite = ref(false);
    // Controls whether the calculator is in radians or degrees mode.
    const usingRadians = ref(true);

    /**
     * Adds a digit to the input field.
     * @param digit - The digit to add. Can be a decimal point as well.
     */
    const addDigit = (digit: string): void => {
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
    };

    /** Enters a number onto the stack. */
    const enter = (): void => {
      // Cap maximum precision (but allow less precision).
      const toAdd = capSigFigs(Number(inputField.value));
      stack.value.push(String(toAdd));
      readyForOverwrite.value = true;
    };

    /**
     * Tells whether the stack has an index or not.
     * @param index - Stack index to check.
     * @returns Whether the given index exists in the stack.
     */
    const hasIndex = (index: number): boolean => {
      if (
        stack.value.length === 0 ||
        index < 0 ||
        index >= stack.value.length
      ) {
        return false;
      }
      return true;
    };

    /** Swaps the input field's value and the top stack value. */
    const swap = (): void => {
      if (stack.value.length === 0) {
        return;
      }
      const temp = inputField.value;
      inputField.value = String(stack.value[stack.value.length - 1]);
      stack.value[stack.value.length - 1] = temp;
    };

    /** Adds input field to the BOTTOM of the stack, and replaces it with the value at the TOP of the stack. */
    const roll = (): void => {
      if (stack.value.length >= 1) {
        stack.value.unshift(inputField.value);
        inputField.value = stack.value.pop() as string;
      }
    };

    const { unaryOperation, binaryOperation } = useMathOperation(
      inputField,
      stack,
      usingRadians
    );

    /** Computes X percent of the top of the stack. */
    const percent = (): void => {
      // Note this is a binary operation, but it doesn't affect the stack like the other binary operations.
      // That's why this function is separated from useMathOperation above.
      if (stack.value.length === 0) {
        return;
      }
      const percentage = Number(inputField.value) / 100;
      const topOfStack = Number(stack.value[stack.value.length - 1]);
      const result = capSigFigs(percentage * topOfStack);
      inputField.value = String(result);
    };

    const { eulersNumber, pi } = useConstant(inputField);

    const {
      memoryInput,
      memoryRecall,
      memoryAdd,
      memorySubtract,
      memoryClear,
    } = useMemory(inputField);

    /** Clears the stack, the input field, and memory i.e. clears everything. */
    const allClear = (): void => {
      stack.value = [];
      inputField.value = "0";
      memoryClear();
    };

    /** Implements CE button by clearing all or part of the input field, depending on certain conditions. */
    const clearEntry = (): void => {
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
    };

    /** Drops the input field, pops the stack, and uses that value as the replacement. */
    const drop = (): void => {
      if (stack.value.length === 0) {
        inputField.value = "0";
      } else {
        inputField.value = String(stack.value.pop());
      }
    };

    return {
      stack,
      inputField,
      usingRadians,
      addDigit,
      enter,
      hasIndex,
      unaryOperation,
      binaryOperation,
      eulersNumber,
      pi,
      percent,
      swap,
      roll,
      memoryInput,
      memoryRecall,
      memoryAdd,
      memorySubtract,
      memoryClear,
      allClear,
      clearEntry,
      drop,
    };
  },
});

export default App;
</script>
