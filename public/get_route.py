import osmnx as ox
import networkx as nx
import sys
from geopy.distance import geodesic

def a_star(point1, point2, distance_func):

    # get the nearest nodes to the start and end points
    start_node = ox.distance.nearest_nodes(graph, point1[1], point1[0])
    end_node = ox.distance.nearest_nodes(graph, point2[1], point2[0])

    # run A* algorithm to find the shortest path
    path = nx.astar_path(graph, start_node, end_node, heuristic=distance_func, weight='length')

    # calculate the total distance of the path
    # total_distance = sum(graph[u][v]['length'] for u, v in zip(path[:-1], path[1:]))

    return path, 0

# define the distance function to use as the heuristic
def distance_func(u, v):
    point1 = (graph.nodes[u]['y'], graph.nodes[u]['x'])
    point2 = (graph.nodes[v]['y'], graph.nodes[v]['x'])
    return geodesic(point1, point2).meters

if __name__ == "__main__":
    
    if(len(sys.argv) < 5):
        print('Enter two lat long pairs!')
        exit(-1)

    # create the points
    point1 = (float(sys.argv[1]), float(sys.argv[2]))
    point2 = (float(sys.argv[3]), float(sys.argv[4]))

    # create the graph
    graph = ox.graph_from_point(point1, dist=15000, network_type='drive')
    path, total_distance = a_star(point1, point2, distance_func)
    # ox.plot.plot_graph_route(graph, path, "green")
    # print(f'The shortest path is: {path}')
    # print(f'Total distance: {total_distance:.2f} meters')

    for i in path:
      lon = graph.nodes[i]['x'] #lon
      lat = graph.nodes[i]['y'] #lat
      print(str(lat) + "," + str(lon))

    # sys.stdout.flush()
# command to run (Windows)
# python get_route.py 12.9246572 77.5582014 13.0110216 77.6747875

# command to run (Linux)
# python3 get_route.py 12.9246572 77.5582014 13.0110216 77.6747875