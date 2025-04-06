SELECT 	[id]
	, [title]
	, [description]
	, [dueDate]
	, [complete]
	, [category]
	, [priority]
    
FROM	[dbo].[tasks]
WHERE	[userId] = @userId
ORDER BY
	[dueDate]