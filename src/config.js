"use strict";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

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
const port = process.env.PORT || 8080;

const host = process.env.HOST || "0.0.0.0";

module.exports = {
    port,
    HOST: host,
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