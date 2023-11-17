import * as http from "https";
import "dotenv/config";

export const sendSmsService = (phone, text) => new Promise(resolve => {
    const reqOptions = {
        host: process.env.WHATSAPP_SERVICE_HOST,
        method: "POST",
        post: 80,
        path: `/waInstance${process.env.WHATSAPP_SERVICE_INSTANCE}/sendMessage/${process.env.WHATSAPP_SERVICE_KEY}`,
        headers: {
            "Content-Type": "application/json",
        }
    }

    const req = http.request(reqOptions, r => {
        r.setEncoding("utf8");
        r.on("data", () => resolve(true))
    });

    req.on("error", (e) => resolve(false));

    req.write(JSON.stringify({
        "chatId": `${phone}@c.us`,
        "message": text
    }))

    req.end();
})