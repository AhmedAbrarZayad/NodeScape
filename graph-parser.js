// Graph parser to handle different input formats
class GraphParser {
    static parseInput(text, isDirected = true) {
        const lines = text.trim().split('\n').filter(line => line.trim());
        const nodes = new Set();
        const edges = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Check if it's adjacency list format (contains colon)
            if (trimmed.includes(':')) {
                const [source, targets] = trimmed.split(':');
                const sourceNode = source.trim();
                const targetNodes = targets.trim().split(/\s+/);
                
                nodes.add(sourceNode);
                for (const target of targetNodes) {
                    if (target.trim()) {
                        nodes.add(target.trim());
                        edges.push({ source: sourceNode, target: target.trim() });
                    }
                }
            } else {
                // Edge list format
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 2) {
                    const source = parts[0];
                    const target = parts[1];
                    nodes.add(source);
                    nodes.add(target);
                    edges.push({ source, target });
                }
            }
        }

        // If undirected, add reverse edges
        if (!isDirected) {
            const originalEdges = [...edges];
            for (const edge of originalEdges) {
                // Check if reverse edge doesn't already exist
                const reverseExists = edges.some(e => 
                    e.source === edge.target && e.target === edge.source
                );
                if (!reverseExists) {
                    edges.push({ source: edge.target, target: edge.source });
                }
            }
        }

        return {
            nodes: Array.from(nodes).map(id => ({ id })),
            edges: edges
        };
    }

    static buildAdjacencyList(graphData) {
        const adjacencyList = {};
        
        // Initialize all nodes
        graphData.nodes.forEach(node => {
            adjacencyList[node.id] = [];
        });

        // Add edges
        graphData.edges.forEach(edge => {
            if (!adjacencyList[edge.source].includes(edge.target)) {
                adjacencyList[edge.source].push(edge.target);
            }
        });

        return adjacencyList;
    }

    static validateInput(text) {
        const lines = text.trim().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.includes(':')) {
                // Adjacency list format
                const parts = trimmed.split(':');
                if (parts.length !== 2) {
                    throw new Error(`Invalid adjacency list format: ${trimmed}`);
                }
            } else {
                // Edge list format
                const parts = trimmed.split(/\s+/);
                if (parts.length < 2) {
                    throw new Error(`Invalid edge format: ${trimmed}`);
                }
            }
        }
        
        return true;
    }
}
