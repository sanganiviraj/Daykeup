module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs/toolkit|immer|@react-navigation|react-native-linear-gradient|@react-native-community/blur|react-native-webview|react-native-svg|lucide-react-native)/)',
  ],
};
