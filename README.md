## Stream Companion App (StreamCompanion.App)
#### Cross platform App to enhance streaming platforms.
#### More info and download links:
#### App Store: https://streamcompanion.app/apps
#### Releases:  https://github.com/raymon-io/streamcompanionCrossPlatform/releases

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





