// ===== HKU Coin Fund - Interactive JavaScript =====

// Global variables
let fundData = {};
let performanceChart = null;

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize components directly
        initializeNavigation();
        initializePerformanceChart();
        initializePortfolioChart();
        initializeTransactionsChart();
        initializeScrollEffects();

        console.log('HKU Coin Fund website initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// ===== Data Loading =====
async function loadFundData() {
    try {
        console.log('Loading fund data...');
        const response = await fetch('assets/data/fund_data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        fundData = await response.json();
        console.log('Fund data loaded successfully:', fundData);

        // Validate required data
        if (!fundData.performanceData || !fundData.riskMetrics || !fundData.historicalData) {
            throw new Error('Invalid fund data structure');
        }

    } catch (error) {
        console.error('Error loading fund data:', error);
        showError('Failed to load fund data. Please refresh the page.');

        // Set fallback data to prevent complete failure
        fundData = {
            performanceData: {
                totalReturn: 17.53,
                benchmarkReturn: 3.31,
                portfolioValue: 1175347.28,
                initialValue: 1000000,
                cashBalance: 1032379.28,
                marketValue: 142968.0,
                tradesCount: 57
            },
            riskMetrics: {
                sharpe: 0.83,
                beta: 1.05,
                alpha: 12.6,
                info_ratio: 1.02,
                treynor: 9.94,
                max_drawdown: -1.67,
                volatility: 12.49
            },
            historicalData: {
                dates: ["9/3", "9/4", "9/5", "9/8", "9/9", "9/10", "9/11", "9/12", "9/15", "9/16", "9/17", "9/18", "9/19", "9/22", "9/23", "9/24", "9/25", "9/26"],
                portfolioValues: [999265.73, 1007915.02, 1017985.72, 1032864.77, 1043225.11, 1029953.21, 1166602.94, 1171676.70, 1174149.34, 1173746.30, 1176214.61, 1175377.95, 1189780.42, 1187202.30, 1185572.44, 1179265.59, 1169900.43, 1175347.28],
                benchmarkValues: [1004950.17, 1012581.94, 1010089.26, 1012383.44, 1014404.46, 1017055.95, 1024699.52, 1024378.61, 1029323.96, 1028098.08, 1026898.99, 1031180.18, 1035814.02, 1040174.54, 1035116.11, 1032102.25, 1027729.65, 1033090.83]
            },
            currentHoldings: [
                {
                    symbol: "SOL",
                    name: "Solana",
                    quantity: 700,
                    marketValue: 146048.0,
                    return: -10.63,
                    weight: 12.4,
                    type: "crypto"
                },
                {
                    symbol: "CASH",
                    name: "Cash & Equivalents",
                    quantity: 1,
                    marketValue: 1032379.28,
                    return: 0.0,
                    weight: 87.8,
                    type: "cash"
                }
            ]
        };
    }
}

// ===== Navigation =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#contact' && this.classList.contains('cta-button')) {
                // CTA button goes to contact
                scrollToSection('contact');
            } else if (targetId && targetId !== '#') {
                scrollToSection(targetId.substring(1));
            }

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu if open
            navLinksContainer.classList.remove('mobile-active');
        });
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('mobile-active');
            this.classList.toggle('active');
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== Performance Chart =====
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }

    try {
        // Use actual performance data from CSV
        const dates = ["Sep 3", "Sep 4", "Sep 5", "Sep 8", "Sep 9", "Sep 10", "Sep 11", "Sep 12", "Sep 15", "Sep 16", "Sep 17", "Sep 18", "Sep 19", "Sep 22", "Sep 23", "Sep 24", "Sep 25", "Sep 26"];
        const portfolioValues = [99.93, 100.79, 101.80, 103.29, 104.32, 103.00, 116.66, 117.17, 117.41, 117.37, 117.62, 117.54, 118.98, 118.72, 118.56, 117.93, 116.99, 117.53];
        const benchmarkValues = [100.50, 101.26, 101.01, 101.24, 101.44, 101.71, 102.47, 102.44, 102.93, 102.81, 102.69, 103.12, 103.58, 104.02, 103.51, 103.21, 102.77, 103.31];

        performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'HKUCoin Fund',
                        data: portfolioValues,
                        borderColor: '#6559F9',
                        backgroundColor: 'rgba(101, 89, 249, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 2,
                        pointBackgroundColor: '#6559F9',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 4
                    },
                    {
                        label: 'Benchmark (90% SPY + 10% SHY)',
                        data: benchmarkValues,
                        borderColor: '#6B7280',
                        backgroundColor: 'rgba(107, 114, 128, 0.05)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        borderDash: [5, 5],
                        pointRadius: 1,
                        pointBackgroundColor: '#6B7280',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 12,
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 10,
                        cornerRadius: 6,
                        titleFont: {
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            size: 11
                        },
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 9
                            },
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 98,
                        max: 120,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.03)'
                        },
                        ticks: {
                            font: {
                                size: 10
                            },
                            callback: function(value) {
                                return value.toFixed(0) + '%';
                            },
                            stepSize: 5
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                }
            }
        });
        console.log('Chart initialized successfully');
    } catch (error) {
        console.error('Error creating chart:', error);
        const container = ctx.parentElement;
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #6B7280;">Chart temporarily unavailable</div>';
        }
    }
}

