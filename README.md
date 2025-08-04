# Substack Notes Blocker

A simple and effective Chrome extension to hide Substack's Notes feed, helping you focus on high-quality newsletter content.

## Features

- ✅ **Hide Notes Feed** - Completely removes Notes from all Substack pages
- ✅ **One-Click Toggle** - Easy on/off switch in the extension popup
- ✅ **Works Everywhere** - Functions on all Substack publications
- ✅ **Lightweight** - Fast and efficient with minimal resource usage
- ✅ **Privacy Focused** - No data collection or tracking
- ✅ **Free Forever** - No premium features or subscriptions

## How It Works

1. Install the extension from the Chrome Web Store
2. Visit any Substack page
3. Click the extension icon to toggle Notes blocking on/off
4. Enjoy distraction-free reading of newsletter content

## Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store listing](https://chrome.google.com/webstore/detail/substack-notes-blocker/YOUR_EXTENSION_ID)
2. Click "Add to Chrome"
3. Confirm installation when prompted

### Manual Installation (Development)
1. Download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

## Usage

- **Toggle Notes**: Click the extension icon and use the toggle switch
- **Status Indicator**: Green means Notes are hidden, orange means they're visible
- **Automatic**: Settings are saved and applied automatically on all Substack sites

## Privacy

This extension:
- ✅ Does NOT collect any personal data
- ✅ Does NOT track your browsing
- ✅ Does NOT send data to external servers
- ✅ Works entirely locally in your browser
- ✅ Only accesses Substack.com domains

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Only requests access to Substack.com sites
- **Storage**: Uses Chrome's sync storage for settings
- **Compatibility**: Works with all modern Chrome browsers

## Support

Having issues? Here are common solutions:

### Extension Not Working
1. Make sure it's enabled in `chrome://extensions/`
2. Refresh the Substack page after toggling
3. Check that you're on a Substack.com domain

### Notes Still Showing
1. Click the extension icon and verify the toggle is on (green)
2. Refresh the page to apply changes
3. Some dynamic content may take a moment to hide

### Can't Find Extension Icon
1. Look for the orange "S" icon in your Chrome toolbar
2. If hidden, click the puzzle piece icon and pin the extension
3. Right-click the icon for additional options

## Feedback & Bug Reports

- **Email**: support@your-domain.com
- **Chrome Web Store**: Leave a review and rating
- **Issues**: Report bugs via email with:
  - Chrome version
  - Extension version
  - Specific Substack site URL
  - Description of the issue

## Changelog

### Version 1.0.0 (Initial Release)
- Basic Notes feed blocking
- Simple toggle interface
- Works on all Substack sites
- Chrome storage integration
- Dynamic content handling

## Development

### Building
```bash
# No build process needed - pure HTML/CSS/JS
# Just zip the files for distribution
zip -r substack-notes-blocker.zip . -x "*.git*" "*.DS_Store" "node_modules/*"
```

### Testing
1. Load extension in developer mode
2. Visit various Substack sites
3. Test toggle functionality
4. Verify Notes are hidden/shown correctly
5. Check for console errors

### File Structure
```
substack-notes-blocker/
├── manifest.json          # Extension configuration
├── content.js             # Main blocking logic
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── styles.css             # CSS hiding rules
├── icon16.png             # 16x16 toolbar icon
├── icon48.png             # 48x48 management icon
├── icon128.png            # 128x128 store icon
└── README.md              # This file
```

## Roadmap

### Planned Features
- [ ] Keyboard shortcuts
- [ ] Whitelist specific publications
- [ ] Custom hiding rules
- [ ] Usage statistics
- [ ] Dark mode for popup

### Pro Version
Planning a Pro version with advanced features:
- AI-powered content filtering
- Keyword-based blocking
- Author blocking
- Analytics dashboard
- Import/export settings

## Contributing

This is currently a solo project, but feedback is welcome:
1. Test the extension thoroughly
2. Report bugs via email
3. Suggest features you'd like to see
4. Rate and review on Chrome Web Store

## License

MIT License - see LICENSE file for details

## Disclaimer

This extension modifies the visual appearance of Substack websites for the user's convenience. It does not interfere with Substack's functionality or violate their terms of service. Users can easily disable the extension at any time.

## Credits

- Built with ❤️ for focused reading
- Icon design inspired by Substack's branding
- Tested across multiple Substack publications

---

**Enjoy distraction-free newsletter reading!** 📖