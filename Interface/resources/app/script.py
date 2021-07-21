import sys,json
data = sys.stdin.readlines()
data = json.loads(data[0])
print(data+' processado-----------')
sys.stdout.flush()