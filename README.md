# NVT Magic Block - Visual Prompt Engineering Platform

一個基於 Blockly 的視覺化 AI Prompt 生成器，讓提示詞工程變得簡單、可視化、可分享。

## 專案簡介

這是一個創新的企業級工具，旨在解決以下痛點：
- Prompt 難以重用和分享
- 非技術人員難以掌握 Prompt Engineering
- 優質提示詞無法成為企業知識資產

## 核心特色

### 🎨 視覺化 Prompt 建構
- 使用拖拽積木的方式組合 AI 提示詞
- 降低學習門檻，ADM/非技術人員也能輕鬆使用
- 即時預覽生成的 Prompt

### 🧩 6種 AI 專用積木

1. **Persona Block（角色積木）**
   - 定義 AI 的角色與專業領域
   - 設定語氣風格（專業嚴謹、親切友善、簡潔直接）
   - 範例：資深程式專家、財經分析師、產品UX顧問

2. **Task Block（任務積木）**
   - 清楚描述要完成的任務
   - 支援詳細說明與情境輸入

3. **Context Block（情境積木）**
   - 提供必要的背景資訊或輸入資料
   - 幫助 AI 更準確理解需求

4. **Constraint Block（限制條件積木）**
   - 使用條列式輸出
   - 不使用行銷語言
   - 設定字數限制
   - 選擇輸出語言（繁中/簡中/英文）

5. **Output Format Block（輸出格式積木）**
   - 標題+摘要+建議
   - JSON
   - Markdown
   - 表格
   - 純文字

6. **Optimizer Block（提示詞優化積木）**
   - 使用 AI 自動優化你的 Prompt
   - 雙階段 AI 處理，提升提示詞品質

### 💾 模板管理功能

- **儲存模板**：將常用的 Prompt 組合儲存為模板
- **載入模板**：快速重用之前建立的模板
- **分享功能**：透過 XML 分享給團隊成員
- **版本控管**：基於 XML 格式，易於追蹤變更

### 🔗 NovaLLM API 整合

- 一鍵執行生成的 Prompt
- 即時顯示 AI 回應結果
- 記錄執行時間
- 提供回饋機制（好用/不準確）

## 技術架構

- **前端框架**：React + TypeScript + Vite
- **視覺化引擎**：Blockly
- **樣式**：Tailwind CSS
- **資料儲存**：本地 JSON 檔案 API（可放在 Windows 本機磁碟或網域共享資料夾）
- **AI API**：NovaLLM（公司內部 API）

## 快速開始

### 環境設定

1. 複製 `.env.example` 為 `.env`
2. 設定必要的環境變數：

```bash
VITE_TEMPLATE_API_URL=http://localhost:3030
VITE_NOVALLM_API_URL=your_novallm_api_url
VITE_NOVALLM_API_KEY=your_novallm_api_key
```

3. 可選擇建立 `.env.local`（給本地資料庫 API）

```bash
LOCAL_DB_PORT=3030
# Windows 本機範例
LOCAL_DB_PATH=D:/NVTData/local-db.json
# Windows 網域共享範例（UNC 路徑）
# LOCAL_DB_PATH=\\fileserver\team-share\nvt-magic-block\local-db.json
```

### 安裝與執行

```bash
# 安裝依賴
npm install

## 啟動本地資料庫 API（建議先啟動）
npm run dev:db

# 另開一個終端機，啟動前端
npm run dev

# 建置正式版本
npm run build
```

## 使用方式

### 基本流程

1. **拖曳積木**：從左側工具箱拖曳所需的 AI 積木到工作區
2. **組合 Prompt**：設定每個積木的參數，組合成完整的提示詞
3. **預覽調整**：在右上方的 Prompt 區域預覽並手動微調
4. **執行測試**：點擊「執行」按鈕，查看 AI 回應
5. **儲存分享**：滿意後可儲存為模板或分享給團隊

### 實用範例

#### 範例1：程式碼審查助手

```
🎭 Persona: 資深程式專家
   - 專長領域: Code Review
   - 語氣: 專業嚴謹

📋 任務: 請審查以下程式碼並提供改進建議

📝 情境/輸入資料: {程式碼}

⚠️ 限制條件:
   ✓ 使用條列式
   - 字數限制: 500

📤 輸出格式: 標題+摘要+建議
```

#### 範例2：會議紀錄整理

```
🎭 Persona: 專業會議記錄員
   - 語氣: 簡潔直接

📋 任務: 將會議內容整理成結構化的會議紀錄

⚠️ 限制條件:
   ✓ 使用條列式
   - 語言: 繁體中文

📤 輸出格式: Markdown
```

## 競賽優勢分析

### 創新性（30%）⭐⭐⭐⭐⭐

- **逆向思維**：用 Blockly 組 Prompt，而非 AI 生成 Blockly
- **雙階段 AI**：Prompt Optimizer 使用 AI 優化提示詞
- **視覺化工程**：將抽象的 Prompt Engineering 具象化

### 可行性（30%）⭐⭐⭐⭐⭐

- **技術成熟**：基於 Blockly 與 React 等成熟技術
- **快速部署**：可立即在企業內部使用
- **低學習成本**：直覺的拖拽介面

### 實用性（40%）⭐⭐⭐⭐⭐

- **解決真實痛點**：Prompt 難以重用、分享、版本控管
- **全員適用**：ADM、PM、QA、工程師都能使用
- **知識累積**：優質 Prompt 成為企業資產

## 未來擴展

### 企業級功能

- [ ] **積木市集**：公司內部的 Prompt 模板市場
  - 官方推薦積木
  - 部門共享
  - 熱門排行

- [ ] **進階版本控管**：Git-like 的 Prompt 版本管理

- [ ] **成效追蹤**：記錄每個 Prompt 的使用率與滿意度

- [ ] **團隊協作**：多人編輯、評論、審核機制

### 技術優化

- [ ] **自定義積木生成器**：讓使用者可以建立自己的專用積木
- [ ] **任務串連 Pipeline**：前一任務的結果作為下一任務的輸入
- [ ] **變數系統**：支援更複雜的資料傳遞
- [ ] **Prompt 範本庫**：預設多種產業常用範本

## 本地資料庫格式（JSON）

資料會儲存在 `LOCAL_DB_PATH` 指定的檔案，例如：

```json
{
  "templates": [
    {
      "id": "tpl_1737612345678",
      "name": "QA Log 分析",
      "xml": "<xml>...</xml>",
      "prompt": "你是資深QA工程師...",
      "savedAt": "2026-01-23T12:34:56.789Z",
      "updatedAt": "2026-01-23T12:34:56.789Z"
    }
  ]
}
```

> 若前端無法連上 API，會自動退回瀏覽器 `localStorage` 儲存模式。

## 演示腳本（競賽用）

**情境**：QA 工程師要分析測試 log

1. 拖曳 Persona 積木 → 設定為「資深 QA 工程師」
2. 拖曳 Task 積木 → 輸入「分析測試 log」
3. 拖曳 Context 積木 → 貼上 log 內容
4. 拖曳 Constraint 積木 → 勾選「使用條列式」
5. 拖曳 Output 積木 → 選擇「標題+摘要+建議」
6. 點擊「執行」→ 展示 AI 回應
7. 點擊「儲存」→ 命名為「QA Log 分析」
8. 點擊「分享」→ 展示 XML 分享功能

**一句話總結**：
> 我們不是教大家怎麼寫 Prompt，而是讓 Prompt 變成積木，變成公司的共同語言。

## 授權

MIT License

---

**打造企業級 Visual Prompt OS，讓 AI 提示詞成為可管理的知識資產！**
