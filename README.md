### This project will not receive any further updates. Support for all platforms have been dropped. Most platforms run the app similarly to a client-side app, so they will continue to work, except for Windows and Xbox, which do not work at this time.
#### While having so much potential, this project failed to get enough exposure, community support or engagement. The codebase and ui is simple and easy to pick for any other developer. Feel free to reach out or ask questions but I would not be able to fix any issue that come in the future.

## Stream Companion App (StreamCompanion.App)
##### Cross platform App to enhance streaming platforms. Currently works on Android, ios mobile. Also works on Android TV, FireTV, Apple TV. A slight different variation works on Samsung TV, Xbox.
#### More info and download links:
#### App Store: https://streamcompanion.app/apps
#### Releases:  https://github.com/raymon-io/streamcompanionCrossPlatform/releases
#### Reddit post: https://www.reddit.com/r/xqcow/comments/1be1qd0/made_kick_mobile_and_tv_apps_including_android_tv/
#### Updated Reddit post: https://www.reddit.com/r/xqcow/comments/1dj0er1/update_discussion_on_my_own_custom_kick_tv_mobile/
#### Youtube Demo: https://www.youtube.com/watch?v=2Jgm7lhCw-U

### How to run / build:
Make sure to have node installed. 
#### Android (including Android Mobile, Tablet, Android TV, Fire Tablet, FireTV) :
`npx expo run:android`
#### Build for Android:
`npx eas-cli build --local -p android --profile preview`

#### tvOS (Apple TV)
Note: You would need a Apple Developer's Account to run on real device.

Run on simulator: `npx expo run:ios`

Run on real device: `xed -b ios`.  Choose device and Profile.

#### iOS (iPhone, iPad)
Edit app.json: `"isTV": false`.

Run on simulator: `npx expo run:ios`

Run on device: `xed -b ios`. Choose device and Profile.

###### Troubleshooting for Android and iOS:
You may have to set environmental variables. `export EXPO_TV=1`

To see expo config-tv plugins's verbose warnings `export DEBUG=expo:react-native-tvos:config-tv`





