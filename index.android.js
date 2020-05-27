/**
 * @format
 */


import { AppRegistry } from 'react-native';
import App from './src';
import {name as appName} from './app.json';

//GLOBAL.Blob = null;

//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

AppRegistry.registerComponent(appName, () => App);

//console.disableYellowBox = true;