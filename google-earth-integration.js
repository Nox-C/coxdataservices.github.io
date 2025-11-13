// Google Earth Integration with Proper Attribution
class GoogleEarthChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.createGoogleEarthView();
        this.dataPoints = this.generateGeospatialData();
        this.setupControls();
    }
    
    createGoogleEarthView() {
        // Create Google Earth container
        const earthContainer = document.createElement('div');
        earthContainer.id = 'google-earth-view';
        earthContainer.style.cssText = `
            width: 1200px;
            height: 800px;
            border: 4px solid #E5B80B;
            border-radius: 12px;
            box-shadow: 0 0 30px rgba(229, 184, 11, 0.3);
            position: relative;
            background: #000;
        `;
        
        // Add Google Earth iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://earth.google.com/web/';
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 8px;
        `;
        
        earthContainer.appendChild(iframe);
        
        // Add proper Google Developer Program attribution
        const attribution = document.createElement('div');
        attribution.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            border: 1px solid #E5B80B;
        `;
        attribution.innerHTML = `
            <div>© Google Earth</div>
            <div style="font-size: 10px; opacity: 0.8;">Google Developer Program</div>
            <div style="font-size: 10px; opacity: 0.8;">Mapping Accuracy Use</div>
        `;
        earthContainer.appendChild(attribution);
        
        // Add data overlay canvas
        const overlay = document.createElement('canvas');
        overlay.width = 1200;
        overlay.height = 800;
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 999;
        `;
        
        this.overlayCanvas = overlay;
        this.overlayCtx = overlay.getContext('2d');
        earthContainer.appendChild(overlay);
        
        this.container.appendChild(earthContainer);
        
        // Start data overlay animation
        this.animateDataOverlay();
    }
    
    generateGeospatialData() {
        return [
            {name: 'NYC', lat: 40.7128, lng: -74.0060, value: 8500000},
            {name: 'LA', lat: 34.0522, lng: -118.2437, value: 4000000},
            {name: 'Chicago', lat: 41.8781, lng: -87.6298, value: 2700000},
            {name: 'Houston', lat: 29.7604, lng: -95.3698, value: 2300000},
            {name: 'Phoenix', lat: 33.4484, lng: -112.0740, value: 1700000},
            {name: 'Miami', lat: 25.7617, lng: -80.1918, value: 470000}
        ];
    }
    
    animateDataOverlay() {
        this.overlayCtx.clearRect(0, 0, 1200, 800);
        
        // Draw data points as pulsing circles
        this.dataPoints.forEach((point, index) => {
            const x = ((point.lng + 180) / 360) * 1200;
            const y = ((90 - point.lat) / 180) * 800;
            const size = (point.value / 1000000) * 3 + 5;
            const pulse = Math.sin(Date.now() * 0.005 + index) * 0.5 + 1;
            
            // Outer glow
            const gradient = this.overlayCtx.createRadialGradient(x, y, 0, x, y, size * pulse * 2);
            gradient.addColorStop(0, 'rgba(229, 184, 11, 0.8)');
            gradient.addColorStop(1, 'rgba(229, 184, 11, 0)');
            
            this.overlayCtx.fillStyle = gradient;
            this.overlayCtx.beginPath();
            this.overlayCtx.arc(x, y, size * pulse * 2, 0, Math.PI * 2);
            this.overlayCtx.fill();
            
            // Core point
            this.overlayCtx.fillStyle = '#F5D835';
            this.overlayCtx.beginPath();
            this.overlayCtx.arc(x, y, size * pulse, 0, Math.PI * 2);
            this.overlayCtx.fill();
            
            // Label
            this.overlayCtx.fillStyle = 'white';
            this.overlayCtx.font = 'bold 12px Arial';
            this.overlayCtx.fillText(point.name, x + size + 5, y - 5);
            this.overlayCtx.fillText(`${(point.value/1000000).toFixed(1)}M`, x + size + 5, y + 10);
        });
        
        requestAnimationFrame(() => this.animateDataOverlay());
    }
    
    setupControls() {
        const controls = document.createElement('div');
        controls.style.cssText = 'margin: 1rem 0; text-align: center;';
        
        controls.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <input type="number" id="earth-lat" placeholder="Latitude" step="0.0001" style="width: 120px; padding: 8px; margin-right: 10px; border: 2px solid #E5B80B; border-radius: 4px;">
                <input type="number" id="earth-lng" placeholder="Longitude" step="0.0001" style="width: 120px; padding: 8px; margin-right: 10px; border: 2px solid #E5B80B; border-radius: 4px;">
                <button onclick="earthChart.goToLocation()" class="btn btn-primary deco-btn">◆ Navigate to Location ◆</button>
            </div>
            <div style="background: rgba(10, 34, 64, 0.9); color: white; padding: 15px; border-radius: 8px; border: 2px solid #E5B80B; display: inline-block;">
                <strong>🌍 Google Earth Developer Integration</strong><br>
                Real satellite imagery with live business intelligence overlay<br>
                <small>© Google Earth | Google Developer Program Member</small><br>
                <small style="color: #C9A96E;">Used for mapping accuracy & geographic analysis</small>
            </div>
        `;
        
        this.container.appendChild(controls);
        window.earthChart = this;
    }
    
    goToLocation() {
        const lat = parseFloat(document.getElementById('earth-lat').value);
        const lng = parseFloat(document.getElementById('earth-lng').value);
        
        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid latitude and longitude values');
            return;
        }
        
        // Add data point to overlay
        this.dataPoints.push({
            name: `Custom Location`,
            lat: lat,
            lng: lng,
            value: 1000000
        });
        
        // Show location info
        alert(`Navigating to: ${lat.toFixed(4)}, ${lng.toFixed(4)}\nNote: Manually navigate in Google Earth view above`);
    }
}

// Initialize Google Earth integration
document.addEventListener('DOMContentLoaded', function() {
    // Replace the 4D chart with Google Earth integration
    const chartContainer = document.createElement('div');
    chartContainer.id = 'google-earth-chart';
    chartContainer.style.textAlign = 'center';
    chartContainer.style.margin = '2rem 0';
    
    const title = document.createElement('h3');
    title.textContent = '🌍 Google Earth Business Intelligence Integration';
    title.className = 'deco-title';
    title.style.marginBottom = '1rem';
    
    chartContainer.appendChild(title);
    
    // Insert into main section
    const mainSection = document.querySelector('.section');
    if (mainSection) {
        mainSection.insertBefore(chartContainer, mainSection.firstChild);
        new GoogleEarthChart('google-earth-chart');
    }
});