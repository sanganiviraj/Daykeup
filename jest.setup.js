/* eslint-disable no-undef */
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => React.createElement(View, { ...props, testID: 'mock-webview' }),
    WebView: (props) => React.createElement(View, { ...props, testID: 'mock-webview' }),
  };
});


jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    { __esModule: true },
    {
      get: (target, name) =>
        name in target
          ? target[name]
          : (props) => React.createElement(View, { ...props, testID: props.testID ?? `icon-${String(name)}` }),
    },
  );
});

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(() => Promise.resolve({ didCancel: true })),
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock-documents',
  mkdir: jest.fn(() => Promise.resolve()),
  copyFile: jest.fn(() => Promise.resolve()),
  exists: jest.fn(() => Promise.resolve(false)),
  unlink: jest.fn(() => Promise.resolve()),
  readFile: jest.fn(() => Promise.resolve('{}')),
  writeFile: jest.fn(() => Promise.resolve()),
}));
