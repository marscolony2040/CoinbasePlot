import os


pipv = input("pip or pip3? ")

pylibs = ["aiohttp", "websockets", "numpy", "pandas"]

for pyx in pylibs:
    s = "{} install {}".format(pipv, pyx)
    print(s)
    r = os.popen(s).read()
    print(r)

r = os.popen("npm install").read()
print(r)
