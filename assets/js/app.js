// ===== Fund Data Management =====
let fundData = null;

// Load fund data
async function loadFundData() {
    try {
        const response = await fetch('assets/data/fund_data.json');
        fundData = await response.json();
        updateUI();
        createPerformanceChart();
    } catch (error) {
        console.error('Error loading fund data:', error);
    }
}

// ===== UI Updates =====
function updateUI() {
    if (!fundData) return;

    const { performanceData, riskMetrics, currentHoldings } = fundData;

    // Update hero stats
    document.getElementById('hero-return').textContent = formatPercent(performanceData.totalReturn);
    document.getElementById('hero-alpha').textContent = formatPercent(riskMetrics.alpha);
    document.getElementById('hero-sharpe').textContent = riskMetrics.sharpe.toFixed(2);

    // Update performance metrics
    document.getElementById('total-return').textContent = formatPercent(performanceData.totalReturn);
    document.getElementById('portfolio-value').textContent = formatCurrency(performanceData.portfolioValue);
    document.getElementById('sharpe-ratio').textContent = riskMetrics.sharpe.toFixed(2);
    document.getElementById('max-drawdown').textContent = formatPercent(riskMetrics.max_drawdown);
    document.getElementById('volatility').textContent = formatPercent(riskMetrics.volatility);
    document.getElementById('info-ratio').textContent = riskMetrics.info_ratio.toFixed(2);

    // Update portfolio stats
    document.getElementById('port-value').textContent = formatCurrency(performanceData.portfolioValue);
    document.getElementById('cash-value').textContent = formatCurrency(performanceData.cashBalance);
    document.getElementById('market-value').textContent = formatCurrency(performanceData.marketValue);
    document.getElementById('trades-count').textContent = performanceData.tradesCount;

    // Update holdings table
    updateHoldingsTable(currentHoldings);
}

function updateHoldingsTable(holdings) {
    const tbody = document.getElementById('holdings-body');
    tbody.innerHTML = '';

    holdings.forEach(holding => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="symbol">${holding.symbol}</span></td>
            <td>${holding.name}</td>
            <td>${formatNumber(holding.quantity)}</td>
            <td>${formatCurrency(holding.marketValue)}</td>
            <td class="${holding.return >= 0 ? 'positive' : 'negative'}">${formatPercent(holding.return)}</td>
            <td>${holding.weight.toFixed(1)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// ===== Performance Chart =====
function createPerformanceChart() {
    if (!fundData) return;

    const ctx = document.getElementById('performanceChart').getContext('2d');
    const { dates, portfolioValues, benchmarkValues } = fundData.historicalData;

    // Convert to returns (percentage from initial value)
    const portfolioReturns = portfolioValues.map(v => ((v - 1000000) / 1000000) * 100);
    const benchmarkReturns = benchmarkValues.map(v => ((v - 1000000) / 1000000) * 100);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'HKU Coin Fund',
                    data: portfolioReturns,
                    borderColor: 'rgb(101, 89, 249)',
                    backgroundColor: 'rgba(101, 89, 249, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Benchmark (90% SPY + 10% SHY)',
                    data: benchmarkReturns,
                    borderColor: 'rgb(156, 163, 175)',
                    backgroundColor: 'rgba(156, 163, 175, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.8,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Inter',
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toFixed(2) + '%';
                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Performance Comparison (September 2025)',
                    font: {
                        family: 'Inter',
                        size: 16,
                        weight: '600'
                    },
                    padding: {
                        bottom: 20
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
                            family: 'Inter',
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ===== Helper Functions =====
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercent(value) {
    const sign = value >= 0 ? '+' : '';
    return sign + value.toFixed(2) + '%';
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

// ===== Navigation =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    // Smooth scroll on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }
}

// ===== Prospectus Download =====
function setupProspectusDownload() {
    const downloadBtn = document.getElementById('download-prospectus');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a simple prospectus document
            const prospectusContent = `
HKU COIN FUND - SUMMARY PROSPECTUS

Fund Information (as of September 26, 2025)
============================================

PERFORMANCE
-----------
Total Return: ${fundData ? fundData.performanceData.totalReturn : 'N/A'}%
Portfolio Value: ${fundData ? formatCurrency(fundData.performanceData.portfolioValue) : 'N/A'}
Benchmark Return: ${fundData ? fundData.performanceData.benchmarkReturn : 'N/A'}%

RISK METRICS
------------
Sharpe Ratio: ${fundData ? fundData.riskMetrics.sharpe : 'N/A'}
Alpha: ${fundData ? fundData.riskMetrics.alpha : 'N/A'}%
Beta: ${fundData ? fundData.riskMetrics.beta : 'N/A'}
Max Drawdown: ${fundData ? fundData.riskMetrics.max_drawdown : 'N/A'}%
Volatility: ${fundData ? fundData.riskMetrics.volatility : 'N/A'}%

FEES
----
Management Fee: 1.75% per annum
Performance Fee: 20% of outperformance vs. benchmark
Total Annual Expenses: ~2.3%

INVESTMENT STRATEGY
-------------------
The fund employs an actively managed core-satellite strategy designed to 
outperform the benchmark. Core allocation emphasizes quality large-cap 
equities to capture broad market beta, while satellite positions in tactical 
opportunities seek to generate alpha.

RISK DISCLOSURES
----------------
An investment in the Fund involves risk, including the possible loss of 
principal. Past performance does not guarantee future results. Digital 
assets are highly speculative and subject to extreme price volatility.

For more information:
Email: invest@hkucoin.fund
Website: https://hkucoin.fund

© 2025 HKU Coin Fund. All rights reserved.
            `.trim();

            // Create and download the file
            const blob = new Blob([prospectusContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'HKUCoinFund_Prospectus.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
    }
}

// ===== Scroll Animations =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.metric-card, .strategy-card, .fee-card, .summary-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadFundData();
    setupNavigation();
    setupProspectusDownload();
    setupScrollAnimations();
});

// ===== Update timestamp =====
function updateAsOfDate() {
    if (fundData && fundData.asOfDate) {
        const dateElements = document.querySelectorAll('.as-of-date');
        dateElements.forEach(el => {
            el.textContent = `As of ${fundData.asOfDate}`;
        });
    }
}

// Recalculate chart on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const chartCanvas = document.getElementById('performanceChart');
        if (chartCanvas && fundData) {
            Chart.getChart(chartCanvas)?.destroy();
            createPerformanceChart();
        }
    }, 250);
});
