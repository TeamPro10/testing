// const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// admin.initializeApp();
exports.sendNotificationOnFoodPrepared = functions.database.ref('/orders/{orderId}/status')
    .onUpdate(async (change, context) => {
        const newValue = change.after.val();
        const previousValue = change.before.val();
        const orderId = context.params.orderId;

        // Check if the food status changed to "prepared"
        if (newValue === 'prepared' && previousValue !== 'prepared') {
            const userFCMToken = await getUserFCMToken(orderId);
            if (userFCMToken) {
                const payload = {
                    notification: {
                        title: 'Your food is ready!',
                        body: 'Your order is prepared and ready for pickup.'
                    }
                };
                return admin.messaging().sendToDevice(userFCMToken, payload);
            }
        }

        return null;
    });

async function getUserFCMToken(orderId) {
    try {
        // Replace this with your actual logic to retrieve the user's FCM token from your database
        // For example, if you have a "users" collection with FCM tokens stored under each user's document
        const userSnapshot = await admin.firestore().collection('users').doc(orderId).get();
        if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            return userData.fcmToken;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user FCM token:', error);
        return null;
    }
}
