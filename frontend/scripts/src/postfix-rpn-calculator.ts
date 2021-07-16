/**
 * Script for: Postfix (RPN) Calculator | App Just Works (https://appjustworks.com/apps/postfix-rpn-calculator)
 * Copyright (C) 2021 Westermeister. All rights reserved.
 */

import { createApp, defineComponent, ref, Ref } from "vue";

/**
 * Caps the maximum number of significant figures in a number.
 * @param value - The value to cap.
 * @returns The value but capped at 15 significant figures or fewer.
 */
function capSigFigs(value: number): number {
  return Number(value.toPrecision(15));
}

/**
 * Responsible for all memory buttons i.e. input, add, subtract, recall, and clearing.
 * @param inputField - Reference to a stringified number that represents the value of the calculator's input field.
 * @returns Memory utilities for accessing and manipulating memory.
 */
function memory(inputField: Ref<string>): {
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
      if (inputField.value === "0") {
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

    /**
     * Performs binary operations.
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
        case "sub":
          result = operands[1] - operands[0];
          break;
        case "mul":
          result = operands[1] * operands[0];
          break;
        case "div":
          result = operands[1] / operands[0];
          break;
        default:
          result = NaN;
          break;
      }
      // Cap maximum precision, while also circumventing rounding errors from floating point math.
      const newValue = String(capSigFigs(result));
      inputField.value = newValue;
    };

    const {
      memoryInput,
      memoryRecall,
      memoryAdd,
      memorySubtract,
      memoryClear,
    } = memory(inputField);

    return {
      stack,
      inputField,
      readyForOverwrite,
      addDigit,
      enter,
      hasIndex,
      binaryOperation,
      memoryInput,
      memoryRecall,
      memoryAdd,
      memorySubtract,
      memoryClear,
    };
  },
});

createApp(App).mount("#app");
