<!--
  Vue SFC for: Age Calculator | App Just Works
  Copyright (c) 2021 Westermeister. All rights reserved.
-->

<template>
  <form class="mb-4">
    <div class="mb-3">
      <p>Enter your birthday</p>
      <input id="birthday-input" v-model="birthday" type="date" />
    </div>
    <div class="mb-3">
      <p>Enter a future date (default: today)</p>
      <input id="future-input" v-model="future" type="date" />
    </div>
    <button
      id="compute-age"
      type="button"
      class="btn btn-primary"
      @click="renderAge()"
    >
      Submit
    </button>
  </form>
  <div
    v-if="ageOutput.startsWith('Error')"
    id="calculator-output"
    class="text-danger"
  >
    {{ ageOutput }}
  </div>
  <div v-else-if="ageOutput.length > 0">
    <span class="fw-bold">Age:&nbsp;</span>
    <span id="calculator-output">{{ ageOutput }}</span>
  </div>
  <div v-else></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DateTime } from "luxon";

const birthday = ref("");
const future = ref(DateTime.now().toISODate());
const ageOutput = ref("");

/**
 * Compute the year/month/day difference between two dates.
 * @param pastDate - The earlier date as YYYY-MM-DD.
 * @param futureDate - The later date as YYYY-MM-DD.
 * @returns Object with differences for years, then remaining months, then remaining days.
 */
function computeDateDiff(
  pastDate: string,
  futureDate: string
): { yearDiff: number; monthDiff: number; dayDiff: number } {
  let dayCount = 0;
  let monthCount = 0;
  let yearCount = 0;
  let iterator = DateTime.fromISO(pastDate);
  const initial = DateTime.fromISO(pastDate);
  const final = DateTime.fromISO(futureDate);
  while (
    iterator.year < final.year ||
    iterator.month < final.month ||
    iterator.day < final.day
  ) {
    iterator = iterator.plus({ days: 1 });
    ++dayCount;
    // Fancy logic for handling leap years.
    if (
      iterator.day === initial.day ||
      (iterator.month === 3 &&
        iterator.day === 1 &&
        initial.month === 2 &&
        initial.day === 29)
    ) {
      if (
        iterator.month === 3 &&
        iterator.day === 1 &&
        initial.month === 2 &&
        initial.day === 29
      ) {
        dayCount = 1;
        if (iterator.year !== initial.year) {
          ++monthCount;
        }
      } else {
        dayCount = 0;
        ++monthCount;
      }
      if (monthCount === 12) {
        monthCount = 0;
        ++yearCount;
      }
    }
  }
  return {
    yearDiff: yearCount,
    monthDiff: monthCount,
    dayDiff: dayCount,
  };
}

/** Renders the computed age in the template. */
function renderAge() {
  if (DateTime.fromISO(birthday.value) > DateTime.fromISO(future.value)) {
    ageOutput.value =
      "Error: The birthday value has to be earlier than the future value!";
    return;
  }
  const result = computeDateDiff(birthday.value, future.value);
  ageOutput.value = `${result.yearDiff} year(s), ${result.monthDiff} month(s), ${result.dayDiff} day(s)`;
}
</script>
