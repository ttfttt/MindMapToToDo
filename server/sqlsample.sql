CREATE SCHEMA Remind;
GO

CREATE TABLE Remind.Todo
(
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Title NVARCHAR(50),
    Detail NVARCHAR(500),
    Priority INT
);
GO

INSERT INTO Remind.Todo
    (Title, Detail, Priority)
VALUES
    (N'Test1', N'Detail1', 10),
    (N'Test2', N'Detail2', 20),
    (N'Test3', N'Detail3', 30);
GO

SELECT *
FROM Remind.Todo;
GO