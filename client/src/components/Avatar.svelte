<script lang="ts">
  import { getAvatarById } from '../lib/avatars';

  export let avatarId: string;
  export let size: string = '32px';

  $: avatar = getAvatarById(avatarId);
</script>

<div class="avatar-icon" style="width: {size}; height: {size}; border-color: {avatar.color}">
  {@html avatar.svg}
</div>

<style>
  .avatar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 2px solid;
    background: rgba(0, 0, 0, 0.4);
    padding: 2px;
    flex-shrink: 0;
  }

  .avatar-icon :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
