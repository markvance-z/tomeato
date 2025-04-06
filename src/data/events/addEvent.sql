DECLARE @newId INT

INSERT INTO [dbo].[events]
(
    [userId]
   , [title]
   , [description]
   , [startDate]
   , [startTime]
   , [endDate]
   , [endTime]
   , [complete]
   , [category]
   , [priority]
)
VALUES
(
   @userId
   , @title
   , @description
   , @startDate
   , @startTime
   , @endDate
   , @endTime
   , @complete
   , @category
   , @priority
);

SELECT @newId = SCOPE_IDENTITY();

SELECT 
    [userId]
   , [id]
   , [title]
   , [description]
   , [startDate]
   , [startTime]
   , [endDate]
   , [endTime]
   , [complete]
   , [category]
   , [priority]
FROM [dbo].[events]
WHERE id = @newId;