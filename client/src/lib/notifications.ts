// Browser notifications for when the user isn't looking at the tab

let permissionGranted = false;

export function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    permissionGranted = true;
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(p => {
      permissionGranted = p === 'granted';
    });
  }
}

export function notifyMyTurn() {
  if (!permissionGranted) return;
  if (document.hasFocus()) return; // Don't notify if tab is focused

  try {
    new Notification('💣 Chrono-Bomb', {
      body: "C'est ton tour ! La bombe est chez toi !",
      icon: '💣',
      tag: 'chrono-bomb-turn', // replaces previous notification
    });
  } catch {
    // Notification API not available
  }
}
