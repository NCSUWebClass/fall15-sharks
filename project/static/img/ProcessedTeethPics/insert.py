import json
import secrets
import os

json_data = open("data.json").read()

data = json.loads(json_data)

for point in data:
    if 'ling' in point['filename']:
        sql = "INSERT INTO teeth (name, imgfilename, measurement, sid) VALUES ('Megalodon', '" + point['filename'] + "', " + str(point['measurement']) + ", 1)"
        command = "mysql -u"+secrets.user+" -p"+secrets.password+" -e \""+sql+"\" citizen_science"
        os.system(command)
