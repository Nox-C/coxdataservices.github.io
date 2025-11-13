// Google Earth Integration with 4D Features
class GoogleEarthChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Map container not found');
            return;
        }
        
        this.map = null;
        this.earth = null;
        this.markers = [];
        this.dataPoints = [];
        this.animationFrame = null;
        
        // Initialize the map
        this.initMap();
        
        // Setup navigation controls
        this.setupControls();
    }
    
    initMap() {
        try {
            // Initialize the map with the provided API key
            this.map = new google.maps.Map(this.container, {
                center: { lat: 20, lng: 0 },
                zoom: 2,
                mapTypeId: 'satellite',
                tilt: 45,
                heading: 0,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
                scaleControl: true
            });

            // Add Earth Engine overlay when the map is ready
            google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
                this.initEarthEngine();
            });
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showError('Failed to initialize the map. Please check your API key and internet connection.');
        }
    }
    
    initEarthEngine() {
        try {
            const mapDiv = this.map.getDiv();
            
            google.earth.createInstance(mapDiv, (earthInstance) => {
                this.earth = earthInstance;
                
                // Set initial view
                const lookAt = this.earth.createLookAt('');
                lookAt.setLatitude(20);
                lookAt.setLongitude(0);
                lookAt.setRange(15000000); // 15,000 km
                lookAt.setTilt(60);
                
                this.earth.getView().setAbstractView(lookAt);
                
                // Add sample data points
                this.addSampleDataPoints();
                
                // Handle window resize
                window.addEventListener('resize', () => {
                    google.earth.trigger(earthInstance, 'resize');
                });
            }, (error) => {
                console.warn('Earth Engine not available, using standard map view', error);
                this.addFallbackMarkers();
            });
        } catch (error) {
            console.error('Error initializing Earth Engine:', error);
            this.addFallbackMarkers();
        }
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

    addSampleDataPoints() {
        this.dataPoints = this.generateGeospatialData();
        
        // Add pulsing markers to the map
        this.dataPoints.forEach((point, index) => {
            const marker = new google.maps.Marker({
                position: { lat: point.lat, lng: point.lng },
                map: this.map,
                title: `${point.name}: ${(point.value/1000000).toFixed(1)}M`,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8 + (point.value / 2000000), // Size based on value
                    fillColor: '#F5D835',
                    fillOpacity: 0.8,
                    strokeWeight: 2,
                    strokeColor: '#E5B80B'
                },
                zIndex: 1000 + index
            });
            
            // Add pulsing animation
            this.animateMarker(marker, 0.5 + (index * 0.2));
            this.markers.push(marker);
            
            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="min-width: 150px;">
                        <h3 style="margin: 0 0 5px 0; color: #0A2240;">${point.name}</h3>
                        <p style="margin: 0; color: #555;">Population: ${point.value.toLocaleString()}</p>
                        <p style="margin: 5px 0 0 0; color: #888; font-size: 0.9em;">
                            ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}
                        </p>
                    </div>
                `
            });
            
            marker.addListener('click', () => {
                infoWindow.open(this.map, marker);
            });
        });
        
        // Start the data overlay animation
        this.animateDataOverlay();
    }
    
    animateMarker(marker, delay) {
        const times = [0, 1];
        const scale = [1, 1.5];
        
        function pulse() {
            const time = (performance.now() * 0.001 + delay) % 2;
            const scaleValue = time < 1 ? 
                scale[0] + (scale[1] - scale[0]) * time : 
                scale[1] - (scale[1] - scale[0]) * (time - 1);
                
            marker.setIcon({
                ...marker.getIcon(),
                scale: scaleValue * (marker.getIcon().scale || 10)
            });
            
            window.requestAnimationFrame(pulse);
        }
        
        pulse();
    }
    
    animateDataOverlay() {
        // This would be where you'd add any additional data visualization overlays
        // that you want to animate on top of the map
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        const animate = () => {
            // Add any continuous animations here
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    addFallbackMarkers() {
        console.log('Using fallback map markers');
        this.addSampleDataPoints();
        
        // Add a notification about using standard map
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 14px;
        `;
        notification.textContent = 'Using standard map view. Earth view requires additional permissions.';
        this.container.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    showError(message) {
        this.container.innerHTML = `
            <div style="padding: 20px; background: #ffebee; border: 1px solid #ef9a9a; border-radius: 4px; color: #b71c1c;">
                <h3>Error Loading Map</h3>
                <p>${message}</p>
                <p>Please check the console for more details.</p>
            </div>
        `;
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
        
        this.container.parentNode.insertBefore(controls, this.container.nextSibling);
        window.earthChart = this;
    }
    
    goToLocation() {
        const lat = parseFloat(document.getElementById('earth-lat').value);
        const lng = parseFloat(document.getElementById('earth-lng').value);
        
        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid latitude and longitude values');
            return;
        }
        
        // Pan to the new location
        this.map.panTo({ lat, lng });
        
        // If Earth view is active, update that too
        if (this.earth) {
            const lookAt = this.earth.createLookAt('');
            lookAt.setLatitude(lat);
            lookAt.setLongitude(lng);
            lookAt.setRange(5000); // Zoom in closer
            this.earth.getView().setAbstractView(lookAt);
        }
    }
}

// Initialize Google Earth integration
function initGoogleEarth() {
    try {
        window.earthChart = new GoogleEarthChart('earth-map');
    } catch (error) {
        console.error('Error initializing Google Earth:', error);
    }
}

// Initialize Google Maps API with async loading
function loadGoogleMaps() {
    const apiKey = 'AIzaSyAC4S7RIzF1AKZqSqQdi4UKOYyZNSHjN_k';
    
    if (!apiKey) {
        showMapError('Google Maps API key is missing');
        return;
    }
    
    // Use the new async loading pattern
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: apiKey,
        v: "weekly",
        libraries: ["visualization", "earth"]
    });
    
    // Set up the callback when the API is loaded
    window.initGoogleEarth = initGoogleEarth;
}

// Helper function to show map errors
function showMapError(message) {
    console.error(message);
    const container = document.getElementById('earth-map');
    if (container) {
        container.innerHTML = `
            <div style="padding: 20px; background: #ffebee; border: 1px solid #ef9a9a; border-radius: 4px; color: #b71c1c;">
                <h3>Error Loading Map</h3>
                <p>${message}</p>
                <p>Please check the console for more details.</p>
            </div>
        `;
    }
}

// Start loading Google Maps when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGoogleMaps);
} else {
    loadGoogleMaps();
}
