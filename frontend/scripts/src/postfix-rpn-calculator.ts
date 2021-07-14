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
      stack.value.push(inputField.value);
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

    return {
      stack,
      inputField,
      readyForOverwrite,
      addDigit,
      enter,
      hasIndex,
    };
  },
});

createApp(App).mount("main");
