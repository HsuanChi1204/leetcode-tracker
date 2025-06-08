# 故障排除指南

## 動態路由錯誤

### 問題描述
當新增題目後點擊題目詳情頁面時，出現以下錯誤：
```
Server Error
Error: Page "/problem/[id]/page" is missing param "/problem/242" in "generateStaticParams()", which is required with "output: export" config.
```

### 原因分析
這個錯誤是因為 Next.js 的靜態導出配置（`output: 'export'`）要求所有動態路由的參數都必須在構建時通過 `generateStaticParams` 函數預先定義。當用戶動態添加新題目時，新的 ID 沒有在預定義列表中，因此會出現錯誤。

### 解決方案
我們已經修復了 `src/app/problem/[id]/page.tsx` 中的 `generateStaticParams` 函數：

1. **自動導入所有 LeetCode 題目 ID**：從 `leetcodeProblems.ts` 中獲取所有預定義的題目 ID
2. **添加大範圍的數字 ID**：生成 1-3000 的數字 ID 以支持手動添加的題目
3. **去重處理**：確保沒有重複的 ID

### 技術細節
```typescript
export async function generateStaticParams() {
  // 導入 LeetCode 題目數據
  const { problems } = await import('../../../data/leetcodeProblems');
  
  // 獲取所有 LeetCode 題目的 ID
  const leetcodeIds = problems.map(problem => problem.id);
  
  // 添加一些常見的數字 ID 範圍以支持手動添加的題目
  const commonIds = Array.from({ length: 3000 }, (_, i) => (i + 1).toString());
  
  // 合併所有 ID 並去重
  const combinedIds = [...leetcodeIds, ...commonIds];
  const allIds = Array.from(new Set(combinedIds));
  
  return allIds.map((id) => ({
    id: id,
  }));
}
```

### 構建結果
修復後，構建過程會生成 3000+ 個靜態頁面，涵蓋：
- 所有預定義的 LeetCode 題目（200+ 個）
- 數字 ID 1-3000 的範圍
- 支持大部分手動添加的題目場景

### 注意事項
1. **時間戳 ID**：如果手動添加的題目使用時間戳作為 ID（非常大的數字），可能仍會遇到問題
2. **構建時間**：生成大量靜態頁面會增加構建時間，但確保了更好的兼容性
3. **替代方案**：如果不需要靜態導出，可以移除 `next.config.js` 中的 `output: 'export'` 配置

### 驗證修復
運行以下命令確認修復有效：
```bash
npm run build
```

如果構建成功且沒有錯誤，說明修復生效。 