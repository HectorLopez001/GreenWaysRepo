/**
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native';
import App from './src';
import {name as appName} from './app.json';



function HeadlessCheck({}){
    if(isHeadless){
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <App />
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

//console.disableYellowBox = true;