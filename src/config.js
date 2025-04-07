"use strict";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const assert = require("assert");

const {
    PORT,
    HOST,
    HOST_URL,
    COOKIE_ENCRYPT_PWD,
    SQL_SERVER,
    SQL_DATABASE,
    SQL_USER,
    SQL_PASSWORD,
    OKTA_ORG_URL,
    OKTA_CLIENT_ID,
    OKTA_CLIENT_SECRET
} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPT === 'true';

// Use defaults if necessary
const port = PORT || 8080;
// For Azure, binding to "0.0.0.0" is usually best
const host = HOST || "0.0.0.0";

//assert(PORT, "PORT is requried");
assert(HOST, "HOST is requried");
//add the rest of these assertions later

module.exports = {
    port,
    host,
    url: HOST_URL || `http://${host}:${port}`, 
    cookiePwd: COOKIE_ENCRYPT_PWD,
    sql: {
        server: SQL_SERVER,
        database: SQL_DATABASE,
        user: SQL_USER,
        password: SQL_PASSWORD,
        options: {
            encrypt: sqlEncrypt,
            enableArithAbort: true
        }
    },
    okta: {
        url: OKTA_ORG_URL,
        clientId: OKTA_CLIENT_ID,
        clientSecret: OKTA_CLIENT_SECRET
    }
};