// ===== Portfolio Chart =====
function initializePortfolioChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx) return;

    try {
        // Create pie chart without showing data values
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Digital Assets', 'Cash & Equivalents'],
                datasets: [{
                    data: [12.4, 87.6], // Actual data but won't be displayed
                    backgroundColor: [
                        'rgb(101, 89, 249)',  // Primary color for digital assets
                        'rgb(156, 163, 175)'  // Gray for cash
                    ],
                    borderColor: [
                        'white',
                        'white'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Hide default legend, using custom one
                    },
                    tooltip: {
                        enabled: false // Disable tooltips to hide data
                    }
                },
                cutout: '60%'
            }
        });
    } catch (error) {
        console.error('Error creating portfolio chart:', error);
        const container = ctx.parentElement;
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #6B7280;">Chart temporarily unavailable</div>';
        }
    }
}

// ===== Transactions Chart =====
function initializeTransactionsChart() {
    const ctx = document.getElementById('transactionsChart');
    if (!ctx) return;

    try {
        // Create pie chart for transaction distribution
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Technology Stocks', 'Digital Assets', 'Healthcare', 'Real Estate', 'ETFs & Other'],
                datasets: [{
                    data: [35, 25, 20, 12, 8], // Approximate distribution based on transaction data
                    backgroundColor: [
                        'rgb(101, 89, 249)',   // Purple for Technology
                        'rgb(59, 130, 246)',   // Blue for Digital Assets
                        'rgb(16, 185, 129)',   // Green for Healthcare
                        'rgb(251, 146, 60)',   // Orange for Real Estate
                        'rgb(156, 163, 175)'   // Gray for ETFs
                    ],
                    borderColor: [
                        'white',
                        'white',
                        'white',
                        'white',
                        'white'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Hide default legend, using custom one
                    },
                    tooltip: {
                        enabled: false // Disable tooltips to hide data
                    }
                },
                cutout: '65%'
            }
        });
    } catch (error) {
        console.error('Error creating transactions chart:', error);
        const container = ctx.parentElement;
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #6B7280;">Chart temporarily unavailable</div>';
        }
    }
}

// ===== Update Metrics =====
function updateMetrics() {
    const metrics = fundData.riskMetrics;
    const performance = fundData.performanceData;

    // Update metric cards
    updateMetric('totalReturn', performance.totalReturn, 'percentage', true);
    updateMetric('sharpeRatio', metrics.sharpe, 'decimal');
    updateMetric('maxDrawdown', metrics.max_drawdown, 'percentage');
    updateMetric('alpha', metrics.alpha, 'percentage', true);

    // Update risk metrics
    updateElement('beta', metrics.beta, 'decimal');
    updateElement('volatility', metrics.volatility, 'percentage');
    updateElement('infoRatio', metrics.info_ratio, 'decimal');
    updateElement('treynorRatio', metrics.treynor, 'decimal');

    // Update portfolio values
    updateElement('totalPortfolioValue', performance.portfolioValue, 'currency');
    updateElement('cashBalance', performance.cashBalance, 'currency');
    updateElement('numHoldings', fundData.currentHoldings.length, 'number');
}

