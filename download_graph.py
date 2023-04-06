import pickle
import osmnx as ox

print('Downloading graph ...')

G = ox.graph_from_place("Bengaluru, India", network_type='drive')
f = open('blr.bin', 'wb')
pickle.dump(G, f)
f.close()