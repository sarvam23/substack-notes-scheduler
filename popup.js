// Simple Popup Script for Substack Notes Blocker
document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = document.getElementById('notesToggle');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const refreshNotice = document.getElementById('refreshNotice');
  const supportLink = document.getElementById('supportLink');
  const rateLink = document.getElementById('rateLink');
  
  let isEnabled = true;
  let isLoading = false;
  
  // Load current state
  await loadCurrentState();
  
  // Set up event listeners
  toggleSwitch.addEventListener('click', handleToggleClick);
  supportLink.addEventListener('click', openSupport);
  rateLink.addEventListener('click', openRating);
  
  async function loadCurrentState() {
    try {
      // Get stored setting
      const result = await chrome.storage.sync.get(['notesBlocked']);
      isEnabled = result.notesBlocked !== false; // Default to true
      
      // Try to get current status from active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.url && tab.url.includes('substack.com')) {
        try {
          const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
          if (response && typeof response.enabled === 'boolean') {
            isEnabled = response.enabled;
          }
        } catch (error) {
          // Content script might not be ready, use stored value
          console.log('Content script not ready, using stored value');
        }
      }
      
      updateUI();
    } catch (error) {
      console.error('Error loading state:', error);
      updateUI();
    }
  }
  
  async function handleToggleClick() {
    if (isLoading) return;
    
    setLoading(true);
    
    try {
      // Toggle state
      isEnabled = !isEnabled;
      
      // Save to storage
      await chrome.storage.sync.set({ notesBlocked: isEnabled });
      
      // Update UI immediately
      updateUI();
      
      // Send message to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.url && tab.url.includes('substack.com')) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'toggleNotes',
            enabled: isEnabled
          });
          
          // Show refresh notice for a moment
          showRefreshNotice();
        } catch (error) {
          console.log('Could not communicate with tab, extension will work on page refresh');
          showRefreshNotice(true);
        }
      } else {
        // Not on Substack page
        console.log('Settings saved, will apply when visiting Substack');
      }
      
    } catch (error) {
      console.error('Error toggling notes:', error);
      // Revert state on error
      isEnabled = !isEnabled;
      updateUI();
    } finally {
      setLoading(false);
    }
  }
  
  function updateUI() {
    // Update toggle switch
    toggleSwitch.classList.toggle('active', isEnabled);
    
    // Update status indicator
    if (isEnabled) {
      statusIndicator.className = 'status-indicator enabled';
      statusText.textContent = 'Notes are hidden';
    } else {
      statusIndicator.className = 'status-indicator disabled';
      statusText.textContent = 'Notes are visible';
    }
  }
  
  function setLoading(loading) {
    isLoading = loading;
    document.body.classList.toggle('loading', loading);
  }
  
  function showRefreshNotice(persistent = false) {
    refreshNotice.style.display = 'block';
    
    if (!persistent) {
      setTimeout(() => {
        refreshNotice.style.display = 'none';
      }, 3000);
    }
  }
  
  function openSupport(e) {
    e.preventDefault();
    chrome.tabs.create({
      url: 'mailto:support@example.com?subject=Substack Notes Blocker Support'
    });
    window.close();
  }
  
  function openRating(e) {
    e.preventDefault();
    // This will be the actual Chrome Web Store URL after publishing
    chrome.tabs.create({
      url: 'https://chrome.google.com/webstore/detail/substack-notes-blocker/YOUR_EXTENSION_ID'
    });
    window.close();
  }
  
  // Handle keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.close();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleClick();
    }
  });
  
  // Check if we're on a Substack page and show appropriate message
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && !currentTab.url.includes('substack.com')) {
      const infoSection = document.querySelector('.info-section .info-text');
      if (infoSection) {
        infoSection.innerHTML = 'Visit any Substack page to see the extension in action. Settings are saved and will apply automatically.';
      }
    }
  });
});