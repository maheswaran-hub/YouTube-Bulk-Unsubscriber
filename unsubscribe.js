(async function () {
  const UNSUBSCRIBE_DELAY = 2000; // safer delay

  // Wait helper
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Auto-scroll to load all channels
  async function autoScroll() {
    let lastHeight = 0;
    while (true) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await wait(1500);
      let newHeight = document.documentElement.scrollHeight;
      if (newHeight === lastHeight) break; // stop when no new channels load
      lastHeight = newHeight;
    }
  }

  // Get all channel elements
  function getChannels() {
    return Array.from(document.querySelectorAll('ytd-channel-renderer'));
  }

  // Unsubscribe from one channel
  async function unsubscribeChannel(channel, delay) {
    try {
      const btn = channel.querySelector('ytd-subscribe-button-renderer button');
      if (btn) {
        btn.click();
        await wait(delay);

        const confirm = document.querySelector('yt-confirm-dialog-renderer #confirm-button button');
        if (confirm) {
          confirm.click();
          await wait(delay);

          const title = channel.querySelector('#channel-title')?.innerText || "Unknown channel";
          console.log(`✅ Unsubscribed from: ${title}`);
        }
      }
    } catch (err) {
      console.error("❌ Error unsubscribing:", err);
    }
  }

  // Main function
  async function unsubscribeAllChannels() {
    console.log("📜 Scrolling to load all channels...");
    await autoScroll();

    const channels = getChannels();
    console.log(`🔍 Found ${channels.length} channels.`);

    for (const channel of channels) {
      await unsubscribeChannel(channel, UNSUBSCRIBE_DELAY);
    }

    console.log("🎉 Unsubscription process completed!");
  }

  // Run it
  await unsubscribeAllChannels();
})();
