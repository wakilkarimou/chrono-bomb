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
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    overflow: hidden;
  }

  .gauge {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
  }

  .gauge.urgency-low {
    background: linear-gradient(90deg, #00e676, #69f0ae);
    box-shadow: 0 0 8px rgba(0, 230, 118, 0.4);
  }

  .gauge.urgency-medium {
    background: linear-gradient(90deg, #ff9100, #ffab40);
    box-shadow: 0 0 12px rgba(255, 145, 0, 0.5);
  }

  .gauge.urgency-high {
    background: linear-gradient(90deg, #ff0040, #ff5252);
    box-shadow: 0 0 16px rgba(255, 0, 64, 0.6);
    animation: gauge-pulse 0.25s infinite alternate;
  }

  @keyframes gauge-pulse {
    0% { box-shadow: 0 0 16px rgba(255, 0, 64, 0.6); }
    100% { box-shadow: 0 0 24px rgba(255, 0, 64, 0.9); }
  }
</style>
