/*
->User(idUser, pseudo, name, e-mail, pwd, type_of_mfa, profile_picture, date, state, *paramForBots)
-> UsersParameters(idUser, policeType, policeSize, colorSet, ...)
-> Friends(idUser1,idUser2, state)
-> Blocks(idUser,idUserBlocked)
-> Groups(idGroup, idCreator, nom, id_image, date, *groupParam)	// on peut aussi stocker idCreator dans Link_Users_Groups
-> Link_Users_Groups(idGroup, idUser, state, nb_notifs)
-> Messages(idMsg, idUser, idGroup, content, date, parentId)
-> Files(idUser, idGroup, file_name, file_extension, file_idLocation,date)
-> Reaction(idUser, idMessage, idGroup, content)
-> Lu(idUser, idGroup, dateLastCheckUp)
*/

drop database if exists hertz_database;

create database if not exists hertz_database;

use hertz_database;

drop table if exists UserParameters;
drop table if exists Friend;
drop table if exists Block;
drop table if exists Link_Users_Groups;
drop table if exists Group_Chat;
drop table if exists Message;
drop table if exists User;

-- User table
-- Register users of the platform
CREATE TABLE IF NOT EXISTS User (
    id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    pseudo VARCHAR(255) NOT NULL, -- == pseudo, modifiable
    user_name VARCHAR(255) NOT NULL, -- == vrai nom, pas modifiable
    email VARCHAR(255) NOT NULL,
    pwd VARCHAR(1000),
    type_of_mfa VARCHAR(255), -- multi factor authentication
    profile_picture VARCHAR(255) DEFAULT './default-user.png', -- path to image file
    creation_date DATE DEFAULT(CURDATE()), -- creation date of the user's account
    user_state VARCHAR(255) -- AVAILABLE, NOT DISTURB, AWAY; TODO: Posibilite de mettre un TINYINT pour decrire l etat
);

-- UserParameters table
-- Register user custom parameters
CREATE TABLE IF NOT EXISTS UserParameters (
    id_user INT NOT NULL,
    police_size VARCHAR(255) NULL, -- Set police size of the application
    color_set VARCHAR(255) NULl, -- TODO: Pour daltonien, a revoir implementation
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    PRIMARY KEY (id_user)
);

-- Friend table
-- Register friends relation between User
-- Attention : duplica de ligne. Ex: user1 ami user2 ET user2 ami user1 /!\ Pas bon, duplica
CREATE TABLE IF NOT EXISTS Friend (
    id_user1 INT NOT NULL,
    id_user2 INT NOT NULL,
    friend_state VARCHAR(255) NOT NULL, -- TODO: Peut etre un BIT pour decrire l etat (PENDING, ACCEPTED); Ligne supprimer si pas accepte
    FOREIGN KEY (id_user1) REFERENCES User(id_user),
    FOREIGN KEY (id_user2) REFERENCES User(id_user),
    PRIMARY KEY (id_user1, id_user2)
);

-- Blocks table
-- Register users block by other users
CREATE TABLE IF NOT EXISTS Block (
    id_user INT, -- From TODO: Voir comment gerer le bannissement
    id_user_blocked INT NOT NULL, -- To
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    FOREIGN KEY (id_user_blocked) REFERENCES User(id_user),
    PRIMARY KEY (id_user, id_user_blocked)
);

-- Groups table
-- For Group_Chat chat
CREATE TABLE IF NOT EXISTS Group_Chat (
    id_group INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_user_creator INT NOT NULL, -- User who created the group
    group_name VARCHAR(255) NOT NULL,
    group_picture VARCHAR(255) DEFAULT './default-group.png', -- path to image file
    date_creation DATE DEFAULT(CURDATE()),
    FOREIGN KEY (id_user_creator) REFERENCES User(id_user)
);

-- Link_Users_Groups table
-- Know which users is in which groups
CREATE TABLE IF NOT EXISTS Link_Users_Groups (
    id_group INT NOT NULL,
    id_user INT NOT NULL,
    state_invitation_group VARCHAR(255) NOT NULL, -- TODO: Peut etre un BIT pour decrire l etat (PENDING, ACCEPTED); Ligne supprimer si pas accepte
    -- nb_notifs INT, -- TODO: Revoir son interet
    date_last_check_up DATETIME DEFAULT NOW(), -- The last time a user saw a message in a group chat
    FOREIGN KEY (id_group) REFERENCES Group_Chat(id_group),
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    PRIMARY KEY (id_group, id_user)
);

-- Messages table
-- Describe the state of message
CREATE TABLE IF NOT EXISTS Message(
    id_msg INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_group INT NOT NULL,
    msg_content TEXT NOT NULL,
    date_send DATETIME DEFAULT NOW(),
    id_parent_msg INT NULL, -- Used for responses
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    FOREIGN KEY (id_group) REFERENCES Group_Chat(id_group)
);

-- Files table
-- TODO: Avoir la pertinence
/*
CREATE TABLE Files (
    id_user INT,
    id_group INT,
    file_name VARCHAR(255),
    file_extension VARCHAR(255),
    file_idLocation INT,
    date_send DATE,
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    FOREIGN KEY (id_group) REFERENCES Group_Chat(id_group)
);

-- Reaction table
-- TODO : Revoir son interet
CREATE TABLE Reaction (
    id_user INT,
    id_message INT,
    id_group INT,
    content_reaction VARCHAR(255),
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    FOREIGN KEY (id_message) REFERENCES Message(id_msg),
    FOREIGN KEY (id_group) REFERENCES Group_Chat(id_group)
);

 */