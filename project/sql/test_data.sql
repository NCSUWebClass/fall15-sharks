INSERT into sharks (
	name,
	description,
	img)
	VALUES(
	'tiger',
	'fake test shark family',
	LOAD_FILE('/images/tigershark.jpg'));
	
INSERT into teeth (
	name,
	imgfilename,
	measurement,
	sid)
	VALUES(
	'nonfunctional',
	LOAD_FILE('/images/nonfunctional'),
	6,
	1);