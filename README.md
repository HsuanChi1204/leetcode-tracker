# LeetCode Practice Tracker

一個簡單的 LeetCode 刷題追蹤系統，幫助您管理每日刷題和複習計劃。

A simple LeetCode practice tracking system to help you manage your daily coding practice and review schedule.

## 功能 Features

- 新增題目記錄 Add new problems
- 設置複習提醒 Set review reminders
- 查看今日需要複習的題目 View problems due for review today
- 本地存儲數據 Local data storage
- 簡單易用的界面 Simple and intuitive interface

## 安裝 Installation

```bash
# 安裝依賴 Install dependencies
npm install

# 啟動開發服務器 Start development server
npm run dev
```

## 使用說明 Usage

1. 新增題目 Add a problem:
   - 輸入題目名稱 Enter problem name
   - 輸入 LeetCode 網址 Enter LeetCode URL
   - 選擇難度 Select difficulty level

2. 複習管理 Review management:
   - 系統會自動顯示今日需要複習的題目 The system will automatically show problems due for review today
   - 完成複習後點擊"完成複習"按鈕 Click "Complete Review" after reviewing
   - 系統會自動設置下次複習時間為 7 天後 The system will automatically set the next review date to 7 days later

3. 查看所有題目 View all problems:
   - 點擊"查看所有題目"按鈕 Click "View All Problems" button
   - 可以查看所有已記錄的題目 View all recorded problems
   - 可以刪除不需要的題目 Delete unwanted problems

## 技術棧 Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Local Storage

## 注意事項 Notes

- 所有數據都存儲在瀏覽器的本地存儲中 All data is stored in browser's local storage
- 更換瀏覽器或清除瀏覽器數據會導致數據丟失 Changing browsers or clearing browser data will result in data loss
- 建議定期導出數據備份 It is recommended to regularly export data for backup 