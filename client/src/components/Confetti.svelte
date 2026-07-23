<script lang="ts">
  import { onMount } from 'svelte';

  let particles: { id: number; x: number; color: string; delay: number; duration: number }[] = [];

  onMount(() => {
    const colors = ['#a855f7', '#f59e0b', '#22c55e', '#06b6d4', '#ef4444', '#f472b6'];
    particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
    }));
  });
</script>

<div class="confetti-container">
  {#each particles as p (p.id)}
    <div
      class="confetti-piece"
      style="
        left: {p.x}%;
        background: {p.color};
        animation-delay: {p.delay}s;
        animation-duration: {p.duration}s;
      "
    ></div>
  {/each}
</div>

<style>
  .confetti-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 200;
    overflow: hidden;
  }

  .confetti-piece {
    position: absolute;
    top: -10px;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    animation: confetti-fall linear forwards;
  }

  .confetti-piece:nth-child(odd) {
    width: 8px;
    height: 14px;
    border-radius: 50%;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
</style>
