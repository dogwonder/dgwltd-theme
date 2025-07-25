<?php 
//Based on Cally https://wicky.nillia.ms/cally/
?>

<div class="card cluster">
  <calendar-range months="2">
    <svg
      aria-label="Previous"
      slot="previous"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
    </svg>
    <svg
      aria-label="Next"
      slot="next"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
    </svg>
    <div class="grid">
      <calendar-month></calendar-month>
      <calendar-month offset="1"></calendar-month>
    </div>
  </calendar-range>
</div>