// BFS and DFS algorithms with step-by-step visualization
class GraphAlgorithms {
    static async bfs(adjacencyList, startNode, visualizer, delay = 1500) {
        const visited = new Set();
        const queue = [startNode];
        const traversalOrder = [];

        visualizer.resetNodeStyles();
        
        // Update initial display
        document.getElementById('queue-stack-display').innerHTML = 
            `<strong>Queue (BFS):</strong> [${queue.join(', ')}]`;
        document.getElementById('visited-display').innerHTML = 
            `<strong>Visited:</strong> { }`;
        document.getElementById('traversal-order').innerHTML = 
            `<strong>Traversal Order:</strong> [ ]`;

        while (queue.length > 0) {
            const current = queue.shift();
            
            if (!visited.has(current)) {
                visited.add(current);
                traversalOrder.push(current);
                
                // Highlight current node
                visualizer.highlightNode(current, 'current');
                
                // Update displays
                document.getElementById('queue-stack-display').innerHTML = 
                    `<strong>Queue (BFS):</strong> [${queue.join(', ')}]`;
                document.getElementById('visited-display').innerHTML = 
                    `<strong>Visited:</strong> {${Array.from(visited).join(', ')}}`;
                document.getElementById('traversal-order').innerHTML = 
                    `<strong>Traversal Order:</strong> [${traversalOrder.join(' → ')}]`;
                
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // Mark as visited
                visualizer.highlightNode(current, 'visited');
                
                // Add neighbors to queue
                if (adjacencyList[current]) {
                    for (const neighbor of adjacencyList[current]) {
                        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
                            queue.push(neighbor);
                            visualizer.highlightNode(neighbor, 'visiting');
                        }
                    }
                }
                
                // Update queue display after adding neighbors
                document.getElementById('queue-stack-display').innerHTML = 
                    `<strong>Queue (BFS):</strong> [${queue.join(', ')}]`;
                
                await new Promise(resolve => setTimeout(resolve, delay / 2));
            }
        }
        
        // Final update
        document.getElementById('queue-stack-display').innerHTML = 
            `<strong>Queue (BFS):</strong> [ ] - COMPLETE`;
        
        return traversalOrder;
    }

    static async dfs(adjacencyList, startNode, visualizer, delay = 1500) {
        const visited = new Set();
        const traversalOrder = [];

        visualizer.resetNodeStyles();
        
        // Update initial display
        document.getElementById('queue-stack-display').innerHTML = 
            `<strong>DFS (Recursive):</strong> Starting from ${startNode}`;
        document.getElementById('visited-display').innerHTML = 
            `<strong>Visited:</strong> { }`;
        document.getElementById('traversal-order').innerHTML = 
            `<strong>Traversal Order:</strong> [ ]`;

        // Recursive DFS helper function
        async function dfsRecursive(node) {
            if (visited.has(node)) return;
            
            visited.add(node);
            traversalOrder.push(node);
            
            // Highlight current node
            visualizer.highlightNode(node, 'current');
            
            // Update displays
            document.getElementById('queue-stack-display').innerHTML = 
                `<strong>DFS (Recursive):</strong> Processing ${node}`;
            document.getElementById('visited-display').innerHTML = 
                `<strong>Visited:</strong> {${Array.from(visited).join(', ')}}`;
            document.getElementById('traversal-order').innerHTML = 
                `<strong>Traversal Order:</strong> [${traversalOrder.join(' → ')}]`;
            
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Mark as visited
            visualizer.highlightNode(node, 'visited');
            
            // Recursively visit neighbors
            if (adjacencyList[node]) {
                for (const neighbor of adjacencyList[node]) {
                    if (!visited.has(neighbor)) {
                        visualizer.highlightNode(neighbor, 'visiting');
                        await new Promise(resolve => setTimeout(resolve, delay / 3));
                        await dfsRecursive(neighbor);
                    }
                }
            }
        }
        
        // Start the recursive DFS
        await dfsRecursive(startNode);
        
        // Final update
        document.getElementById('queue-stack-display').innerHTML = 
            `<strong>DFS (Recursive):</strong> COMPLETE`;
        
        return traversalOrder;
    }
}
