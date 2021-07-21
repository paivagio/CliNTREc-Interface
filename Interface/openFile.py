import sys, json, re

data = sys.stdin.readlines()
trial = json.loads(data[0])

try:
    #in_crit, ex_crit = split_criteria(trial) #separate inclusion and exclusion criteria
    in_crit, ex_crit = trial.split('\n')
    in_crit = in_crit.rstrip('\r')
    ex_crit = ex_crit.rstrip('\r')
except:
    print("Error")
    sys.exit(0)

#create a list out of inclusion and exclusion criteria
print(in_crit)
print(ex_crit)
sys.stdout.flush()