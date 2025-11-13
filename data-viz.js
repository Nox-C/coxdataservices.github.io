// Subtle Data Visualization Background
function createDataViz() {
    const canvas = document.createElement('canvas');
    canvas.id = 'data-viz';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const dataPoints = [];
    for (let i = 0; i < 50; i++) {
        dataPoints.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#E5B80B';
        ctx.fillStyle = '#E5B80B';
        
        // Draw connections
        for (let i = 0; i < dataPoints.length; i++) {
            for (let j = i + 1; j < dataPoints.length; j++) {
                const dx = dataPoints[i].x - dataPoints[j].x;
                const dy = dataPoints[i].y - dataPoints[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(dataPoints[i].x, dataPoints[i].y);
                    ctx.lineTo(dataPoints[j].x, dataPoints[j].y);
                    ctx.lineWidth = (100 - distance) / 100;
                    ctx.stroke();
                }
            }
        }
        
        // Draw points
        dataPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fill();
            
            point.x += point.vx;
            point.y += point.vy;
            
            if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

document.addEventListener('DOMContentLoaded', createDataViz);