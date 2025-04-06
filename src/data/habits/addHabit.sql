DECLARE @newId INT;

INSERT INTO [dbo].[habits]
(
    [userId]
   , [title]
   , [complete]
   , [daysComplete]
   , [maxDays]
   , [frequency]
)
VALUES
(
   @userId
   , @title
   , @complete
   , @daysComplete
   , @maxDays
   , @frequency
);

SELECT @newId = SCOPE_IDENTITY();

SELECT 
    [id],
    [userId],
    [title],
    [complete],
    [daysComplete],
    [maxDays],
    [frequency]
FROM [dbo].[habits]
WHERE id = @newId;
