<!--
  SFC for: Postfix (RPN) Calculator | App Just Works (https://appjustworks.com/apps/postfix-rpn-calculator)
  Copyright (C) 2021 Westermeister. All rights reserved.
-->

<template>
  <div id="display">
    <div v-if="hasIndex(stack.length - 3)">
      {{ stack[stack.length - 3] }}
    </div>
    <div v-else>&nbsp;</div>
    <div v-if="hasIndex(stack.length - 2)">
      {{ stack[stack.length - 2] }}
    </div>
    <div v-else>&nbsp;</div>
    <div v-if="hasIndex(stack.length - 1)">
      {{ stack[stack.length - 1] }}
    </div>
    <div v-else>&nbsp;</div>
    <div id="input-field">{{ inputField }}</div>
  </div>
  <div class="row g-1">
    <!-- Radian/degree toggle, percent and percent diff ops, inverse op, and rounding function -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic">rad</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">deg</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">%</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">&#x25B3;%</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">1/x</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">round</button>
    </div>

    <!-- Trig functions -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic">sin</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">cos</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">tan</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">asin</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">acos</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">atan</button>
    </div>

    <!-- Exponents and square roots -->
    <!-- Note the use of subscripts instead of superscripts b/c the former doesn't change the button's height. -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic">
        <sub>10</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">
        <sub>e</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">
        <sub>2</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">
        <sub>y</sub><small>x</small>
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">&#x221A;x</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">
        <small>x</small><sub>&#x221A;y</sub>
      </button>
    </div>

    <!-- More exponents, logarithms, and pi -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic">log<sub>10</sub></button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">ln</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">log<sub>2</sub></button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">log<sub>y</sub>x</button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">
        <sub>X</sub><small>2</small>
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">&#x3C0;</button>
    </div>

    <!-- Operations incl. factorial, positive/negative, swap, roll, modulus, and e constant -->

    <div class="col-2">
      <button
        type="button"
        class="calc-btn-generic"
        v-on:click="unaryOperation('factorial')"
      >
        x!
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-generic"
        v-on:click="unaryOperation('negate')"
      >
        +/-
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="swap">
        swap
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="roll">
        roll
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-generic"
        v-on:click="binaryOperation('modulus')"
      >
        mod
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic">e</button>
    </div>

    <!-- Top numerical row: includes AC, memory add, numbers, and division -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="allClear">
        AC
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="memoryAdd">
        m+
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('7')">
        7
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('8')">
        8
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('9')">
        9
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-highlight fw-bold"
        v-on:click="binaryOperation('divide')"
      >
        &#xF7;
      </button>
    </div>

    <!-- Includes memory clear, memory subtract, numbers, and multiplication -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="memoryClear">
        MC
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-generic"
        v-on:click="memorySubtract"
      >
        m-
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('4')">
        4
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('5')">
        5
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('6')">
        6
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-highlight fw-bold"
        v-on:click="binaryOperation('multiply')"
      >
        &#xD7;
      </button>
    </div>

    <!-- Second to last row: includes CE, memory input, numbers, and subtraction -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="clearEntry">
        CE
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="memoryInput">
        m in
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('1')">
        1
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('2')">
        2
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('3')">
        3
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-highlight fw-bold"
        v-on:click="binaryOperation('subtract')"
      >
        &#x2212;
      </button>
    </div>

    <!-- Final row: includes drop, memory recall, 0, decimal point, enter, and addition -->

    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="drop">
        drop
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-generic" v-on:click="memoryRecall">
        m re
      </button>
    </div>
    <div class="col-2">
      <button type="button" class="calc-btn-num" v-on:click="addDigit('0')">
        0
      </button>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-num fw-bold"
        v-on:click="addDigit('.')"
      >
        .
      </button>
    </div>
    <div class="col-2">
      <div class="calc-btn-highlight" v-on:click="enter">enter</div>
    </div>
    <div class="col-2">
      <button
        type="button"
        class="calc-btn-highlight fw-bold"
        v-on:click="binaryOperation('add')"
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
 * Responsible for all mathematical operations (excluding memory add/subtract).
 * @param inputField - Reference to a stringified number that represents the value of the calculator's input field.
 * @param stack - Reference to the calculator's stack.
 * @returns Methods for unary and binary mathematical operations.
 */
function useMathOperations(inputField: Ref<string>, stack: Ref<string[]>) {
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

    const { unaryOperation, binaryOperation } = useMathOperations(
      inputField,
      stack
    );

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
      addDigit,
      enter,
      hasIndex,
      unaryOperation,
      binaryOperation,
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
