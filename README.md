# Awesome Tab
### Chrome Extension for Awesome people 
Replaces your NewTab and Homepage in Chrome Browser.

[Home Page](https://a13ks3y.github.io/ATab/)

[comment]: <> ([Alternative version]&#40;https://a13ks3y.github.io/ATab/index.html&#41; - for mobile, to set up it as home page.)

![Screenshot](./src/assets/screenshot_2023-05-03_023856.png)

## Installation

Download from [Google Web Store](https://chrome.google.com/webstore/detail/atab/hffgbimhegfljiohccdgeneejdcpdgid?gclid=CjwKCAjwx_eiBhBGEiwA15gLN9Yk4Oji8hJeRIV01iU1Z4o9TCMUVAbO2TG5z-XBJs3r607Y-ajn_RoCeoMQAvD_BwE)

Or install the latest version manualy (see notes below).

## ToDo:
- Preserve focus when rerender tabs
- ~~Showing tab title feature (not only when hovered, when focused too!)~~
- Update screenshot(s) and video
- Actually it's not "select", more like "focus" for both tabs and bookmarks. rename?
- (In progress...) Refactor and unit-test keyboard handling (now it's a mess)
- Mouse events handler for bookmarks and folders
- Add folder icon, or something, to show it's a folder, not a bookmark
- Anchor href attribute should not be undefined for the folder (think about what it should be?)
- Add close-tab animation (when close tab button clicked)
- ~~Tab/Shift+Tab and arrows navigation between opened tabs~~
- List of bookmarks (create specific folder for this purpose?)
- "Close others" button, to close all tabs, except current/selected


## 🛣 Road-Map
- Implement the bookmarks panel!
- Arrow Up and Arrow Down to navigate tabs if more than one row (how???)
- ~~Get rid of useless css/js libs and legacy code.~~
- ~~Refactor html markup of override page~~
- ~~Get rid of settings, or re-develop it.~~


### Some Useful Notes:

````shell
npm i --legacy-peer-deps && npm run build
````

Then in browser "add unpucked extention", choose the "dist" folder.
