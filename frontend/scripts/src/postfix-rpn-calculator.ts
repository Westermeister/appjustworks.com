/**
 * Script for: Postfix (RPN) Calculator | App Just Works (https://appjustworks.com/apps/postfix-rpn-calculator)
 * Copyright (C) 2021 Westermeister. All rights reserved.
 */

import { createApp, defineComponent, ref } from "vue";

const App = defineComponent({
  setup() {
    // Holds calculator state.
    const stack = ref([] as string[]);
    // Holds the state of the input field.
    const inputField = ref("0");
    // Enables completely overwriting the entry row.
    // Activates after pressing enter, then immediately deactivates.
    const readyForOverwrite = ref(false);
    // Cap result at this number of sig figs.
    // As a bonus, circumvents rounding errors from floating point math.
    const sigFigs = 15;

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
      const toAdd = Number(Number(inputField.value).toPrecision(sigFigs));
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
      const newValue = String(Number(result.toPrecision(sigFigs)));
      inputField.value = newValue;
    };

    return {
      stack,
      inputField,
      readyForOverwrite,
      addDigit,
      enter,
      hasIndex,
      binaryOperation,
    };
  },
});

createApp(App).mount("#app");
