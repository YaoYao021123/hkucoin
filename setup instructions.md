# GitHub Pages 设置说明

## 当前状态
- 代码已准备好
- GitHub Actions工作流已配置
- 网站文件完整

## 两种部署方案

### 方案1：使用现有仓库（推荐）
仓库：https://github.com/YaoYao021123/hkucoin
网站：https://yaoyao021123.github.io/hkucoin/

**手动设置步骤**：
1. 访问：https://github.com/YaoYao021123/hkucoin/settings/pages
2. 配置：
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
3. 点击 Save

### 方案2：用户站点
仓库：https://github.com/YaoYao021123/YaoYao021123.github.io
网站：https://yaoyao021123.github.io/

**创建步骤**：
1. 访问：https://github.com/new
2. 仓库名：YaoYao021123.github.io
3. Public，不初始化
4. 创建后推送代码

## 推送命令（方案2）
```bash
cd website
git remote set-url origin https://github.com/YaoYao021123/YaoYao021123.github.io.git
git push -u origin main
```