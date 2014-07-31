CREATE TABLE op_coordination
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fileId INT NOT NULL,
    spaceId INT NOT NULL
);
CREATE TABLE op_file
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL
);
CREATE TABLE op_file_document
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fileId INT NOT NULL,
    content LONGTEXT
);
CREATE TABLE op_file_slide
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fileId INT NOT NULL
);
CREATE TABLE op_file_slidepart
(
    slideId INT NOT NULL,
    content LONGTEXT NOT NULL,
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT
);
CREATE TABLE op_space
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    spaceName VARCHAR(45) NOT NULL,
    createUserId INT NOT NULL,
    createDate DATETIME NOT NULL
);
CREATE TABLE op_user_space_join
(
    userId INT NOT NULL,
    spaceId INT NOT NULL
);
CREATE TABLE s_user
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(32) NOT NULL,
    name VARCHAR(10) NOT NULL,
    idcard VARCHAR(18) NOT NULL,
    sex VARCHAR(2),
    qq VARCHAR(15),
    telephone VARCHAR(15),
    email VARCHAR(45),
    birth DATE,
    department VARCHAR(40) NOT NULL,
    balance INT DEFAULT 0,
    createDate DATE,
    latestLoginDate DATE,
    setting VARCHAR(500),
    remark LONGTEXT,
    icon LONGTEXT
);
CREATE UNIQUE INDEX username_UNIQUE ON s_user ( username );
CREATE UNIQUE INDEX idcard_UNIQUE ON s_user ( idcard );
