
import {messaging,firestore} from "firebase-admin"
import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore"
import { EventContext } from "firebase-functions"

const sendNotificationToDevice = (snapshot:QueryDocumentSnapshot,context:EventContext)=>{
    const notificationData = snapshot.data() as NotificationModel

    const db = firestore()

    const getUserToken =  db
    .collection(`user`)
    .doc(notificationData.user_id)
    .get()

    //antrin semu task
    return Promise.all([getUserToken]).then(result=>{
        //get user from task
        const getUser = result[0].data() 
        if(getUser == null) return
        const user = getUser as UserModel
        if(user.token == ""){
             console.log("Notification not send because token not found!")
             return
        }

        //sending notification to device
        const msg = messaging()

        msg.sendToDevice(
            user.token,
            {
                notification:{
                    title: notificationData.title,
                    body:notificationData.message
                }
            },
            {
                priority:"high",
                timeToLive: 60 * 60 * 24,
            }
        ).then((result)=>{
            console.log(
                `Notification has send to ${user.user_id} result: ${result}`
            )
        })
        .catch((err)=>{
            console.log(
                `Notification failed because ${err.message}`
            )
        })

    })
}

const sendBroadcast=(snapshot:QueryDocumentSnapshot,context:EventContext)=>{
    const notificationData = snapshot.data() as BroadcastModel

    const msg = messaging()

    msg.sendToTopic(
        notificationData.topic,
        {
            notification:{
                title:notificationData.title,
                body:notificationData.message
            }
        },
        {
            priority:"high",
                timeToLive: 60 * 60 * 24,
        }
    ).then((result)=>{
        console.log(
            `Success send notification to topic ${notificationData.topic} result: ${result}`
        )
    })
    .catch((err)=>{
        console.log(`Notification to topic ${notificationData.topic} because  ${err.message}`)
    })


}
export{
    sendNotificationToDevice
}