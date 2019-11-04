import csv
import requests

with open('.\Data.csv', 'rt') as f:
    data = csv.reader(f)
    for row in data:
        r = requests.post("http://localhost:3000/modify_student", data={'name': row[1], 'batch': 'batchName'})
        print(row[1], r.status_code, r.reason)
