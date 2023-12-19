import {scheduleJob} from "node-schedule";
// Запланировать событие
export const planAction = ([day, month, hour, minutes], callback = () => {}) => {
    scheduleJob(`0 ${minutes} ${hour} ${day} ${month} *`, callback)
}