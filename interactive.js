// Interactive elements for Cox Data Services

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.metric-value');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const suffix = counter.textContent.replace(/[\d]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Live chat widget
function createChatWidget() {
    const chatWidget = document.createElement('div');
    chatWidget.innerHTML = `
        <div id="chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
            <div id="chat-button" style="background: #E5B80B; color: white; padding: 15px; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                💬 Live Chat
            </div>
            <div id="chat-window" style="display: none; background: white; border: 1px solid #ddd; border-radius: 10px; width: 320px; height: 400px; margin-bottom: 10px; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
                <div style="background: #0A2240; color: white; padding: 15px; border-radius: 10px 10px 0 0;">
                    <h3 style="margin: 0; font-weight: bold;">Cox Data Services</h3>
                    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">How can we help you today?</p>
                </div>
                <div style="padding: 15px; height: 250px; overflow-y: auto;" id="chat-messages">
                    <div style="margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                        <strong>Support:</strong> Hi! Interested in our data services?
                    </div>
                </div>
                <div style="padding: 15px; border-top: 1px solid #eee;">
                    <input type="text" id="chat-input" placeholder="Type your message..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
                    <button onclick="sendMessage()" style="width: 100%; padding: 10px; background: #E5B80B; color: white; border: none; border-radius: 5px; cursor: pointer;">Send</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);
    
    document.getElementById('chat-button').onclick = toggleChat;
}

function toggleChat() {
    const window = document.getElementById('chat-window');
    window.style.display = window.style.display === 'none' ? 'block' : 'none';
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    
    if (input.value.trim()) {
        messages.innerHTML += `
            <div style="margin-bottom: 10px; padding: 10px; background: #e3f2fd; border-radius: 8px; text-align: right;">
                <strong>You:</strong> ${input.value}
            </div>
            <div style="margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                <strong>Support:</strong> Thanks! We'll respond shortly. Call (217) 560-7606 for immediate assistance.
            </div>
        `;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
    }
}

// Live data feed
function createDataFeed() {
    const feed = document.createElement('div');
    feed.innerHTML = `
        <div id="data-feed" style="position: fixed; top: 100px; right: 20px; background: white; border: 1px solid #ddd; border-radius: 10px; padding: 15px; width: 250px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 999;">
            <h4 style="margin: 0 0 10px 0; color: #0A2240;">🔴 Live Data Feed</h4>
            <div id="live-data" style="font-size: 13px;">
                <div>✓ Business record validated</div>
                <div>📧 Email verified: tech@company.com</div>
                <div>📍 Location: New York, NY</div>
                <div>⏱️ Updated: Just now</div>
            </div>
        </div>
    `;
    document.body.appendChild(feed);
    
    setInterval(updateLiveData, 4000);
}

function updateLiveData() {
    const companies = ['TechCorp', 'DataFlow', 'BizSolutions', 'InfoSystems', 'CloudTech'];
    const cities = ['New York, NY', 'Chicago, IL', 'Los Angeles, CA', 'Houston, TX', 'Miami, FL'];
    const actions = ['validated', 'updated', 'verified', 'enriched', 'scraped'];
    
    const company = companies[Math.floor(Math.random() * companies.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    document.getElementById('live-data').innerHTML = `
        <div>✓ ${company} record ${action}</div>
        <div>📧 Email verified: contact@${company.toLowerCase()}.com</div>
        <div>📍 Location: ${city}</div>
        <div>⏱️ Updated: Just now</div>
    `;
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateCounters, 1000);
    createChatWidget();
    createDataFeed();
    
    // Add hover effects
    document.querySelectorAll('.card, .service-card, .metric-card').forEach(card => {
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
});