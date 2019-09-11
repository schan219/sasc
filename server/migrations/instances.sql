INSERT INTO user (username, age, gender, phoneNumber, email, password, registered)
VALUES ("beantdonethat", 0, "cis-woman", "1234567890", "bean@example.com", "password", 1);

INSERT INTO counsellor (firstName, lastName, email, password)
VALUES ("Meanie", "Blue", "meanieblue@example.com", "password");

INSERT INTO session (ID, beginTime, endTime, counsellorID, userID)
VALUES (1, "1970-01-01 00:00:01", "1980-01-01 00:00:01", 1, 1);

INSERT INTO session (ID, beginTime, endTime, counsellorID, userID)
VALUES (2, "1980-01-01 00:12:22", "1980-01-01 12:00:01", 2, 3);

INSERT INTO session (ID, beginTime, endTime, counsellorID, userID)
VALUES (3, "2001-01-01 00:00:01", "2002-01-01 00:00:01", 1, 2);

INSERT INTO session (ID, beginTime, endTime, counsellorID, userID)
VALUES (4, "2003-01-01 00:00:01", "2010-01-01 00:00:01", 1, 4);

INSERT INTO session (ID, beginTime, endTime, counsellorID, userID)
VALUES (5, "2017-08-08 19:20:01", "2017-01-01 20:00:01", 1, 1);

INSERT INTO message(ID, sessionID, messageTime, counsellorID, userID, messageContent, fromCounsellor, fromTwilio)
VALUES (1, 1, "1970-01-01 00:00:01", 1, 1, "haii", 0, 1);

INSERT INTO message(ID, sessionID, messageTime, counsellorID, userID, messageContent, fromCounsellor, fromTwilio)
VALUES (2, 1, "1973-01-01 00:00:01", 1, 1, "i am on the web app", 0, 0);

INSERT INTO message(ID, sessionID, messageTime, counsellorID, userID, messageContent, fromCounsellor, fromTwilio)
VALUES (3, 1, "1979-01-01 00:00:01", 1, 1, "sup", 1, 0);