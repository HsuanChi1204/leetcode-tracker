# 新功能說明

## 🔍 改進的搜尋功能

### 支援多種搜尋方式：
1. **題目名稱搜尋**：輸入題目名稱的任何部分
2. **題目號碼搜尋**：支援以下格式
   - `1` - 直接輸入題目號碼
   - `#1` - 使用 # 前綴
   - `leetcode 1` - 包含 leetcode 關鍵字
3. **標籤搜尋**：輸入任何標籤名稱（如 Array, String, Dynamic Programming）

### 搜尋結果排序：
- 完全匹配的題目號碼優先顯示
- 名稱匹配次之
- 標籤匹配最後

### 擴展的題目數據庫：
現在包含超過 **200+ LeetCode 題目**，涵蓋所有主要類別：
- **Array & Hashing**：Two Sum, Contains Duplicate, Valid Anagram 等
- **Two Pointers**：Valid Palindrome, 3Sum, Container With Most Water 等
- **Sliding Window**：Best Time to Buy and Sell Stock, Longest Substring Without Repeating Characters 等
- **Stack**：Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation 等
- **Binary Search**：Binary Search, Search in Rotated Sorted Array 等
- **Linked List**：Reverse Linked List, Merge Two Sorted Lists, LRU Cache 等
- **Trees**：Invert Binary Tree, Maximum Depth of Binary Tree, Binary Tree Level Order Traversal 等
- **Tries**：Implement Trie, Word Search II 等
- **Heap/Priority Queue**：Kth Largest Element, Find Median from Data Stream 等
- **Backtracking**：Subsets, Combination Sum, Permutations, N-Queens 等
- **Graphs**：Number of Islands, Clone Graph, Course Schedule 等
- **Dynamic Programming**：Climbing Stairs, House Robber, Longest Common Subsequence 等
- **Greedy**：Maximum Subarray, Jump Game, Gas Station 等
- **Intervals**：Merge Intervals, Meeting Rooms 等
- **Math & Geometry**：Happy Number, Spiral Matrix, Rotate Image 等
- **Bit Manipulation**：Single Number, Counting Bits 等

### 使用範例：
```
搜尋 "sum" → 會找到 Two Sum, 3Sum, Combination Sum, Target Sum 等多個題目
搜尋 "1" → 會找到 Two Sum (#1)
搜尋 "#242" → 會找到 Valid Anagram (#242)
搜尋 "array" → 會找到所有包含 Array 標籤的題目
搜尋 "dynamic programming" → 會找到所有 DP 相關題目
```

## 📅 完整複習時間表管理

### 複習曲線設定：
- **第1次複習**：+1天
- **第2次複習**：+3天  
- **第3次複習**：+7天
- **第4次複習**：+14天
- **第5次複習**：+30天
- **第6次複習**：+60天
- **第7次複習**：+120天

### 功能特色：

#### 1. 自動生成複習時間表
- 新增題目時自動生成完整的7次複習時間表
- 基於科學的間隔重複學習法

#### 2. 視覺化顯示
- 在題目詳情頁面顯示完整的複習時間表
- 清楚標示每次複習的間隔天數
- 響應式網格佈局，適應不同螢幕尺寸

#### 3. 手動調整功能
- 在題目詳情頁面可以直接編輯每次複習的日期
- 支援個別調整每次複習的日期
- 一鍵生成新的複習時間表

#### 4. 智能分類
- **Problems to Review**：顯示需要複習的題目
- **Completed Problems**：顯示已完成的題目
- 點擊題目名稱進入詳情頁面查看和編輯複習時間表

### 使用方法：

#### 查看複習時間表：
1. 點擊題目名稱或 "Review" 按鈕進入題目詳情頁面
2. 在詳情頁面可以看到 "Review Schedule" 區域
3. 顯示7次複習的完整日期和間隔

#### 編輯複習時間表：
1. 在題目詳情頁面的 "Review Schedule" 區域
2. 直接點擊日期輸入框修改每次複習的日期
3. 修改會自動保存到本地儲存
4. 如果沒有時間表，點擊 "Generate Review Schedule" 按鈕

#### 完成複習：
1. 點擊 "Review" 按鈕進入題目詳細頁面
2. 編寫或檢視解決方案
3. 點擊 "Complete Review" 完成複習
4. 系統會自動更新複習計數和下次複習日期

## 🎯 使用建議

### 最佳實踐：
1. **新增題目後立即檢查複習時間表**，確保日期符合你的學習計劃
2. **定期調整複習日期**，根據個人學習進度和難度
3. **利用搜尋功能快速找到題目**，支援多種搜尋方式
4. **按時完成複習**，維持學習的連續性

### 學習策略：
1. **第一次學習**：理解題目和解法
2. **第二次複習**：鞏固記憶，嘗試不同解法
3. **後續複習**：快速回顧，確保長期記憶

## 🔧 技術特色

- **本地儲存**：所有數據保存在瀏覽器 localStorage
- **響應式設計**：支援桌面和移動設備
- **即時更新**：修改後立即保存和顯示
- **智能搜尋**：多維度搜尋和相關性排序 