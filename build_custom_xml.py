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
    ET.SubElement(gEl, 'details', x=str(37.5 + (1 + g) * avgDist),
                  y='100', mass='1')
    root.append(gEl)

for g in range(int(numOfGelenke / 2.0)):
    gEl = ET.Element('gelenk')
    ET.SubElement(gEl, 'details', x=str(37.5 + (1 + g) * avgDist),
                  y='200', mass='1')
    root.append(gEl)

s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='2', rightEnd='3', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='3', rightEnd='4', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='4', rightEnd='5', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='0', rightEnd='2', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='2', rightEnd='6', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='6', rightEnd='3', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='3', rightEnd='7', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='3', rightEnd='8', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='7', rightEnd='4', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='4', rightEnd='8', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='4', rightEnd='9', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='5', rightEnd='9', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='5', rightEnd='1', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='0', rightEnd='6', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='6', rightEnd='7', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='7', rightEnd='8', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='8', rightEnd='9', mass='0')
root.append(s)
s = ET.Element('stange')
ET.SubElement(s, 'details', leftEnd='9', rightEnd='1', mass='0')
root.append(s)
ET.dump(root)
tree.write('defaults.xml')
