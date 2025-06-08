# GitHub Pages 部署指南

## 自動部署設置

1. **推送代碼到 GitHub**：
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **啟用 GitHub Pages**：
   - 前往你的 GitHub 倉庫
   - 點擊 "Settings" 標籤
   - 在左側選單中找到 "Pages"
   - 在 "Source" 下選擇 "GitHub Actions"

3. **配置子路徑（如果需要）**：
   如果你的倉庫名稱不是 `username.github.io`，你需要修改 `next.config.js`：
   
   ```javascript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     basePath: '/your-repo-name',        // 取消註釋並修改
     assetPrefix: '/your-repo-name/',    // 取消註釋並修改
     images: {
       unoptimized: true,
     },
   }
   ```

## 手動部署

如果你想手動部署：

```bash
# 構建專案
npm run build

# 部署到 gh-pages 分支（需要先安裝 gh-pages）
npm install -g gh-pages
gh-pages -d out
```

## 故障排除

### 問題：點擊題目連結時出現 404 錯誤

**解決方案**：
1. 確保 `next.config.js` 中的 `basePath` 和 `assetPrefix` 設置正確
2. 確保 GitHub Pages 設置為使用 GitHub Actions 作為來源
3. 檢查 `.github/workflows/deploy.yml` 是否正確配置

### 問題：CSS 或 JavaScript 檔案載入失敗

**解決方案**：
1. 確保 `assetPrefix` 設置正確
2. 確保 `public/.nojekyll` 檔案存在

### 問題：動態路由不工作

**解決方案**：
1. 確保 `generateStaticParams` 函數返回了足夠的預設 ID
2. 確保 `trailingSlash: true` 在 `next.config.js` 中設置

## 本地測試靜態導出

```bash
# 構建靜態檔案
npm run build

# 使用簡單的 HTTP 伺服器測試
npx serve out
```

## 注意事項

- 靜態導出不支援伺服器端功能（如 API 路由）
- 所有數據都儲存在瀏覽器的 localStorage 中
- 首次載入可能需要一些時間來載入 Python 執行環境（Pyodide） 