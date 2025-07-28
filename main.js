// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    const visualizer = new GraphVisualizer('#graph-svg');
    let currentGraphData = null;
    let currentAdjacencyList = null;
    let isDirected = true;
    let isAlgorithmRunning = false;

    // DOM elements
    const directedBtn = document.getElementById('directed');
    const undirectedBtn = document.getElementById('undirected');
    const textArea = document.getElementById('textArea');
    const visualizeBtn = document.getElementById('visualize');
    const clearBtn = document.getElementById('clear');
    const exportBtn = document.getElementById('export');
    const runBFSBtn = document.getElementById('runBFS');
    const runDFSBtn = document.getElementById('runDFS');
    const resetColorsBtn = document.getElementById('resetColors');
    const startNodeSelect = document.getElementById('startNode');

    // Initialize with example data
    textArea.value = `1 2
2 3
3 4
4 1
1 3
2 5
5 6`;

    // Graph type toggle
    directedBtn.addEventListener('click', () => {
        if (!isAlgorithmRunning) {
            isDirected = true;
            directedBtn.classList.add('active');
            undirectedBtn.classList.remove('active');
        }
    });

    undirectedBtn.addEventListener('click', () => {
        if (!isAlgorithmRunning) {
            isDirected = false;
            undirectedBtn.classList.add('active');
            directedBtn.classList.remove('active');
        }
    });

    // Visualize graph
    visualizeBtn.addEventListener('click', () => {
        if (isAlgorithmRunning) {
            alert('Please wait for the current algorithm to finish!');
            return;
        }

        const inputText = textArea.value.trim();
        if (!inputText) {
            alert('Please enter graph data first!');
            return;
        }

        try {
            // Validate input first
            GraphParser.validateInput(inputText);
            
            // Parse the graph
            currentGraphData = GraphParser.parseInput(inputText, isDirected);
            currentAdjacencyList = GraphParser.buildAdjacencyList(currentGraphData);
            
            // Visualize the graph
            visualizer.visualize(currentGraphData, isDirected);
            updateStartNodeOptions();
            
            // Clear algorithm info
            clearAlgorithmInfo();
            
            // Show success message
            console.log('Graph visualized successfully!');
            console.log('Nodes:', currentGraphData.nodes.length);
            console.log('Edges:', currentGraphData.edges.length);
            
        } catch (error) {
            alert('Error parsing graph data: ' + error.message);
            console.error('Graph parsing error:', error);
        }
    });

    // Clear everything
    clearBtn.addEventListener('click', () => {
        if (isAlgorithmRunning) {
            alert('Please wait for the current algorithm to finish!');
            return;
        }

        textArea.value = '';
        visualizer.clear();
        startNodeSelect.innerHTML = '<option value="">Select a node</option>';
        clearAlgorithmInfo();
        currentGraphData = null;
        currentAdjacencyList = null;
    });

    // Export graph as SVG
    exportBtn.addEventListener('click', () => {
        if (!currentGraphData) {
            alert('Please visualize a graph first before exporting!');
            return;
        }
        
        try {
            visualizer.exportAsSVG();
        } catch (error) {
            alert('Error exporting graph: ' + error.message);
            console.error('Export error:', error);
        }
    });

    // Reset colors only
    resetColorsBtn.addEventListener('click', () => {
        if (!isAlgorithmRunning) {
            visualizer.resetNodeStyles();
            clearAlgorithmInfo();
        }
    });

    // Run BFS
    runBFSBtn.addEventListener('click', async () => {
        if (isAlgorithmRunning) {
            alert('Algorithm is already running!');
            return;
        }

        if (!currentAdjacencyList) {
            alert('Please visualize a graph first!');
            return;
        }

        const startNode = startNodeSelect.value;
        if (!startNode) {
            alert('Please select a start node!');
            return;
        }

        try {
            isAlgorithmRunning = true;
            disableControls();
            
            console.log('Starting BFS from node:', startNode);
            const result = await GraphAlgorithms.bfs(currentAdjacencyList, startNode, visualizer, 1500);
            
            console.log('BFS completed. Traversal order:', result);
        } catch (error) {
            console.error('BFS error:', error);
            alert('Error running BFS: ' + error.message);
        } finally {
            isAlgorithmRunning = false;
            enableControls();
        }
    });

    // Run DFS
    runDFSBtn.addEventListener('click', async () => {
        if (isAlgorithmRunning) {
            alert('Algorithm is already running!');
            return;
        }

        if (!currentAdjacencyList) {
            alert('Please visualize a graph first!');
            return;
        }

        const startNode = startNodeSelect.value;
        if (!startNode) {
            alert('Please select a start node!');
            return;
        }

        try {
            isAlgorithmRunning = true;
            disableControls();
            
            console.log('Starting DFS from node:', startNode);
            const result = await GraphAlgorithms.dfs(currentAdjacencyList, startNode, visualizer, 1500);
            
            console.log('DFS completed. Traversal order:', result);
        } catch (error) {
            console.error('DFS error:', error);
            alert('Error running DFS: ' + error.message);
        } finally {
            isAlgorithmRunning = false;
            enableControls();
        }
    });

    // Update start node dropdown
    function updateStartNodeOptions() {
        startNodeSelect.innerHTML = '<option value="">Select a node</option>';
        if (currentGraphData && currentGraphData.nodes) {
            currentGraphData.nodes.forEach(node => {
                const option = document.createElement('option');
                option.value = node.id;
                option.textContent = node.id;
                startNodeSelect.appendChild(option);
            });
        }
    }

    // Clear algorithm information display
    function clearAlgorithmInfo() {
        document.getElementById('queue-stack-display').innerHTML = '';
        document.getElementById('visited-display').innerHTML = '';
        document.getElementById('traversal-order').innerHTML = '';
    }

    // Disable controls during algorithm execution
    function disableControls() {
        runBFSBtn.disabled = true;
        runDFSBtn.disabled = true;
        visualizeBtn.disabled = true;
        clearBtn.disabled = true;
        resetColorsBtn.disabled = true;
        directedBtn.disabled = true;
        undirectedBtn.disabled = true;
        startNodeSelect.disabled = true;
        textArea.disabled = true;
    }

    // Enable controls after algorithm completion
    function enableControls() {
        runBFSBtn.disabled = false;
        runDFSBtn.disabled = false;
        visualizeBtn.disabled = false;
        clearBtn.disabled = false;
        resetColorsBtn.disabled = false;
        directedBtn.disabled = false;
        undirectedBtn.disabled = false;
        startNodeSelect.disabled = false;
        textArea.disabled = false;
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    visualizeBtn.click();
                    break;
                case 'r':
                    e.preventDefault();
                    resetColorsBtn.click();
                    break;
                case 'Delete':
                    e.preventDefault();
                    clearBtn.click();
                    break;
            }
        }
    });

    // Add some helpful text to the textarea placeholder
    textArea.addEventListener('focus', function() {
        if (this.value === '') {
            this.placeholder = `Enter edges (one per line):
1 2
2 3
3 4
1 4

Or adjacency list format:
1: 2 3 4
2: 3 5
3: 4

Shortcuts:
Ctrl+Enter: Visualize
Ctrl+R: Reset colors
Ctrl+Delete: Clear all`;
        }
    });

    textArea.addEventListener('blur', function() {
        this.placeholder = `Enter edges (one per line):
1 2
2 3
3 4
1 4

Or adjacency list:
1: 2 3
2: 3 4
3: 1`;
    });

    // Initialize the graph with example data
    setTimeout(() => {
        visualizeBtn.click();
    }, 500);

    console.log('NodeScape Graph Visualizer initialized! 🎉');
    console.log('Keyboard shortcuts:');
    console.log('- Ctrl+Enter: Visualize graph');
    console.log('- Ctrl+R: Reset colors');
    console.log('- Ctrl+Delete: Clear all');
});
