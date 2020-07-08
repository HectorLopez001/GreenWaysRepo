import React, { useEffect } from 'react';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import cfgStore, { persistor } from './store/configureStore';
import Root from './containers'
import { fcmService } from './components/FCMService';
import { localNotificationService } from './components/LocalNotificationService';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

const store = cfgStore();

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
   // alert('Message handled in the background!', remoteMessage);
});

export default function App() {

    useEffect(() => {
        fcmService.registerAppWithFCM;
        fcmService.register(onRegister, onNotification, onOpenNotification)
        localNotificationService.configure(onOpenNotification);

        function onRegister(token){
            console.log("[App] onRegister: ", token)
            //alert("[App] onRegister: ", token)
        }

        function onNotification(notify){
            console.log("[App] onNotification: ", notify)
            //alert("[App] onNotification: ", notify)
            const options = {
                soundName: 'default',
                playSound: true
            }
            localNotificationService.showNotification(
                0,
                notify.title,
                notify.body,
                notify,
                options
            )
        }

        function onOpenNotification(notify){
            console.log("[App] onOpenNotification: ", notify)
            //alert("Open Notification: " + notify.body)
        }

        return () => {
            console.log("[App] unRegister")
            //alert("[App] unRegister")
            fcmService.unRegister()
            localNotificationService.unRegister()
        }

    }, [])

            messaging()
              .getToken()
              .then(token => {
               // return saveTokenToDatabase(token);
               // console.log("token puto:" + token);
               // alert("token puto:" + token);

               AsyncStorage.setItem("tokenDispositivo", token);
              });

        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Root/>
                </PersistGate>
            </Provider>
        )     
    }