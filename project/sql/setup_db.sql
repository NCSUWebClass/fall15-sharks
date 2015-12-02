# Sets up/resets the Citizen Science database
DROP DATABASE IF EXISTS citizen_science;
CREATE DATABASE citizen_science;
USE citizen_science;

CREATE TABLE sharks (
	id BIGINT AUTO_INCREMENT NOT NULL,
	name VARCHAR(60) NOT NULL,
	description VARCHAR(500) NOT NULL, # Can be changed depending on how much content we're throwing in
	imgfilename VARCHAR(60),
	PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE teeth (
	id BIGINT AUTO_INCREMENT NOT NULL,
	name VARCHAR(60) NOT NULL,
	imgfilename VARCHAR(60) NOT NULL,
	measurement SMALLINT UNSIGNED NOT NULL,
	sid BIGINT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (sid)
		REFERENCES sharks(id)
		ON DELETE CASCADE
) ENGINE=INNODB;