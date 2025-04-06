"use strict";

const api = require("./api");
const auth = require("./auth");
const path = require('path');

module.exports.register = async server => {

    await api.register(server);
    await auth.register(server);
    
    server.route([
        {
            method: "GET",
            path: "/",
            handler: async (request, h) => {
                return h.view("index", {});
            },
            options: {
                auth: {
                    mode: "try"
                }
            }
        },
        {
            method: "GET",
            path: "/Journal.html",
            handler: async (request, h) => {
                return h.view("Journal.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/pomodoro.html",
            handler: async (request, h) => {
                return h.view("pomodoro.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/settings.html",
            handler: async (request, h) => {
                return h.view("settings.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/signup.html",
            handler: async (request, h) => {
                return h.view("signup.html", {});
            },
            options: {
                auth: false
            }
        }
        
    ]);

    server.route( {
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: path.join(__dirname, "../../public"),
                index: false,
                redirectToSlash: true
            }
        },
        options: {
            auth: {
                mode: "try"
            }
        }
    });

    
};
