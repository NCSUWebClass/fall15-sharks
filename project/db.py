import pymysql
from . import secrets

class DB:
    """ Container for common methods performed on database.
    Handles database access and retrieval.
    """

    def __init__(self):
        # Nothing instance specific required yet, so just passing on initialization.
        pass

    def query(self, statement):
        """ Query database using the SQL statement variable supplied.
        :param statement: A string representing an SQL statement to query with.
        """
        # Create connection per query. Probably really inefficient, but idk what happens to pymysql under the hood.
        connection = pymysql.connect(host='127.0.0.1',
                             user=secrets.DB_USER,
                             password=secrets.DB_PASSWORD,
                             db=secrets.DB_TABLE,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
        result = None
        try:
            with connection.cursor() as cursor:
                cursor.execute(statement)
                result = cursor.fetchall()
        finally:
            connection.close()
        return result

    def getRandomTeeth(self, numTeeth = 15):
        """ Retrieve a variable number of random teeth from the database.
        :param numTeeth: The number of teeth to retrieve.
        """
        statement = "SELECT id, name, measurement, imgfilename FROM teeth ORDER BY RAND() LIMIT " + str(numTeeth)
        return self.query(statement)

    def getTeeth(self, ids):
        """ Retrieve teeth from the database from a set of supplied ids.
        :param ids: List of teeth ids to retrieve teeth against.
        """
        statement = "SELECT id, name, measurement, imgfilename FROM teeth WHERE id IN ("
        numIds = len(ids)
        for index in range(numIds):
            statement += str(ids[index]) + ", " if index != numIds - 1 else str(ids[index])
        statement += ")"
        return self.query(statement)
