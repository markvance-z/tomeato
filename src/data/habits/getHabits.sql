SELECT 	[id]
	, [title]
	, [complete]
	, [daysComplete]
	, [maxDays]
	, [frequency]

FROM	[dbo].[habits]
WHERE	[userId] = @userId
ORDER BY
	[title]