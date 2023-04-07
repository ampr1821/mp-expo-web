import osmnx as ox
import math, heapq, sys
import pickle

class a_star:
    def __init__(self, graph):
        self.graph = graph

    def get_route(self, pair1, pair2):
        self.start_node = ox.distance.nearest_nodes(self.graph, pair1[1], pair1[0])
        self.goal_node = ox.distance.nearest_nodes(self.graph, pair2[1], pair2[0])
        
        return self.__calculate_route()

    def __calculate_route(self):
        # Create a priority queue and add the start node with a cost of 0
        pq = [(0, self.start_node)]
        # Create a dictionary to keep track of the cost to reach each node
        cost_so_far = {self.start_node: 0}
        # Create a dictionary to keep track of the parent of each node
        parent = {self.start_node: None}
        
        while pq:
            # Pop the node with the lowest cost from the priority queue
            _, current_node = heapq.heappop(pq)
            
            # If we have reached the goal, reconstruct the path and return it
            if current_node == self.goal_node:
                path = []
                while current_node:
                    path.append(current_node)
                    current_node = parent[current_node]
                return path[::-1]
            
            # Otherwise, expand the current node's neighbors and add them to the priority queue
            for neighbor_node in self.__neighbors(current_node):
                # Calculate the cost to reach the neighbor node
                new_cost = cost_so_far[current_node] + 1
                # If we haven't visited this neighbor node yet or the new cost is lower than the old cost, update the cost and parent
                if neighbor_node not in cost_so_far or new_cost < cost_so_far[neighbor_node]:
                    cost_so_far[neighbor_node] = new_cost
                    priority = new_cost + self.__heuristic_cost_estimate(neighbor_node, self.goal_node)
                    heapq.heappush(pq, (priority, neighbor_node))
                    parent[neighbor_node] = current_node
        
        # If we get here, there is no path from the start node to the goal node
        return None
    def __haversine(self, pair1, pair2):
        """
        Calculate the great circle distance between two points
        on the earth (specified in decimal degrees)
        """
        # convert decimal degrees to radians
        lon1, lat1, lon2, lat2 = map(math.radians, [pair1[1], pair1[0], pair2[1], pair2[0]])

        # haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371 # Radius of earth in kilometers. Use 3956 for miles
        return c * r
    
    def __heuristic_cost_estimate(self, n1, n2) -> float:
        if isinstance(n1, int):
            n1 = self.graph.nodes[n1]['x'], self.graph.nodes[n1]['y']
        if isinstance(n2, int):
            n2 = self.graph.nodes[n2]['x'], self.graph.nodes[n2]['y']
        x1, y1 = n1
        x2, y2 = n2
        return self.__haversine((y1, x1), (y2, x2))

    def __neighbors(self, node):
        return list(self.graph.neighbors(node))

if __name__ == "__main__":
    
    if(len(sys.argv) < 5):
        print('Enter two lat long pairs!')
        exit(-1)

    # create the points
    point1 = (float(sys.argv[1]), float(sys.argv[2]))
    point2 = (float(sys.argv[3]), float(sys.argv[4]))

    # create the graph
    # 12.903203, 77.648572 12.912441, 77.632885
    
    # Load the graph
    try:
        f = open('blr.bin', 'rb')
        # print('Graph found, loading from disk')
        G = pickle.load(f)
        f.close()
    except:
        # print('Graph does not exist, downloading from internet')
        G = ox.graph_from_place("Bengaluru, India", network_type='drive')
        f = open('blr.bin', 'wb')
        pickle.dump(G, f)
        f.close()

    astar = a_star(G)
    path = astar.get_route(point1, point2)
    path = list(path)

    for i in path:
        lon = G._node[i]['x'] #lon
        lat = G._node[i]['y'] #lat
        print(str(lat) + ","+str(lon))

    sys.stdout.flush()
# command to run (Windows)
# python get_route.py 12.9246572 77.5582014 13.0110216 77.6747875
#hsr 
# python get_route.py 12.909229431138986 77.63947874679494 12.914080814688852 77.64155496935096
# command to run (Linux)
# python3 get_route.py 12.9246572 77.5582014 13.0110216 77.6747875
