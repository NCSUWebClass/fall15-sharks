# Sets up/resets the Citizen Science database
# Haven't tested this yet, should work fine with MySQL
DROP DATABASE IF EXISTS citizen_science;
CREATE DATABASE citizen_science;
USE citizen_science;

CREATE TABLE sharks (
	id BIGINT AUTO_INCREMENT NOT NULL,
	name VARCHAR(60) NOT NULL,
	description VARCHAR(500) NOT NULL, # Can be changed depending on how much content we're throwing in
	img BLOB,
	PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE teeth (
	id BIGINT AUTO_INCREMENT NOT NULL,
	name VARCHAR(60) NOT NULL,
	img BLOB NOT NULL,
	measurement DECIMAL(4,2) UNSIGNED NOT NULL,
	sid BIGINT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (sid)
		REFERENCES sharks(id)
		ON DELETE CASCADE
) ENGINE=INNODB;