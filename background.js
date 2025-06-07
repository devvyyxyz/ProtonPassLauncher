const protonPassUrl = "https://pass.proton.me/";

async function openOrSwitchToProtonPass() {
  try {
    const tabs = await browser.tabs.query({});

    for (const tab of tabs) {
      if (tab.url && tab.url.includes(protonPassUrl)) {
        // Switch to the ProtonPass tab if found
        await browser.tabs.update(tab.id, { active: true });
        return;
      }
    }

    // Open a new ProtonPass tab if none found
    browser.tabs.create({ url: protonPassUrl });
  } catch (error) {
    console.error("Error in openOrSwitchToProtonPass:", error);
  }
}

browser.browserAction.onClicked.addListener(openOrSwitchToProtonPass);

// Add a context menu item
browser.contextMenus.create({
  id: "open-protonPass",
  title: "Open ProtonPass",
  contexts: ["browser_action"]
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "open-protonPass") {
    openOrSwitchToProtonPass();
  }
});

// Show a notification when the extension is installed
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icon128.png"),
      "title": "ProtonPass Launcher Installed",
      "message": "To pin the icon, click the puzzle piece, right-click 'ProtonPass Launcher', and select 'Pin to Toolbar'."
    });
  }
});