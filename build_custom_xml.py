#!/usr/bin/python3
import xml.etree.ElementTree as ET

# https://stackoverflow.com/a/17394262
# https://developer.mozilla.org/en-US/docs/Web/API/FileReader
# http://luisartola.com/software/2010/easy-xml-in-python/
root = ET.Element('bridge')
tree = ET.ElementTree(root)
l1 = ET.Element('lager')
ET.SubElement(l1, 'details', x='100', y='200', mass='0')
l2 = ET.Element('lager')
ET.SubElement(l2, 'details', x='200', y='200', mass='0')
#l2 = ET.SubElement(l, 'lager 1')
root.append(l1)
root.append(l2)
ET.dump(root)
tree.write('defaults.xml')
