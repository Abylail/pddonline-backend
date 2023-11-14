import * as http from "http";
import "dotenv/config";

export const sendSmsService = (phone, text) => new Promise(resolve => {
    const reqOptions = {
        host: process.env.SMS_SERVICE_HOST,
        port: "80",
        method: "GET",
        path: encodeURI(`/service/message/sendSmsMessage?apiKey=${process.env.SMS_SERVICE_KEY}&recipient=${phone}&text=${text}`),
        headers: {
            "Content-Type": "application/json",
        }
    }

    const req = http.request(reqOptions, r => {
        r.setEncoding("utf8");
        r.on("data", () => resolve(true))
    });

    req.on("error", () => resolve(false));

    req.end();
})