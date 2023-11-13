import * as http from "http";
import "dotenv/config";

export const sendSmsService = (phone, text) => new Promise(resolve => {
    console.log("sendSmsService:phone", phone)
    console.log("sendSmsService:text", text)
    const reqBody = JSON.stringify({
        recipient: phone,
        text: text,
    });

    const reqOptions = {
        host: process.env.SMS_SERVICE_HOST,
        port: "80",
        method: "POST",
        path: `/service/message/sendSmsMessage?output=json&api=v1&apiKey=${process.env.SMS_SERVICE_KEY}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": reqBody.length,
        }
    }

    const req = http.request(reqOptions, (r) => {
        console.log("statusCode:", r.statusCode);
        resolve(r)
    });

    req.on("error", (e) => resolve(e));

    req.write(reqBody);
    req.end();
})