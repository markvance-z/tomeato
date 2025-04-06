UPDATE  [dbo].[tasks]
SET     [title] = @title
       , [description] = @description
       , [dueDate] = @dueDate
       , [complete] = @complete
       , [category] = @category
       , [priority] = @priority
WHERE   [id] = @id
 AND   [userId] = @userId;

SELECT  [id]
       , [title]
       , [description]
       , [dueDate]
       , [complete]
       , [category]
       , [priority]
FROM    [dbo].[tasks]
WHERE   [id] = @id
 AND   [userId] = @userId;