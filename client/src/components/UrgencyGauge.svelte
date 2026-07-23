<script lang="ts">
  import type { UrgencyLevel } from '../shared';
  export let level: UrgencyLevel = 'low';

  $: width = level === 'low' ? '33%' : level === 'medium' ? '66%' : '100%';
</script>

<div class="gauge-wrapper">
  <div class="gauge urgency-{level}" style="width: {width}"></div>
</div>

<style>
  .gauge-wrapper {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .gauge {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease, background-color 0.5s ease;
  }

  .gauge.urgency-low {
    background: #4ade80;
  }

  .gauge.urgency-medium {
    background: #fb923c;
  }

  .gauge.urgency-high {
    background: #ef4444;
    animation: pulse-red 0.3s infinite alternate;
  }

  @keyframes pulse-red {
    0% { opacity: 0.8; }
    100% { opacity: 1; }
  }
</style>
