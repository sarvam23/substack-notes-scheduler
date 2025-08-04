// Optional Background Script for Simple Substack Notes Blocker
// This adds keyboard shortcuts and better tab management

class SimpleBackgroundService {
  constructor() {
    this.init();
  }

  init() {
    // Handle keyboard shortcuts (if you want this feature)
    chrome.commands.onCommand.addListener((command) => {
      this.handleCommand(command);
    });

    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstall(details);
    });

    // Handle tab updates (ensures extension works on newly loaded pages)
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });
  }

  async handleCommand(command) {
    if (command === 'toggle-notes') {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.url && tab.url.includes('substack.com')) {
        // Toggle the current state
        const result = await chrome.storage.sync.get(['notesBlocked']);
        const currentState = result.notesBlocked !== false;
        const newState = !currentState;
        
        // Save new state
        await chrome.storage.sync.set({ notesBlocked: newState });
        
        // Send message to content script
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'toggleNotes',
            enabled: newState
          });
          
          // Show notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Substack Notes Blocker',
            message: newState ? 'Notes hidden' : 'Notes visible'
          });
        } catch (error) {
          console.log('Could not communicate with tab:', error);
        }
      }
    }
  }

  async handleInstall(details) {
    if (details.reason === 'install') {
      // Set default settings for new installs
      await chrome.storage.sync.set({
        notesBlocked: true, // Default to enabled
        installDate: Date.now()
      });
      
      // Show welcome notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Substack Notes Blocker Installed!',
        message: 'Visit any Substack page and click the extension icon to get started.'
      });
    } else if (details.reason === 'update') {
      // Handle updates if needed
      console.log('Extension updated to version:', chrome.runtime.getManifest().version);
    }
  }

  async handleTabUpdate(tabId, changeInfo, tab) {
    // Only act on completed page loads on Substack sites
    if (changeInfo.status === 'complete' && 
        tab.url && 
        tab.url.includes('substack.com')) {
      
      // Small delay to ensure content script is ready
      setTimeout(async () => {
        try {
          // Get current settings
          const result = await chrome.storage.sync.get(['notesBlocked']);
          const isBlocked = result.notesBlocked !== false;
          
          // Send current state to content script
          chrome.tabs.sendMessage(tabId, {
            action: 'toggleNotes',
            enabled: isBlocked
          });
        } catch (error) {
          // Content script might not be ready yet, that's okay
          console.log('Content script not ready on tab update:', error);
        }
      }, 500);
    }
  }
}

// Initialize the background service
new SimpleBackgroundService();