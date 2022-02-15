//no-trailing-spaces
import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin"; 
import {sendNotificationToDevice} from "./notification/broadcast";

initializeApp(
    functions.config().firebase
);

exports.senBroadcast = functions
    .firestore
    .document("notification/{documentId}")
    .onCreate(sendNotificationToDevice);