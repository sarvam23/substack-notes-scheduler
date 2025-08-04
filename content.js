// Simple Substack Notes Blocker Content Script
class SubstackNotesBlocker {
  constructor() {
    this.isEnabled = true;
    this.init();
  }

  async init() {
    // Load saved state from Chrome storage
    const result = await chrome.storage.sync.get(['notesBlocked']);
    this.isEnabled = result.notesBlocked !== false; // Default to true
    
    // Apply blocking immediately
    this.toggleNotesBlocking();
    
    // Set up observer for dynamic content
    this.setupObserver();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'toggleNotes') {
        this.isEnabled = message.enabled;
        this.toggleNotesBlocking();
        sendResponse({ success: true });
      } else if (message.action === 'getStatus') {
        sendResponse({ enabled: this.isEnabled });
      }
    });
  }

  toggleNotesBlocking() {
    if (this.isEnabled) {
      this.hideNotes();
    } else {
      this.showNotes();
    }
  }

  hideNotes() {
    // Add the blocking class to body
    document.body.classList.add('substack-notes-blocked');
    
    // Hide various Notes-related elements
    this.hideElementsBySelector([
      // Main Notes feed and navigation
      '[data-testid="notes-tab"]',
      '[href*="/notes"]',
      'a[href$="/notes"]',
      'a[href*="/notes?"]',
      
      // Notes sections in feeds
      '[class*="notes"]',
      '[class*="Notes"]',
      
      // Activity feed items that are Notes
      '[data-testid*="note"]',
      'article[data-testid*="note"]',
      
      // Notes posts in main feed
      '[class*="note-post"]',
      '[data-post-type="note"]',
      
      // Notes buttons and actions
      'button[aria-label*="note" i]',
      'button[title*="note" i]',
      '[class*="note-button"]',
      
      // Sidebar Notes sections
      'aside [href*="/notes"]',
      '[class*="sidebar"] [href*="/notes"]'
    ]);

    // Hide Notes tab specifically in navigation
    this.hideNotesTab();
    
    // Hide Notes posts in main feed
    this.hideNotesInFeed();
  }

  showNotes() {
    document.body.classList.remove('substack-notes-blocked');
    
    // Remove data attributes that mark hidden elements
    const hiddenElements = document.querySelectorAll('[data-notes-hidden="true"]');
    hiddenElements.forEach(el => {
      el.style.display = '';
      el.removeAttribute('data-notes-hidden');
    });
  }

  hideElementsBySelector(selectors) {
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => this.hideElement(el));
      } catch (e) {
        // Ignore invalid selectors
      }
    });
  }

  hideNotesTab() {
    // Look for Notes tab in navigation - more specific targeting
    const navLinks = document.querySelectorAll('nav a, header a, [role="navigation"] a');
    navLinks.forEach(link => {
      const text = link.textContent?.trim().toLowerCase();
      const href = link.href?.toLowerCase();
      
      if ((text === 'notes' || href?.includes('/notes')) && 
          !href?.includes('/notes-on-') && // Avoid hiding "Notes on X" publications
          !text.includes('newsletter')) {
        // Hide the parent list item or the link itself
        const listItem = link.closest('li') || link.closest('[role="tab"]') || link;
        this.hideElement(listItem);
      }
    });
  }

  hideNotesInFeed() {
    // Hide Notes posts in main content feed
    const posts = document.querySelectorAll('article, [class*="post"], [class*="story"]');
    posts.forEach(post => {
      // Check if post contains Notes indicators
      const hasNotesContent = 
        post.querySelector('[href*="/notes"]') ||
        post.querySelector('[class*="note"]') ||
        post.querySelector('[data-testid*="note"]') ||
        post.textContent?.includes('posted a note');
      
      if (hasNotesContent) {
        this.hideElement(post);
      }
    });
  }

  hideElement(element) {
    if (element && element.style) {
      element.style.display = 'none';
      element.setAttribute('data-notes-hidden', 'true');
    }
  }

  setupObserver() {
    // Watch for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
      if (this.isEnabled) {
        let shouldReapply = false;
        
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length > 0) {
            // Check if new content was added
            const hasNewContent = Array.from(mutation.addedNodes).some(node => 
              node.nodeType === 1 && (
                node.matches?.('article, [class*="post"], nav, [role="navigation"]') ||
                node.querySelector?.('article, [class*="post"], nav, [role="navigation"]')
              )
            );
            
            if (hasNewContent) {
              shouldReapply = true;
            }
          }
        });
        
        if (shouldReapply) {
          // Debounce the reapplication
          clearTimeout(this.reapplyTimeout);
          this.reapplyTimeout = setTimeout(() => {
            this.hideNotes();
          }, 100);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SubstackNotesBlocker();
  });
} else {
  new SubstackNotesBlocker();
}