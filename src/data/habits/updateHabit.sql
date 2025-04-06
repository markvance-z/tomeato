UPDATE  [dbo].[habits]
SET     [title] = @title
       , [complete] = @complete
       , [daysComplete] = @daysComplete
       , [maxDays] = @maxDays
       , [frequency] = @frequency
WHERE   [id] = @id
 AND   [userId] = @userId;

SELECT  [id]
       , [title]
       , [complete]
       , [daysComplete]
       , [maxDays]
       , [frequency]
FROM    [dbo].[habits]
WHERE   [id] = @id
 AND   [userId] = @userId;