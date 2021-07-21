import sys, json, os, re

try:
  sys_dir = sys.argv[1]
  filename = sys.argv[2]
  inc = sys.argv[3]
  exc = sys.argv[4]

  filename = re.sub('.txt', '', filename)
  filename = re.sub('\r|\\\r', '', filename)
  filename = re.sub('\n|\\n', '', filename)

  sys_dir = re.sub('\\\\', '/', sys_dir)
  
  inp = sys_dir+'/temp/'+filename+'.txt'
  ec_dir = sys_dir+'/temp/'+filename+'_result.xml'
  pacients_dir = sys_dir+'/temp/'+filename+'_result_pacients.txt'

  inc = re.sub('\n|\r|\t', '', inc)
  exc = re.sub('\n|\r|\t', '', exc)
  with open(inp, 'w', encoding='UTF-8') as f:
    f.write(inc + '\n' + exc)

  try:
    root = os.getcwd()
    os.chdir(sys_dir)

    command = 'python main.py -t "'+filename+'.txt'+'" -s True'
    os.system(command)

    os.chdir(root)
  except Exception as e:
    print('Error',end='')

  print('%%%%',end='')

  if os.stat(pacients_dir).st_size == 0:
    print(0,end='')
  else:
    with open(pacients_dir, 'r') as f:
      count = 0
      for i, l in enumerate(f):
        count = i
        pass
      print(count+1,end='')

  print('%%%%',end='')
  ec_dir = re.sub('/', '\\\\', ec_dir)
  print(ec_dir,end='')
  print('%%%%',end='')
  pacients_dir = re.sub('/', '\\\\', pacients_dir)
  print(pacients_dir,end='')

  sys.stdout.flush()
except Exception as e:
  print(str(e))
  