function updateMetric(elementId, value, format, isPositive = null) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let formattedValue;
    switch (format) {
        case 'percentage':
            formattedValue = (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
            break;
        case 'decimal':
            formattedValue = value.toFixed(2);
            break;
        case 'currency':
            formattedValue = '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            break;
        default:
            formattedValue = value.toString();
    }

    element.textContent = formattedValue;

    // Add CSS classes for positive/negative values
    if (format === 'percentage') {
        element.classList.remove('positive', 'negative');
        if (value > 0 || (isPositive !== null && isPositive)) {
            element.classList.add('positive');
        } else if (value < 0) {
            element.classList.add('negative');
        }
    }
}

function updateElement(elementId, value, format) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let formattedValue;
    switch (format) {
        case 'percentage':
            formattedValue = value.toFixed(2) + '%';
            break;
        case 'decimal':
            formattedValue = value.toFixed(2);
            break;
        case 'currency':
            formattedValue = '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            break;
        case 'number':
            formattedValue = value.toString();
            break;
        default:
            formattedValue = value.toString();
    }

    element.textContent = formattedValue;
}

// ===== Portfolio Composition =====
function updatePortfolioComposition() {
    const compositionGrid = document.getElementById('compositionGrid');
    if (!compositionGrid) return;

    const holdings = fundData.currentHoldings;
    compositionGrid.innerHTML = '';

    holdings.forEach(holding => {
        const compositionItem = document.createElement('div');
        compositionItem.className = 'composition-item';
        compositionItem.innerHTML = `
            <div class="comp-label">${holding.symbol}</div>
            <div class="comp-bar">
                <span class="comp-fill" data-color="${holding.type}" style="width: 0%"></span>
            </div>
            <div class="comp-value">${holding.weight.toFixed(1)}%</div>
        `;
        compositionGrid.appendChild(compositionItem);
    });

    // Animate composition bars
    setTimeout(() => {
        document.querySelectorAll('.comp-fill').forEach(bar => {
            const targetWidth = bar.parentElement.nextElementSibling.textContent;
            bar.style.width = targetWidth;
        });
    }, 500);
}

// ===== Holdings Table =====
function updateHoldingsTable() {
    const tbody = document.getElementById('holdingsTableBody');
    if (!tbody) return;

    const holdings = fundData.currentHoldings;
    tbody.innerHTML = '';

    holdings.forEach(holding => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="symbol">${holding.symbol}</td>
            <td>${holding.name}</td>
            <td>${holding.quantity.toLocaleString()}</td>
            <td>$${holding.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="${holding.return >= 0 ? 'positive' : 'negative'}">${holding.return >= 0 ? '+' : ''}${holding.return.toFixed(2)}%</td>
            <td>${holding.weight.toFixed(1)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// ===== Animations =====
function initializeAnimations() {
    // Hero stats animation
    const statValues = document.querySelectorAll('.stat-value');

    const animateValue = (element, start, end, duration, isDecimal = false, isCurrency = false) => {
        const startTime = performance.now();

        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentValue = start + (end - start) * easeOutCubic(progress);

            if (isCurrency) {
                element.textContent = '$' + currentValue.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            } else if (isDecimal) {
                element.textContent = currentValue.toFixed(2);
            } else {
                element.textContent = currentValue.toFixed(2);
            }

            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };

        requestAnimationFrame(updateValue);
    };

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.dataset.target);
                const isDecimal = element.dataset.target < 100;
                const isCurrency = element.dataset.format === 'currency';

                animateValue(element, 0, target, 2000, isDecimal, isCurrency);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statValues.forEach(stat => observer.observe(stat));
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// ===== Scroll Effects =====
function initializeScrollEffects() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => sectionObserver.observe(section));

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// ===== Error Handling =====
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// ===== Utility Functions =====
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercentage(value) {
    return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
}

// ===== Print Functionality =====
window.addEventListener('beforeprint', () => {
    // Hide mobile menu, remove animations for printing
    const mobileMenu = document.querySelector('.nav-links');
    if (mobileMenu) {
        mobileMenu.classList.remove('mobile-active');
    }
});

// ===== Export functions for external use =====
window.HKUCoinFund = {
    loadFundData,
    updateMetrics,
    updatePortfolioComposition,
    updateHoldingsTable
};