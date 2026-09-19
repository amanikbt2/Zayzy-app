const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.maxWorkers = 2;

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@react-navigation/native': path.resolve(__dirname, 'node_modules/@react-navigation/native'),
  '@react-navigation/core': path.resolve(__dirname, 'node_modules/@react-navigation/core'),
  '@react-navigation/native-stack': path.resolve(__dirname, 'node_modules/@react-navigation/native-stack'),
  '@react-navigation/bottom-tabs': path.resolve(__dirname, 'node_modules/@react-navigation/bottom-tabs'),
  '@react-navigation/elements': path.resolve(__dirname, 'node_modules/@react-navigation/elements'),
  '@react-navigation/routers': path.resolve(__dirname, 'node_modules/@react-navigation/routers'),
  'react': path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};

module.exports = config;
