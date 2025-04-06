//habits
"use strict"

const utils = require("../utils");

const register = async ({sql, getConnection}) => {
    const sqlQueries = await utils.loadSqlQueries("habits");

    const getHabits = async userId => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.NVarChar(50), userId);
        return await request.query( sqlQueries.getHabits);
    };

	const addHabit = async ({ userId, title, complete, daysComplete, maxDays, frequency }) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("userId", sql.NVarChar(50), userId);
		request.input("title", sql.NVarChar(255), title);
		request.input("complete", sql.Bit, complete);
		request.input("daysComplete", sql.Int, daysComplete);
		request.input("maxDays", sql.Int, maxDays);
		request.input("frequency", sql.NVarChar(100), frequency);

		return await request.query(sqlQueries.addHabit);
	};

    const updateHabit = async ( { id, userId, title, complete, daysComplete, maxDays, frequency } ) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.Int, id);
		request.input("userId", sql.NVarChar(50), userId);
		request.input("title", sql.NVarChar(255), title);
		request.input("complete", sql.Bit, complete);
		request.input("daysComplete", sql.Int, daysComplete);
		request.input("maxDays", sql.Int, maxDays);
		request.input("frequency", sql.NVarChar(100), frequency);

		return request.query(sqlQueries.updateHabit);
	};

	const deleteHabit = async ({id,userId}) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.Int, id);
		request.input("userId", sql.NVarChar(50), userId);
		return request.query(sqlQueries.deleteHabit);
	};

    return {
        addHabit,
        deleteHabit,
        getHabits,
        updateHabit
    };
};

module.exports = {register};
