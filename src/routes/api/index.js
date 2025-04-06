"use strict";

const events = require("./events");
const habits = require("./habits");

module.exports.register = async server => {
    await events.register(server);
    await habits.register(server);
};
