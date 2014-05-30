#!/usr/bin/python3
import xml.etree.ElementTree as ET

# https://stackoverflow.com/a/17394262
# https://developer.mozilla.org/en-US/docs/Web/API/FileReader
# http://luisartola.com/software/2010/easy-xml-in-python/
canvasWidth = 300
canvasHeight = 300
numOfLager = 2
numOfGelenke = 8
avgDist = 45
# avgDist = canvasWidth / (2 * (numOfLager + numOfGelenke + 1))  # = 60

root = ET.Element('bridge')
tree = ET.ElementTree(root)

l = ET.Element('lager')
ET.SubElement(l, 'details', x='37.5', y='200', mass='0')
root.append(l)

l = ET.Element('lager')
ET.SubElement(l, 'details', x='262.5', y='200', mass='0')
root.append(l)

# FIXME: One loop and split with mod(g, 2)?
for g in range(int(numOfGelenke / 2.0)):
    gEl = ET.Element('gelenk')
    ET.SubElement(gEl, 'details', x=str(37.5 + (1 + g) * avgDist),  y='100', mass='1')
    root.append(gEl)

for g in range(int(numOfGelenke / 2.0)):
    gEl = ET.Element('gelenk')
    ET.SubElement(gEl, 'details', x=str(37.5 + (1 + g) * avgDist),  y='200', mass='1')
    root.append(gEl)

#l2 = ET.SubElement(l, 'lager 1')
ET.dump(root)
tree.write('defaults.xml')
