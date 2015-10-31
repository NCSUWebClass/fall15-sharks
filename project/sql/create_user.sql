# Creates main user for database interactions, limited to Citizen Science database.
CREATE USER 'cs'@'localhost' IDENTIFIED BY 'ncsu';
GRANT ALL PRIVILEGES ON citizen_science.* TO 'cs'@'localhost';