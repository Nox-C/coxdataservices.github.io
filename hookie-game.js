/**
 * Cox Data Services - Data Fortune Teller Game
 * Professional data analytics demonstration through interactive fortune telling
 */

class DataFortuneTeller {
    constructor() {
        this.industryData = {
            technology: {
                growth: [65, 85],
                benchmarks: ['95% automation potential', '3.2x faster deployment'],
                services: ['AI/ML Implementation', 'Real-time Analytics', 'Predictive Modeling'],
                roi: ['300-500%', '200-400%', '150-300%']
            },
            finance: {
                growth: [45, 70],
                benchmarks: ['99.9% accuracy required', '24/7 monitoring'],
                services: ['Risk Analytics', 'Fraud Detection', 'Regulatory Reporting'],
                roi: ['400-600%', '250-450%', '200-350%']
            },
            healthcare: {
                growth: [55, 75],
                benchmarks: ['HIPAA compliance', '98% uptime requirement'],
                services: ['Patient Analytics', 'Clinical Research', 'Operational Efficiency'],
                roi: ['250-400%', '300-500%', '180-320%']
            },
            retail: {
                growth: [70, 90],
                benchmarks: ['Real-time inventory', 'Personalization at scale'],
                services: ['Customer Analytics', 'Demand Forecasting', 'Price Optimization'],
                roi: ['350-550%', '200-400%', '250-450%']
            },
            manufacturing: {
                growth: [50, 75],
                benchmarks: ['Predictive maintenance', 'Quality control'],
                services: ['IoT Analytics', 'Supply Chain Optimization', 'Quality Analytics'],
                roi: ['400-700%', '300-500%', '200-400%']
            },
            education: {
                growth: [40, 65],
                benchmarks: ['Student success metrics', 'Resource optimization'],
                services: ['Learning Analytics', 'Performance Tracking', 'Resource Planning'],
                roi: ['200-350%', '150-300%', '180-320%']
            },
            'real-estate': {
                growth: [60, 80],
                benchmarks: ['Market trend analysis', 'Investment optimization'],
                services: ['Market Analytics', 'Investment Analysis', 'Property Valuation'],
                roi: ['300-500%', '250-400%', '200-350%']
            },
            consulting: {
                growth: [55, 80],
                benchmarks: ['Client success metrics', 'Efficiency optimization'],
                services: ['Business Intelligence', 'Performance Analytics', 'Strategic Planning'],
                roi: ['250-450%', '300-500%', '200-400%']
            }
        };

        this.fortunes = {
            growth: [
                "The data reveals unprecedented growth opportunities ahead. Your strategic positioning will unlock new revenue streams within the next quarter.",
                "Market analysis indicates a golden period approaching. Your business is perfectly positioned to capitalize on emerging trends.",
                "The algorithms predict a surge in demand for your services. Prepare for exponential growth in the coming months.",
                "Data patterns suggest your industry is entering a transformation phase. Early adopters will reap the greatest rewards."
            ],
            efficiency: [
                "Operational inefficiencies are costing you more than you realize. Our analysis reveals 40% improvement potential in your current processes.",
                "The data shows hidden bottlenecks in your workflow. Optimization will unlock significant cost savings and productivity gains.",
                "Your operational metrics indicate untapped potential. Strategic automation will revolutionize your business efficiency.",
                "Process analysis reveals opportunities for streamlining that could reduce costs by up to 35% while improving quality."
            ],
            insights: [
                "Your customers are telling a story through their data. Understanding these patterns will unlock personalization at scale.",
                "Hidden customer segments await discovery in your data. These insights will drive targeted growth strategies.",
                "Behavioral analytics reveal changing customer preferences. Adapting to these trends will secure your competitive advantage.",
                "The data shows customer lifetime value opportunities you're missing. Proper segmentation will maximize revenue per customer."
            ],
            automation: [
                "Manual processes are limiting your growth potential. Intelligent automation will free your team for strategic initiatives.",
                "The data indicates 60% of your routine tasks can be automated. This transformation will accelerate your competitive edge.",
                "Process automation opportunities abound in your operations. Implementation will deliver immediate ROI and scalability.",
                "Your workflow analysis reveals automation potential that could save 25+ hours per week while improving accuracy."
            ],
            prediction: [
                "Predictive models will transform your decision-making. Future trends become clear when data speaks with clarity.",
                "The crystal ball of analytics reveals market shifts before they happen. Predictive insights will guide your strategy.",
                "Forecasting models show opportunities to anticipate customer needs. Proactive strategies will set you apart from competitors.",
                "Predictive analytics will turn uncertainty into competitive advantage. Data-driven foresight will guide your success."
            ],
            optimization: [
                "Cost optimization opportunities hide in plain sight within your data. Strategic analysis will reveal significant savings.",
                "Resource allocation inefficiencies are impacting your bottom line. Data-driven optimization will maximize your ROI.",
                "The numbers reveal optimization potential across multiple business areas. Systematic improvements will compound your success.",
                "Financial analytics indicate cost reduction opportunities that won't compromise quality. Smart optimization drives profitability."
            ]
        };

        this.quickWins = {
            basic: [
                "Implement automated reporting dashboards",
                "Set up key performance indicator tracking",
                "Create customer segmentation analysis",
                "Establish data quality monitoring"
            ],
            intermediate: [
                "Deploy predictive analytics for demand forecasting",
                "Implement real-time performance monitoring",
                "Create advanced customer journey mapping",
                "Set up automated anomaly detection"
            ],
            advanced: [
                "Launch machine learning recommendation engine",
                "Implement real-time personalization system",
                "Deploy advanced fraud detection algorithms",
                "Create predictive maintenance system"
            ],
            expert: [
                "Optimize existing AI/ML models for better performance",
                "Implement advanced deep learning solutions",
                "Create real-time decision automation systems",
                "Deploy edge computing analytics solutions"
            ]
        };

        this.strategicInitiatives = {
            startup: "Build scalable data foundation for rapid growth",
            small: "Implement comprehensive business intelligence platform",
            medium: "Deploy enterprise-grade analytics and automation",
            large: "Create data-driven innovation and optimization programs",
            enterprise: "Establish AI-first digital transformation strategy"
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAnimations();
        this.initHookiePayPal();
    }

    bindEvents() {
        const form = document.getElementById('fortuneForm');
        const newFortuneBtn = document.getElementById('newFortune');
        const shareBtn = document.getElementById('shareResults');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showPaymentRequired();
            });
        }

        if (newFortuneBtn) {
            newFortuneBtn.addEventListener('click', () => this.resetGame());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResults());
        }
    }

    setupAnimations() {
        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    initHookiePayPal() {
        if (typeof paypal !== 'undefined') {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '1.00'
                            },
                            description: 'Mystical Data Fortune - Professional Business Insights'
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        this.handlePaymentSuccess(details);
                    });
                },
                style: {
                    color: 'gold',
                    shape: 'rect',
                    label: 'pay',
                    height: 50
                }
            }).render('#paypal-button-container-hookie');
        }
    }

    showPaymentRequired() {
        const formData = this.collectFormData();
        if (!this.validateFormData(formData)) {
            return;
        }
        
        // Scroll to payment section
        document.querySelector('.payment-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        this.showPaymentMessage('Complete your payment to unlock your mystical data fortune! 🔮', 'payment-processing');
    }

    async handlePaymentSuccess(details) {
        this.showPaymentMessage('Payment successful! Generating your mystical fortune... 🎉', 'payment-success');
        
        // Wait a moment for the success message
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const formData = this.collectFormData();
        await this.processFortuneGeneration(formData);
    }

    showPaymentMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.payment-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `payment-message ${type}`;
        messageDiv.textContent = message;
        
        // Insert after payment section
        const paymentSection = document.querySelector('.payment-section');
        paymentSection.parentNode.insertBefore(messageDiv, paymentSection.nextSibling);
        
        // Auto-remove success/processing messages after 5 seconds
        if (type !== 'payment-error') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = this.collectFormData();
        if (!this.validateFormData(formData)) {
            return;
        }

        await this.processFortuneGeneration(formData);
    }

    async processFortuneGeneration(formData) {
        this.showProcessingAnimation();
        
        // Simulate processing time for dramatic effect
        await this.simulateProcessing();
        
        const fortune = this.generateFortune(formData);
        this.displayResults(fortune, formData);
    }

    collectFormData() {
        return {
            companyName: document.getElementById('companyName').value,
            industry: document.getElementById('industry').value,
            companySize: document.getElementById('companySize').value,
            primaryGoal: document.getElementById('primaryGoal').value,
            dataMaturity: document.getElementById('dataMaturity').value,
            budget: document.getElementById('budget').value
        };
    }

    validateFormData(data) {
        const required = ['companyName', 'industry', 'companySize', 'primaryGoal', 'dataMaturity', 'budget'];
        for (let field of required) {
            if (!data[field]) {
                alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return false;
            }
        }
        return true;
    }

    showProcessingAnimation() {
        document.querySelector('.input-panel').style.display = 'none';
        document.getElementById('processingPanel').style.display = 'block';
        
        // Animate processing steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            setTimeout(() => {
                steps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
            }, index * 800);
        });
    }

    async simulateProcessing() {
        return new Promise(resolve => {
            setTimeout(resolve, 4500); // 4.5 seconds for all steps
        });
    }

    generateFortune(data) {
        const industryInfo = this.industryData[data.industry];
        const fortuneText = this.getRandomFortune(data.primaryGoal);
        const growthPotential = this.calculateGrowthPotential(data);
        const recommendedService = this.getRecommendedService(data);
        const quickWin = this.getQuickWin(data.dataMaturity);
        const strategicInit = this.strategicInitiatives[data.companySize];
        const insights = this.generateInsights(data);

        return {
            text: fortuneText,
            growth: growthPotential,
            service: recommendedService,
            quickWin: quickWin,
            strategic: strategicInit,
            insights: insights,
            industryInfo: industryInfo
        };
    }

    getRandomFortune(goal) {
        const fortunes = this.fortunes[goal] || this.fortunes.growth;
        return fortunes[Math.floor(Math.random() * fortunes.length)];
    }

    calculateGrowthPotential(data) {
        const industryInfo = this.industryData[data.industry];
        const baseGrowth = industryInfo.growth[0];
        const maxGrowth = industryInfo.growth[1];
        
        let multiplier = 1;
        
        // Adjust based on data maturity
        const maturityMultipliers = {
            basic: 1.0,
            intermediate: 1.2,
            advanced: 1.4,
            expert: 1.6
        };
        
        // Adjust based on budget
        const budgetMultipliers = {
            small: 1.0,
            medium: 1.3,
            large: 1.6,
            enterprise: 2.0
        };
        
        multiplier *= maturityMultipliers[data.dataMaturity] || 1;
        multiplier *= budgetMultipliers[data.budget] || 1;
        
        const growth = Math.min(Math.round(baseGrowth * multiplier), maxGrowth);
        return Math.max(growth, baseGrowth);
    }

    getRecommendedService(data) {
        const industryInfo = this.industryData[data.industry];
        const services = industryInfo.services;
        const rois = industryInfo.roi;
        
        let serviceIndex = 0;
        
        // Select service based on primary goal
        const goalServiceMap = {
            growth: 0,
            efficiency: 1,
            insights: 0,
            automation: 1,
            prediction: 2,
            optimization: 2
        };
        
        serviceIndex = goalServiceMap[data.primaryGoal] || 0;
        
        return {
            name: services[serviceIndex],
            roi: rois[serviceIndex],
            timeline: this.getTimeline(data.companySize),
            impact: this.getBusinessImpact(data.primaryGoal)
        };
    }

    getQuickWin(maturity) {
        const wins = this.quickWins[maturity] || this.quickWins.basic;
        return wins[Math.floor(Math.random() * wins.length)];
    }

    getTimeline(size) {
        const timelines = {
            startup: '2-4 weeks',
            small: '4-6 weeks',
            medium: '6-8 weeks',
            large: '8-12 weeks',
            enterprise: '12-16 weeks'
        };
        return timelines[size] || '4-6 weeks';
    }

    getBusinessImpact(goal) {
        const impacts = {
            growth: 'High Revenue Impact',
            efficiency: 'Significant Cost Reduction',
            insights: 'Enhanced Decision Making',
            automation: 'Operational Excellence',
            prediction: 'Strategic Advantage',
            optimization: 'Improved Profitability'
        };
        return impacts[goal] || 'Positive Business Impact';
    }

    generateInsights(data) {
        const industryInfo = this.industryData[data.industry];
        
        return {
            benchmark: industryInfo.benchmarks[Math.floor(Math.random() * industryInfo.benchmarks.length)],
            optimization: this.getOptimizationScore(data),
            readiness: this.getDataReadiness(data.dataMaturity),
            position: this.getMarketPosition(data.companySize, data.budget)
        };
    }

    getOptimizationScore(data) {
        const baseScore = 65;
        const maturityBonus = {
            basic: 0,
            intermediate: 10,
            advanced: 20,
            expert: 30
        };
        
        const budgetBonus = {
            small: 0,
            medium: 5,
            large: 10,
            enterprise: 15
        };
        
        const score = baseScore + 
                     (maturityBonus[data.dataMaturity] || 0) + 
                     (budgetBonus[data.budget] || 0) + 
                     Math.floor(Math.random() * 10);
        
        return Math.min(score, 95) + '%';
    }

    getDataReadiness(maturity) {
        const readiness = {
            basic: 'Foundation Level',
            intermediate: 'Growth Ready',
            advanced: 'Optimization Ready',
            expert: 'Innovation Ready'
        };
        return readiness[maturity] || 'Foundation Level';
    }

    getMarketPosition(size, budget) {
        const positions = {
            startup: 'Emerging Player',
            small: 'Growing Competitor',
            medium: 'Market Participant',
            large: 'Industry Leader',
            enterprise: 'Market Dominant'
        };
        
        let position = positions[size] || 'Market Participant';
        
        if (budget === 'enterprise') {
            position = 'Innovation Leader';
        }
        
        return position;
    }

    displayResults(fortune, formData) {
        document.getElementById('processingPanel').style.display = 'none';
        document.getElementById('resultsPanel').style.display = 'block';
        
        // Populate results
        document.getElementById('mainFortune').textContent = fortune.text;
        
        // Animate growth meter
        const growthBar = document.getElementById('growthBar');
        const growthPercent = document.getElementById('growthPercent');
        
        setTimeout(() => {
            growthBar.style.width = fortune.growth + '%';
            this.animateNumber(growthPercent, 0, fortune.growth, 2000, '%');
        }, 500);
        
        // Populate recommendations
        document.getElementById('recommendedService').textContent = fortune.service.name;
        document.getElementById('roiEstimate').textContent = fortune.service.roi;
        document.getElementById('quickWin').textContent = fortune.quickWin;
        document.getElementById('timeline').textContent = fortune.service.timeline;
        document.getElementById('strategicInit').textContent = fortune.strategic;
        document.getElementById('businessImpact').textContent = fortune.service.impact;
        
        // Populate insights
        document.getElementById('industryBenchmark').textContent = fortune.insights.benchmark;
        document.getElementById('optimizationScore').textContent = fortune.insights.optimization;
        document.getElementById('dataReadiness').textContent = fortune.insights.readiness;
        document.getElementById('marketPosition').textContent = fortune.insights.position;
        
        // Scroll to results
        document.getElementById('resultsPanel').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    animateNumber(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    resetGame() {
        document.getElementById('resultsPanel').style.display = 'none';
        document.getElementById('processingPanel').style.display = 'none';
        document.querySelector('.input-panel').style.display = 'block';
        
        // Remove payment messages
        const paymentMessages = document.querySelectorAll('.payment-message');
        paymentMessages.forEach(msg => msg.remove());
        
        // Reset form
        document.getElementById('fortuneForm').reset();
        
        // Scroll to top
        document.querySelector('.input-panel').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    shareResults() {
        const companyName = document.getElementById('companyName').value;
        const growth = document.getElementById('growthPercent').textContent;
        const service = document.getElementById('recommendedService').textContent;
        
        const shareText = `🔮 ${companyName} just discovered ${growth} growth potential with Cox Data Services! Our recommended solution: ${service}. Get your data fortune at coxdataservices.com/hookie.html`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Data Fortune Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard! Share with your network.');
            });
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DataFortuneTeller();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    window.konamiIndex = window.konamiIndex || 0;
    
    if (e.keyCode === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            // Easter egg: Show special message
            const specialMessage = document.createElement('div');
            specialMessage.innerHTML = '🎉 Congratulations! You found the data wizard\'s secret code! Contact us with "KONAMI" for a special discount! 🎉';
            specialMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-600));
                color: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                font-weight: bold;
                max-width: 400px;
            `;
            document.body.appendChild(specialMessage);
            
            setTimeout(() => {
                specialMessage.remove();
                window.konamiIndex = 0;
            }, 5000);
        }
    } else {
        window.konamiIndex = 0;
    }
});