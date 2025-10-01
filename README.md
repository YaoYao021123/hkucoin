# HKU Coin Fund - Investment Fund Website

[![Live Website](https://img.shields.io/badge/🌐-Live_Website-blue?style=for-the-badge&logo=github-pages)](https://yaoyao021123.github.io/hkucoin/)

## 🚀 **访问我们的网站**

<div align="center">

[**🌟 HKUCoin Fund 官网 🌟**](https://yaoyao021123.github.io/hkucoin/)

**专业的数字资产管理基金**
- 实时业绩展示
- 历史交易分析
- 透明费用结构
- 响应式设计

[**点击访问 →**](https://yaoyao021123.github.io/hkucoin/)

</div>

---

Professional fund website showcasing performance, portfolio holdings, and investment strategy.

## 📊 Features

- **Real-time Performance Metrics**: Display fund performance vs. benchmark with interactive charts
- **Portfolio Dashboard**: Current holdings, composition, and detailed analytics
- **Investment Strategy**: Core-satellite approach with risk management framework
- **Fee Transparency**: Clear breakdown of management and performance fees
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3 (Custom design with CSS Grid & Flexbox)
- **JavaScript**: Vanilla JS with Chart.js for data visualization
- **Data**: JSON-based fund data from Python analytics
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
website/
├── index.html              # Main website file
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles with CSS variables
│   ├── js/
│   │   └── app.js          # Data loading and interactivity
│   ├── data/
│   │   └── fund_data.json  # Fund performance data
│   └── images/
│       └── logo.png        # HKU Coin logo
└── README.md
```

## 🎨 Design

- **Primary Color**: `rgb(101, 89, 249)` - Brand purple
- **Typography**: Inter font family
- **Components**: Modern cards, smooth animations, and hover effects
- **Theme**: Professional financial services aesthetic

## 📈 Data

Fund data is calculated from:
- Historical portfolio values (Sep 2-26, 2025)
- Daily price data for SPY, SHY, and portfolio holdings
- Performance metrics: Sharpe ratio, Alpha, Beta, Max drawdown
- Current positions and cash holdings

## 🛠️ Development

### Local Development

Simply open `index.html` in a modern web browser:

```bash
# Using Python
cd website
python3 -m http.server 8000

# Using Node.js
npx http-server
```

Then visit: http://localhost:8000

### Updating Data

To update fund data:

1. Run the Python calculation script:
   ```bash
   cd ../
   python3 calculate_metrics.py
   ```

2. The script will update `website/assets/data/fund_data.json`

3. Refresh the website to see updated data

## 🌐 Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to GitHub and create a new repository named `hku-coin-fund`
2. Don't initialize with README (we already have one)

### Step 2: Push to GitHub

```bash
cd website
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hku-coin-fund.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository Settings
2. Navigate to "Pages" section
3. Under "Source", select `main` branch
4. Select `/` (root) as the folder
5. Click "Save"

Your website will be available at:
`https://yaoyao021123.github.io/hkucoin/`

## 📊 Fund Performance Snapshot

As of September 26, 2025:

- **Total Return**: +17.53%
- **Benchmark Return**: +3.31%
- **Alpha Generated**: +12.6%
- **Sharpe Ratio**: 0.83
- **Max Drawdown**: -1.67%
- **Portfolio Value**: $1,175,347.28

## ⚠️ Important Disclaimers

**Investment Risk**: An investment in the Fund involves risk, including the possible loss of principal.

**Past Performance**: Past performance does not guarantee future results.

**Digital Assets**: Digital assets are highly speculative and subject to extreme price volatility and regulatory risks.

**Not FDIC Insured** — **No Bank Guarantee** — **May Lose Value**

## 📧 Contact

For inquiries: invest@hkucoin.fund

---

© 2025 HKU Coin Fund. All rights reserved.

