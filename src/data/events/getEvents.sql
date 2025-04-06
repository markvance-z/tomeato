SELECT 	[id]
	, [title]
	, [description]
	, [startDate]
	, [startTime]
	, [endDate]
	, [endTime]
	, [complete]
   	, [category]
	, [priority]
FROM	[dbo].[events]
WHERE	[userId] = @userId
ORDER BY
	[startDate], [startTime]