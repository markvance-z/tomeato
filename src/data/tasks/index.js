//tasks
"use strict"

const { NVarChar } = require("mssql");
const utils = require("../utils");

const register = async ({sql, getConnection}) => {
    const sqlQueries = await utils.loadSqlQueries("tasks");

    const getTasks = async userId => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.VarChar(50), userId);
        return await request.query( sqlQueries.getTasks);
    };

	const addTask = async ({ userId, title, description, dueDate, complete, category, priority }) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("userId", sql.int, userId);
		request.input("title", sql.NVarChar(255), title);
		request.input("description", sql.NVarChar(1000), description);
		request.input("dueDate", sql.DateTime, dueDate);
		request.input("complete", sql.Bit, complete);
		request.input("category", NvarChar(100), category);
		request.input("priority", NVarChar(50), priority);

		return await request.query(sqlQueries.addTask);
	};

    const updateTask = async ( { userId, title, description, dueDate, complete, category, priority } ) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("userId", sql.int, userId);
		request.input("title", sql.NVarChar(255), title);
		request.input("description", sql.NVarChar(1000), description);
		request.input("dueDate", sql.DateTime, dueDate);
		request.input("complete", sql.Bit, complete);
		request.input("category", NvarChar(100), category);
		request.input("priority", NVarChar(50), priority);

		return request.query(sqlQueries.updateTask);
	};

	const deleteTask = async ({id,userId}) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.int, id);
		request.input("userId", sql.int, userId);
		
		return request.query(sqlQueries.deleteTask);
	};

    return {
        addTask,
        deleteTask,
        getTasks,
        updateTask
    };
};

module.exports = {register};
