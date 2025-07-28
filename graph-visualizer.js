// D3.js-based graph visualizer
class GraphVisualizer {
    constructor(svgSelector) {
        this.svg = d3.select(svgSelector);
        this.width = 1200;
        this.height = 800;
        this.simulation = null;
        this.graphData = null;
        this.nodeElements = null;
        this.linkElements = null;
        
        this.setupSVG();
    }

    setupSVG() {
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
        
        // Add arrow marker for directed graphs
        this.svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 25)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke', 'none');
    }

    visualize(graphData, isDirected = true) {
        this.graphData = graphData;
        this.clear();

        if (!graphData.nodes || graphData.nodes.length === 0) {
            return;
        }

        // Create force simulation
        this.simulation = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.edges).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(30));

        // Create links (edges)
        this.linkElements = this.svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(graphData.edges)
            .enter().append('line')
            .attr('class', 'link')
            .style('marker-end', isDirected ? 'url(#arrowhead)' : 'none');

        // Create node groups
        this.nodeElements = this.svg.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(graphData.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));

        // Add circles to nodes
        this.nodeElements.append('circle')
            .attr('r', 20)
            .attr('fill', '#69b3a2');

        // Add labels to nodes
        this.nodeElements.append('text')
            .text(d => d.id)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .style('pointer-events', 'none');

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            this.linkElements
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            this.nodeElements
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }

    clear() {
        this.svg.select('.links').remove();
        this.svg.select('.nodes').remove();
        if (this.simulation) {
            this.simulation.stop();
        }
    }

    // Animation methods for algorithms
    highlightNode(nodeId, className) {
        this.nodeElements
            .filter(d => d.id === nodeId)
            .attr('class', `node ${className}`);
    }

    resetNodeStyles() {
        if (this.nodeElements) {
            this.nodeElements
                .attr('class', 'node')
                .select('circle')
                .attr('fill', '#69b3a2');
        }
    }

    // Get all node IDs for dropdown population
    getNodeIds() {
        return this.graphData ? this.graphData.nodes.map(node => node.id) : [];
    }

    // Drag functions for interactivity
    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Utility methods
    centerGraph() {
        if (this.simulation) {
            this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
            this.simulation.alpha(0.3).restart();
        }
    }

    // Export graph as image (bonus feature)
    exportAsSVG() {
        const svgData = new XMLSerializer().serializeToString(this.svg.node());
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "graph.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
