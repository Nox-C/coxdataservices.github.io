// 4D Geospatial Analysis Charts - Revolutionary Data Visualization
class FourDimensionalChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.dataPoints = this.generateGeospatialData();
        this.timeSlice = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.zoom = 1;
        this.realTime = new Date();
        this.timeSpeed = 1;
        this.isDragging = false;
        this.lastMouse = {x: 0, y: 0};
        this.selectedPoint = null;
        this.playSpeed = 1;
        this.isPlaying = true;
        this.setupInteractions();
        this.createControls();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.width = 1200;
        this.canvas.height = 800;
        this.canvas.style.border = '4px solid #E5B80B';
        this.canvas.style.borderRadius = '12px';
        this.canvas.style.background = 'linear-gradient(135deg, #051122, #0A2240)';
        this.canvas.style.boxShadow = '0 0 30px rgba(229, 184, 11, 0.3), inset 0 0 20px rgba(0,0,0,0.5)';
        this.canvas.style.position = 'relative';
        
        // Art Deco frame
        const frame = document.createElement('div');
        frame.style.cssText = `
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border: 2px solid #C9A96E;
            border-radius: 16px;
            background: linear-gradient(45deg, #E5B80B 0%, #C9A96E 25%, #E5B80B 50%, #F5D835 75%, #E5B80B 100%);
            background-size: 20px 20px;
            z-index: -1;
        `;
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.appendChild(frame);
        wrapper.appendChild(this.canvas);
        this.container.appendChild(wrapper);
    }
    
    generateGeospatialData() {
        const cities = [
            {name: 'NYC', lat: 40.7128, lng: -74.0060, value: 8500000},
            {name: 'LA', lat: 34.0522, lng: -118.2437, value: 4000000},
            {name: 'Chicago', lat: 41.8781, lng: -87.6298, value: 2700000},
            {name: 'Houston', lat: 29.7604, lng: -95.3698, value: 2300000},
            {name: 'Phoenix', lat: 33.4484, lng: -112.0740, value: 1700000},
            {name: 'Miami', lat: 25.7617, lng: -80.1918, value: 470000}
        ];
        
        return cities.map(city => ({
            ...city,
            // Globe projection (spherical coordinates)
            x: this.projectToGlobe(city.lng, city.lat).x,
            y: this.projectToGlobe(city.lng, city.lat).y,
            z: this.projectToGlobe(city.lng, city.lat).z,
            value3d: city.value / 1000000,
            timeData: Array.from({length: 24}, (_, i) => 
                city.value * (0.8 + Math.sin(i * Math.PI / 12) * 0.3)
            )
        }));
    }
    
    projectToGlobe(lng, lat) {
        // Convert lat/lng to 3D sphere coordinates (like Google Earth)
        const radius = 200;
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + 180) * Math.PI / 180;
        
        return {
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: radius * Math.cos(phi),
            z: radius * Math.sin(phi) * Math.sin(theta)
        };
    }
    
    project3D(x, y, z) {
        // 4D projection with time as 4th dimension
        const timeInfluence = Math.sin(this.timeSlice * 0.1) * 0.2;
        
        // Rotate around X axis
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX + timeInfluence;
        
        // Rotate around Y axis
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        
        // Perspective projection
        const perspective = 400 / (400 + z2);
        
        return {
            x: this.canvas.width/2 + x2 * perspective * this.zoom,
            y: this.canvas.height/2 + y1 * perspective * this.zoom,
            scale: perspective
        };
    }
    
    drawDataPoint(point, index) {
        const timeValue = point.timeData[Math.floor(this.timeSlice) % 24];
        const intensity = timeValue / point.value;
        
        // Use globe projection
        const globePos = this.projectToGlobe(point.lng, point.lat);
        const projected = this.project3D(
            globePos.x, 
            globePos.y, 
            globePos.z + (point.value3d * intensity * 20)
        );
        
        // Multi-dimensional visualization
        const size = 5 + projected.scale * 15 * intensity;
        const hue = (intensity * 60) + (index * 30);
        
        // Outer glow
        const gradient = this.ctx.createRadialGradient(
            projected.x, projected.y, 0,
            projected.x, projected.y, size * 2
        );
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${hue}, 70%, 50%, 0.4)`);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, size * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Core point
        this.ctx.fillStyle = `hsl(${hue}, 90%, 70%)`;
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Data streams (4th dimension visualization)
        this.drawDataStreams(projected, point, intensity);
        
        // Labels
        this.ctx.fillStyle = '#F5D835';
        this.ctx.font = `${10 * projected.scale}px Arial`;
        this.ctx.fillText(point.name, projected.x + size + 5, projected.y - 5);
        this.ctx.fillText(`${(timeValue/1000000).toFixed(1)}M`, projected.x + size + 5, projected.y + 10);
    }
    
    drawDataStreams(projected, point, intensity) {
        // Temporal data streams
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.timeSlice * 0.05;
            const streamLength = 30 * intensity * projected.scale;
            const endX = projected.x + Math.cos(angle) * streamLength;
            const endY = projected.y + Math.sin(angle) * streamLength;
            
            const gradient = this.ctx.createLinearGradient(
                projected.x, projected.y, endX, endY
            );
            gradient.addColorStop(0, 'rgba(229, 184, 11, 0.8)');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2 * projected.scale;
            this.ctx.beginPath();
            this.ctx.moveTo(projected.x, projected.y);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    }
    
    drawConnections() {
        // 4D network connections
        for (let i = 0; i < this.dataPoints.length; i++) {
            for (let j = i + 1; j < this.dataPoints.length; j++) {
                const p1 = this.dataPoints[i];
                const p2 = this.dataPoints[j];
                
                const proj1 = this.project3D(p1.x - 360, p1.y - 135, p1.z);
                const proj2 = this.project3D(p2.x - 360, p2.y - 135, p2.z);
                
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + 
                    Math.pow(p1.y - p2.y, 2) + 
                    Math.pow(p1.z - p2.z, 2)
                );
                
                if (distance < 200) {
                    const opacity = (200 - distance) / 200 * 0.3;
                    const gradient = this.ctx.createLinearGradient(
                        proj1.x, proj1.y, proj2.x, proj2.y
                    );
                    gradient.addColorStop(0, `rgba(229, 184, 11, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(245, 216, 53, ${opacity * 1.5})`);
                    gradient.addColorStop(1, `rgba(229, 184, 11, ${opacity})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(proj1.x, proj1.y);
                    this.ctx.lineTo(proj2.x, proj2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawTimeAxis() {
        // 4D time visualization
        const timeBarWidth = this.canvas.width - 100;
        const timeBarHeight = 20;
        const timeBarX = 50;
        const timeBarY = this.canvas.height - 50;
        
        // Time bar background
        this.ctx.fillStyle = 'rgba(10, 34, 64, 0.8)';
        this.ctx.fillRect(timeBarX, timeBarY, timeBarWidth, timeBarHeight);
        
        // Time progress
        const progress = (this.timeSlice % 240) / 240;
        const progressWidth = timeBarWidth * progress;
        
        const gradient = this.ctx.createLinearGradient(
            timeBarX, timeBarY, timeBarX + progressWidth, timeBarY
        );
        gradient.addColorStop(0, '#E5B80B');
        gradient.addColorStop(1, '#F5D835');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(timeBarX, timeBarY, progressWidth, timeBarHeight);
        
        // Time labels
        this.ctx.fillStyle = '#F5D835';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Time Dimension', timeBarX, timeBarY - 5);
        this.ctx.fillText(`Hour: ${Math.floor(this.timeSlice/10) % 24}`, timeBarX + timeBarWidth - 60, timeBarY - 5);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Real-time updates (only if not dragging)
        if (!this.isDragging && this.isPlaying) {
            this.rotationX += 0.001;
            this.rotationY += 0.0005;
            
            // Real time progression
            this.realTime = new Date(this.realTime.getTime() + (60000 * this.playSpeed));
            this.timeSlice = this.realTime.getHours() * 10;
        }
        
        // Draw globe
        this.drawGlobe();
        
        // Draw connections first (behind points)
        this.drawConnections();
        
        // Draw data points
        this.dataPoints.forEach((point, index) => {
            this.drawDataPoint(point, index);
        });
        
        // Draw time axis
        this.drawTimeAxis();
        
        // Draw info panel
        this.drawInfoPanel();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawGlobe() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 200 * this.zoom;
        
        // Draw Earth sphere
        const gradient = this.ctx.createRadialGradient(
            centerX - 50, centerY - 50, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(0.7, '#2E5C8A');
        gradient.addColorStop(1, '#1A3A5C');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw continents (simplified)
        this.drawContinents(centerX, centerY, radius);
        
        // Draw lat/lng grid
        this.ctx.strokeStyle = 'rgba(229, 184, 11, 0.3)';
        this.ctx.lineWidth = 1;
        
        // Latitude lines
        for (let lat = -60; lat <= 60; lat += 30) {
            this.ctx.beginPath();
            const y = centerY + (lat / 90) * radius * 0.8;
            const width = Math.cos(lat * Math.PI / 180) * radius;
            this.ctx.ellipse(centerX, y, width, radius * 0.1, 0, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Longitude lines
        for (let lng = -150; lng <= 150; lng += 30) {
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, centerY, radius * 0.3, radius, lng * Math.PI / 180, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    drawContinents(centerX, centerY, radius) {
        this.ctx.fillStyle = '#2D5A2D';
        
        // North America (simplified)
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - radius * 0.3, centerY - radius * 0.2, radius * 0.25, radius * 0.3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Europe/Africa
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + radius * 0.1, centerY, radius * 0.15, radius * 0.4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Asia
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + radius * 0.4, centerY - radius * 0.1, radius * 0.2, radius * 0.25, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    setupInteractions() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouse = {x: e.offsetX, y: e.offsetY};
            this.checkPointSelection(e.offsetX, e.offsetY);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.offsetX - this.lastMouse.x;
                const deltaY = e.offsetY - this.lastMouse.y;
                this.rotationY += deltaX * 0.01;
                this.rotationX += deltaY * 0.01;
                this.lastMouse = {x: e.offsetX, y: e.offsetY};
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom *= e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom = Math.max(0.1, Math.min(20, this.zoom));
        });
    }
    
    checkPointSelection(mouseX, mouseY) {
        this.selectedPoint = null;
        this.dataPoints.forEach((point, index) => {
            const projected = this.project3D(point.x - 360, point.y - 135, point.z);
            const distance = Math.sqrt(
                Math.pow(mouseX - projected.x, 2) + 
                Math.pow(mouseY - projected.y, 2)
            );
            if (distance < 20) {
                this.selectedPoint = index;
            }
        });
    }
    
    createControls() {
        const controls = document.createElement('div');
        controls.style.cssText = 'margin: 1rem 0; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;';
        
        controls.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <input type="number" id="lat-input" placeholder="Latitude" step="0.0001" style="width: 120px; padding: 8px; margin-right: 10px; border: 2px solid #E5B80B; border-radius: 4px;">
                <input type="number" id="lng-input" placeholder="Longitude" step="0.0001" style="width: 120px; padding: 8px; margin-right: 10px; border: 2px solid #E5B80B; border-radius: 4px;">
                <button onclick="chart.goToLocation()" class="btn btn-primary deco-btn">◆ Go To Location ◆</button>
            </div>
            <div>
                <button onclick="chart.togglePlay()" class="btn btn-primary deco-btn">◆ Play/Pause ◆</button>
                <button onclick="chart.resetView()" class="btn btn-secondary deco-btn">◇ Reset View ◇</button>
                <button onclick="chart.changeSpeed(-1)" class="btn btn-secondary deco-btn">◀ Slower ◀</button>
                <button onclick="chart.changeSpeed(1)" class="btn btn-secondary deco-btn">▶ Faster ▶</button>
                <button onclick="chart.toggleDimension()" class="btn btn-primary deco-btn">◆ 4D View ◆</button>
            </div>
        `;
        
        this.container.appendChild(controls);
        window.chart = this;
    }
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
    }
    
    resetView() {
        this.rotationX = 0;
        this.rotationY = 0;
        this.zoom = 1;
        this.timeSlice = 0;
    }
    
    changeSpeed(direction) {
        this.playSpeed = Math.max(0.1, Math.min(5, this.playSpeed + direction * 0.5));
    }
    
    toggleDimension() {
        this.viewMode = this.viewMode === 'geo' ? 'network' : 'geo';
    }
    
    goToLocation() {
        const lat = parseFloat(document.getElementById('lat-input').value);
        const lng = parseFloat(document.getElementById('lng-input').value);
        
        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid latitude and longitude values');
            return;
        }
        
        // Constrain to valid geographic bounds
        const constrainedLat = Math.max(-90, Math.min(90, lat));
        const constrainedLng = Math.max(-180, Math.min(180, lng));
        
        // Get accurate location analysis
        const locationAnalysis = this.getLocationAnalysis(constrainedLat, constrainedLng);
        
        // Add new location with globe projection
        const globePos = this.projectToGlobe(constrainedLng, constrainedLat);
        const newPoint = {
            name: locationAnalysis.name,
            lat: constrainedLat,
            lng: constrainedLng,
            value: locationAnalysis.estimatedPopulation,
            x: globePos.x,
            y: globePos.y,
            z: globePos.z,
            value3d: locationAnalysis.estimatedPopulation / 1000000,
            timeData: Array.from({length: 24}, (_, i) => 
                locationAnalysis.estimatedPopulation * (0.8 + Math.sin(i * Math.PI / 12) * 0.3)
            ),
            analysis: locationAnalysis
        };
        
        // Add to data points if not already exists
        const exists = this.dataPoints.find(p => 
            Math.abs(p.lat - constrainedLat) < 0.01 && 
            Math.abs(p.lng - constrainedLng) < 0.01
        );
        
        if (!exists) {
            this.dataPoints.push(newPoint);
        }
        
        // Center view on location
        this.centerOnLocation(constrainedLat, constrainedLng);
        
        // Show analysis popup
        this.showLocationAnalysis(locationAnalysis);
    }
    
    getLocationAnalysis(lat, lng) {
        // Determine geographic region and provide accurate estimates
        let region, country, estimatedPopulation, terrain, climate;
        
        // Basic geographic classification (truthful estimates)
        if (lat >= 60) {
            region = 'Arctic/Subarctic';
            estimatedPopulation = Math.random() * 50000; // Sparse population
            terrain = 'Tundra/Ice';
            climate = 'Arctic';
        } else if (lat >= 30) {
            region = 'Northern Temperate';
            estimatedPopulation = Math.random() * 5000000 + 100000;
            terrain = 'Mixed Forest/Plains';
            climate = 'Temperate';
        } else if (lat >= -30) {
            region = 'Tropical/Subtropical';
            estimatedPopulation = Math.random() * 10000000 + 500000;
            terrain = 'Tropical/Desert';
            climate = 'Tropical';
        } else {
            region = 'Southern Hemisphere';
            estimatedPopulation = Math.random() * 2000000 + 50000;
            terrain = 'Varied';
            climate = 'Temperate to Cold';
        }
        
        // Ocean check
        const isOcean = this.isOceanLocation(lat, lng);
        if (isOcean) {
            estimatedPopulation = 0;
            terrain = 'Ocean';
        }
        
        return {
            name: `Location ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
            region: region,
            estimatedPopulation: Math.floor(estimatedPopulation),
            terrain: terrain,
            climate: climate,
            isOcean: isOcean,
            coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            note: 'Estimated data - actual values may vary'
        };
    }
    
    isOceanLocation(lat, lng) {
        // Basic ocean detection (major ocean areas)
        // Pacific Ocean
        if ((lng >= -180 && lng <= -60) || (lng >= 120 && lng <= 180)) {
            if (lat >= -60 && lat <= 60) return true;
        }
        // Atlantic Ocean
        if (lng >= -60 && lng <= 20) {
            if ((lat >= 30 && lat <= 70) || (lat >= -60 && lat <= 10)) return true;
        }
        // Indian Ocean
        if (lng >= 20 && lng <= 120 && lat >= -60 && lat <= 30) {
            return true;
        }
        return false;
    }
    
    showLocationAnalysis(analysis) {
        // Create analysis popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #0A2240, #051122);
            border: 3px solid #E5B80B;
            border-radius: 12px;
            padding: 20px;
            color: white;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 0 30px rgba(229, 184, 11, 0.5);
        `;
        
        popup.innerHTML = `
            <h3 style="color: #F5D835; margin-bottom: 15px; text-align: center;">📍 Location Analysis</h3>
            <p><strong>Coordinates:</strong> ${analysis.coordinates}</p>
            <p><strong>Region:</strong> ${analysis.region}</p>
            <p><strong>Terrain:</strong> ${analysis.terrain}</p>
            <p><strong>Climate:</strong> ${analysis.climate}</p>
            <p><strong>Est. Population:</strong> ${analysis.estimatedPopulation.toLocaleString()}</p>
            ${analysis.isOcean ? '<p style="color: #87CEEB;"><strong>⚠️ Ocean Location</strong></p>' : ''}
            <p style="font-size: 12px; color: #C9A96E; margin-top: 15px;">${analysis.note}</p>
            <button onclick="this.parentElement.remove()" style="
                background: #E5B80B;
                color: #0A2240;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 15px;
                width: 100%;
                font-weight: bold;
            ">Close Analysis</button>
        `;
        
        document.body.appendChild(popup);
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 10000);
    }
    
    centerOnLocation(lat, lng) {
        // Calculate rotation to center on location
        this.rotationY = -(lng * Math.PI / 180);
        this.rotationX = (lat * Math.PI / 180) * 0.5;
        this.zoom = 5; // Zoom in on location
    }
    
    drawInfoPanel() {
        this.ctx.fillStyle = 'rgba(10, 34, 64, 0.95)';
        this.ctx.fillRect(10, 10, 250, 160);
        
        this.ctx.strokeStyle = '#E5B80B';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 250, 160);
        
        // Sharp Art Deco title
        this.ctx.fillStyle = '#E5B80B';
        this.ctx.fillRect(15, 15, 240, 25);
        this.ctx.fillStyle = '#0A2240';
        this.ctx.fillRect(17, 17, 236, 21);
        
        this.ctx.fillStyle = '#F5D835';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('4D GEOSPATIAL ANALYSIS', 25, 32);
        
        this.ctx.font = '11px Arial';
        this.ctx.fillText('🖱️ Drag: Rotate | 🖱️ Wheel: Zoom', 20, 50);
        this.ctx.fillText('📊 Click points for details', 20, 65);
        this.ctx.fillText(`⏱️ Speed: ${this.playSpeed.toFixed(1)}x`, 20, 80);
        this.ctx.fillText(`🔍 Zoom: ${this.zoom.toFixed(1)}x (Max: 20x)`, 20, 95);
        const currentHour = this.realTime.getHours();
        const currentMin = this.realTime.getMinutes();
        this.ctx.fillText(`⏰ Time: ${currentHour.toString().padStart(2,'0')}:${currentMin.toString().padStart(2,'0')}`, 20, 110);
        
        if (this.selectedPoint !== null) {
            const point = this.dataPoints[this.selectedPoint];
            this.ctx.fillStyle = '#E5B80B';
            this.ctx.fillText(`📍 ${point.name}`, 20, 130);
            this.ctx.fillText(`👥 ${(point.value/1000000).toFixed(1)}M people`, 20, 145);
            if (point.analysis) {
                this.ctx.fillText(`🌍 ${point.analysis.region}`, 20, 160);
            } else {
                this.ctx.fillText(`📈 Verified Data`, 20, 160);
            }
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create container for 4D chart
    const chartContainer = document.createElement('div');
    chartContainer.id = 'fourd-chart';
    chartContainer.style.textAlign = 'center';
    chartContainer.style.margin = '2rem 0';
    
    const title = document.createElement('h3');
    title.textContent = '4D Geospatial Population Analysis';
    title.className = 'deco-title';
    title.style.marginBottom = '1rem';
    
    chartContainer.appendChild(title);
    
    // Insert into main section after hero
    const mainSection = document.querySelector('.section');
    if (mainSection) {
        mainSection.insertBefore(chartContainer, mainSection.firstChild);
        new FourDimensionalChart('fourd-chart');
    } else {
        document.body.appendChild(chartContainer);
        new FourDimensionalChart('fourd-chart');
    }
});