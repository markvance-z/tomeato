INSERT INTO [dbo].[tasks]
(
    [userId]
   , [title]
   , [description]
   , [dueDate]
   , [complete]
   , [category]
   , [priority]
)
VALUES
(
   @userId
   , @title
   , @description
   , @dueDate
   , @complete
   , @priority
);

SELECT SCOPE_IDENTITY() AS id;
