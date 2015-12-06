import json
import secrets
import os

json_data = open("data.json").read()

data = json.loads(json_data)
measurements = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
totals = 0
for point in data:
    if 'ling' in point['filename']:
        if '1025' in point['filename'] or '1153' in point['filename'] or '188' in point['filename'] or '312' in point['filename'] or '476' in point['filename'] or '501' in point['filename'] or '811' in point['filename']:
            sql = "INSERT INTO teeth (name, imgfilename, measurement, sid) VALUES ('Lamniform', '" + point['filename'] + "', " + str(point['measurement']) + ", 2)"
        else:
            sql = "INSERT INTO teeth (name, imgfilename, measurement, sid) VALUES ('Carcharhiniform', '" + point['filename'] + "', " + str(point['measurement']) + ", 1)"
        command = "mysql -u"+secrets.user+" -p"+secrets.password+" -e \""+sql+"\" citizen_science"
        os.system(command)
        measurements[point['measurement']] += 1.0
        totals += 1
for x in range (0, 15):
    measurements[x] = (measurements[x] / totals) * 25
print(measurements)
