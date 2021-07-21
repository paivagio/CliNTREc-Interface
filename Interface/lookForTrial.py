import sys, json, re
import requests
import traceback
from bs4 import BeautifulSoup

def find_trial(ID):
    page = requests.get('https://ensaiosclinicos.gov.br/rg/'+ID).text
    soup = BeautifulSoup(page, "html.parser")
    lis = soup.find_all("li")
    
    for li in lis:
        ps = li.find_all("span", class_="label")
        if(ps):
            for p in ps:
                if(p.text == 'Inclusion criteria:'):
                    inclusion = li
                elif(p.text == 'Exclusion criteria:'):
                    exclusion = li
    
    for div in inclusion.find_all('div'):
        if(div.find("h2").text == 'pt-br'):
            incl_crit = [p.text for p in div.find_all("p")]
            #print("Inclusion Criteria: ", incl_crit[0], "\n\n")
    
    for div in exclusion.find_all('div'):
        if(div.find("h2").text == 'pt-br'):
            excl_crit = [p.text for p in div.find_all("p")]
            #print("Exclusion Criteria: ", excl_crit[0])
     
    return incl_crit[0], excl_crit[0]

entry = sys.argv[1]
target = sys.argv[2]

try:
    entry = entry.split('/')
    if len(entry) > 1 and target == '#url input':
        crit_id = entry[-1]
        in_crit, ex_crit = find_trial(crit_id)
    elif len(entry) == 1 and target == '#id input':
        crit_id = entry[0]
        in_crit, ex_crit = find_trial(crit_id)
    else:
        print("Error%%%%")
        sys.exit(0)
except:
    print("Error%%%%")
    print(traceback.format_exc())
    sys.exit(0)

#create a list out of inclusion and exclusion criteria
print(in_crit)
print('%%%%')
print(ex_crit)
print('%%%%')
print(crit_id)
sys.stdout.flush()

