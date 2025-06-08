# 資料庫遷移指南：從 localStorage 到 Supabase

## 為什麼要遷移到資料庫？

### localStorage 的限制：
- ❌ 只能在單一瀏覽器使用
- ❌ 清除瀏覽器數據會丟失所有記錄
- ❌ 無法跨設備同步
- ❌ 沒有備份機制
- ❌ 無法分享或協作

### Supabase 的優勢：
- ✅ 跨設備同步
- ✅ 雲端備份
- ✅ 即時更新
- ✅ 用戶認證
- ✅ 數據安全
- ✅ 可擴展性

## 資料庫架構設計

### 1. 用戶表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. 題目表 (problems)
```sql
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  leetcode_id TEXT NOT NULL, -- LeetCode 題目編號 (如 "1", "242")
  name TEXT NOT NULL,
  url TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  tags TEXT[], -- PostgreSQL 陣列類型
  solution TEXT, -- 用戶的解題代碼
  notes TEXT, -- 用戶筆記
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, leetcode_id) -- 每個用戶不能重複添加同一題
);
```

### 3. 複習記錄表 (review_sessions)
```sql
CREATE TABLE review_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5), -- 用戶評估的難度
  time_spent INTEGER, -- 花費時間（秒）
  notes TEXT -- 這次複習的筆記
);
```

### 4. 複習計劃表 (review_schedules)
```sql
CREATE TABLE review_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  review_number INTEGER NOT NULL, -- 第幾次複習 (1-7)
  scheduled_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(problem_id, review_number)
);
```

## 實作步驟

### 步驟 1：設置 Supabase 項目

1. 前往 [supabase.com](https://supabase.com) 註冊帳號
2. 創建新項目
3. 在 SQL Editor 中執行上述 SQL 創建表格
4. 設置 Row Level Security (RLS) 政策

### 步驟 2：安裝依賴

```bash
npm install @supabase/supabase-js
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 步驟 3：環境配置

創建 `.env.local` 文件：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 步驟 4：創建 Supabase 客戶端

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 類型定義
export interface Problem {
  id: string
  user_id: string
  leetcode_id: string
  name: string
  url?: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  solution?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ReviewSession {
  id: string
  problem_id: string
  user_id: string
  reviewed_at: string
  difficulty_rating?: number
  time_spent?: number
  notes?: string
}

export interface ReviewSchedule {
  id: string
  problem_id: string
  user_id: string
  review_number: number
  scheduled_date: string
  completed_at?: string
  created_at: string
}
```

### 步驟 5：創建數據服務

```typescript
// lib/problemService.ts
import { supabase } from './supabase'
import type { Problem, ReviewSchedule } from './supabase'

export class ProblemService {
  // 獲取用戶的所有題目
  static async getUserProblems(userId: string): Promise<Problem[]> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // 添加新題目
  static async addProblem(problem: Omit<Problem, 'id' | 'created_at' | 'updated_at'>): Promise<Problem> {
    const { data, error } = await supabase
      .from('problems')
      .insert(problem)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 更新題目
  static async updateProblem(id: string, updates: Partial<Problem>): Promise<Problem> {
    const { data, error } = await supabase
      .from('problems')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 刪除題目
  static async deleteProblem(id: string): Promise<void> {
    const { error } = await supabase
      .from('problems')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // 獲取複習計劃
  static async getReviewSchedules(problemId: string): Promise<ReviewSchedule[]> {
    const { data, error } = await supabase
      .from('review_schedules')
      .select('*')
      .eq('problem_id', problemId)
      .order('review_number')

    if (error) throw error
    return data || []
  }

  // 創建複習計劃
  static async createReviewSchedule(schedules: Omit<ReviewSchedule, 'id' | 'created_at'>[]): Promise<void> {
    const { error } = await supabase
      .from('review_schedules')
      .insert(schedules)

    if (error) throw error
  }

  // 完成複習
  static async completeReview(scheduleId: string): Promise<void> {
    const { error } = await supabase
      .from('review_schedules')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', scheduleId)

    if (error) throw error
  }
}
```

### 步驟 6：數據遷移腳本

```typescript
// lib/migration.ts
import { supabase } from './supabase'
import { ProblemService } from './problemService'

export async function migrateFromLocalStorage(userId: string) {
  try {
    // 從 localStorage 讀取現有數據
    const localProblems = localStorage.getItem('problems')
    if (!localProblems) return

    const problems = JSON.parse(localProblems)
    
    for (const problem of problems) {
      // 轉換數據格式
      const dbProblem = {
        user_id: userId,
        leetcode_id: problem.id,
        name: problem.name,
        url: problem.url,
        difficulty: problem.difficulty,
        tags: problem.tags,
        solution: problem.solution,
        notes: problem.notes || ''
      }

      // 添加到資料庫
      const savedProblem = await ProblemService.addProblem(dbProblem)

      // 如果有複習計劃，也要遷移
      if (problem.reviewSchedule && problem.reviewSchedule.length > 0) {
        const schedules = problem.reviewSchedule.map((date: string, index: number) => ({
          problem_id: savedProblem.id,
          user_id: userId,
          review_number: index + 1,
          scheduled_date: date
        }))

        await ProblemService.createReviewSchedule(schedules)
      }
    }

    // 遷移完成後清除 localStorage
    localStorage.removeItem('problems')
    console.log('數據遷移完成！')
    
  } catch (error) {
    console.error('數據遷移失敗：', error)
  }
}
```

## Row Level Security (RLS) 政策

在 Supabase 中設置安全政策：

```sql
-- 啟用 RLS
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_schedules ENABLE ROW LEVEL SECURITY;

-- 用戶只能看到自己的數據
CREATE POLICY "Users can view own problems" ON problems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own problems" ON problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own problems" ON problems
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own problems" ON problems
  FOR DELETE USING (auth.uid() = user_id);

-- 複習記錄的政策
CREATE POLICY "Users can manage own review sessions" ON review_sessions
  FOR ALL USING (auth.uid() = user_id);

-- 複習計劃的政策
CREATE POLICY "Users can manage own review schedules" ON review_schedules
  FOR ALL USING (auth.uid() = user_id);
```

## 遷移時間表

### 階段 1：基礎設置 (1-2 天)
- 設置 Supabase 項目
- 創建資料庫表格
- 安裝依賴和配置

### 階段 2：核心功能 (2-3 天)
- 實作用戶認證
- 創建數據服務
- 替換 localStorage 邏輯

### 階段 3：進階功能 (1-2 天)
- 數據遷移腳本
- 即時同步
- 錯誤處理

### 階段 4：測試和優化 (1 天)
- 測試所有功能
- 性能優化
- 用戶體驗改進

## 預期效益

遷移完成後，你的應用將具備：
- 🔐 用戶認證和數據隔離
- 🌐 跨設備同步
- 💾 雲端備份
- ⚡ 即時更新
- 📊 更豐富的數據分析可能性
- 🚀 更好的擴展性

你覺得這個遷移計劃如何？需要我開始實作任何部分嗎？ 