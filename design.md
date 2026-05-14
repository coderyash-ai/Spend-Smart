# SpendSmart Design Document

## Overview
SpendSmart is a mobile expense tracker with **glassmorphism** as the primary design language. Every screen features frosted glass effects, semi-transparent surfaces, and blur backgrounds to create a modern, cohesive visual experience. All screens are seamlessly connected through a unified navigation flow.

## Design Principles
- **Glassmorphism First**: Every card, button, and surface uses frosted glass effects with transparency and blur
- **One-Handed Usage**: All interactive elements positioned within thumb reach (bottom 60% of screen)
- **Seamless Navigation**: All screens connected end-to-end; no dead ends
- **iOS HIG Alignment**: Follows Apple's Human Interface Guidelines for native feel
- **Portrait Orientation (9:16)**: Mobile-first design

## Color Palette
- **Primary**: `#0a7ea4` (Teal) - Accent for income, positive actions
- **Accent**: `#FF6B6B` (Coral Red) - Expense, negative values
- **Background**: `#F8F9FA` (Light) / `#0F1419` (Dark) - Base layer
- **Glass Surface**: `rgba(255, 255, 255, 0.1)` (Light) / `rgba(255, 255, 255, 0.05)` (Dark) - Glassmorphism base
- **Glass Border**: `rgba(255, 255, 255, 0.2)` (Light) / `rgba(255, 255, 255, 0.1)` (Dark) - Glass edge definition
- **Text Primary**: `#11181C` (Light) / `#ECEDEE` (Dark)
- **Text Secondary**: `#687076` (Light) / `#9BA1A6` (Dark)

## Screen List

### 1. Dashboard (Home)
**Purpose**: Overview of spending, budget status, and quick insights
**Content**:
- Header: "SpendSmart" with profile icon (glassmorphic)
- Current Month Summary Card (glass):
  - Total Income (green badge)
  - Total Expense (red badge)
  - Net Balance (prominent)
- Monthly Budget Card (glass):
  - Budget limit
  - Spent amount with progress bar (glass)
  - Remaining amount
- Charts Section (glass containers):
  - Pie Chart: Spending by category (interactive, tap to filter)
  - Bar Chart: Weekly spending trend (7 days)
- Quick Action Buttons (glass):
  - Add Transaction (floating action)
  - View All Transactions
- Navigation: Tab bar at bottom (glass style)

### 2. Transactions Screen
**Purpose**: View, add, edit, delete all transactions
**Content**:
- Header: "Transactions" with search icon
- Filter Chips (glass): All, Income, Expense, Category filters
- Transaction List (glass cards):
  - Category icon + name
  - Amount (green for income, red for expense)
  - Date
  - Swipe to delete / tap to edit
- Add Transaction Button (floating action, glass)
- Empty State: "No transactions yet" with add button

### 3. Add/Edit Transaction Modal
**Purpose**: Create or modify a transaction
**Content**:
- Header: "New Transaction" / "Edit Transaction"
- Type Toggle (glass): Income / Expense
- Amount Input (glass): Numeric keyboard
- Category Picker (glass dropdown):
  - Income: Salary, Bonus, Refund, Other
  - Expense: Food, Transport, Bills, Entertainment, Shopping, Health, Other
- Date Picker (glass): Calendar or date input
- Notes Input (glass): Optional text field
- Action Buttons (glass):
  - Save (primary, teal)
  - Cancel (secondary, muted)

### 4. Budget Screen
**Purpose**: Set and track monthly budget
**Content**:
- Header: "Monthly Budget"
- Current Budget Card (glass):
  - Budget amount (editable)
  - Spent so far
  - Remaining (color-coded: green if safe, yellow if warning, red if exceeded)
  - Circular progress indicator (glass)
- Budget by Category (glass cards):
  - Category name
  - Category budget (if set)
  - Spent in category
  - Progress bar
- Edit Budget Button (glass)
- Reset Button (glass, secondary)

### 5. Search & Filter Screen
**Purpose**: Find and filter transactions
**Content**:
- Header: "Search Transactions"
- Search Bar (glass): By description/note
- Filter Options (glass):
  - Date Range: From / To (date pickers)
  - Category: Multi-select (glass chips)
  - Amount Range: Min / Max (numeric inputs)
  - Type: Income / Expense toggle
- Results List (glass cards):
  - Matching transactions
  - Tap to view/edit
- Clear Filters Button (glass, secondary)
- Export Results Button (glass)

### 6. Export Screen
**Purpose**: Export data as CSV or PDF
**Content**:
- Header: "Export Data"
- Export Format Selection (glass radio buttons):
  - CSV (spreadsheet format)
  - PDF (formatted report)
- Date Range Selection (glass):
  - All time / Last month / Last 3 months / Custom range
- Include Options (glass checkboxes):
  - Include charts
  - Include budget summary
  - Include category breakdown
- Preview (glass):
  - File name
  - Estimated size
- Export Button (glass, primary)
- Share Button (glass, secondary): Share via email/messages

## Key User Flows

### Flow 1: Add Income Transaction
1. Dashboard → Tap "Add Transaction" button
2. Add/Edit Modal opens
3. Select "Income" type
4. Enter amount
5. Select category (Salary, Bonus, etc.)
6. Pick date
7. Add optional notes
8. Tap "Save"
9. Return to Dashboard (updated summary)

### Flow 2: View Spending by Category
1. Dashboard → Tap pie chart
2. Chart highlights selected category
3. Tap category chip to filter
4. Transactions screen shows filtered list
5. Tap transaction to edit/delete
6. Return to Dashboard

### Flow 3: Track Budget
1. Dashboard → Tap "Budget" tab
2. View current budget status
3. Tap "Edit Budget" to adjust limit
4. View category-wise spending
5. Return to Dashboard

### Flow 4: Search & Export
1. Dashboard → Tap "Search" tab
2. Apply filters (date, category, amount)
3. View filtered results
4. Tap "Export" button
5. Select format (CSV/PDF)
6. Choose date range and options
7. Tap "Export"
8. Share via email/messages

## Glassmorphism Implementation Details

### Glass Card Base
```
Background: rgba(255, 255, 255, 0.1) (light) / rgba(255, 255, 255, 0.05) (dark)
Border: 1px solid rgba(255, 255, 255, 0.2) (light) / rgba(255, 255, 255, 0.1) (dark)
Backdrop Filter: blur(10px)
Border Radius: 20px
Padding: 16px
Shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
```

### Glass Button
```
Background: rgba(255, 255, 255, 0.15) (light) / rgba(255, 255, 255, 0.08) (dark)
Border: 1px solid rgba(255, 255, 255, 0.3) (light) / rgba(255, 255, 255, 0.15) (dark)
Backdrop Filter: blur(8px)
Border Radius: 12px
Padding: 12px 24px
Pressed State: opacity 0.8 + scale 0.97
```

### Glass Input
```
Background: rgba(255, 255, 255, 0.1) (light) / rgba(255, 255, 255, 0.05) (dark)
Border: 1px solid rgba(255, 255, 255, 0.2) (light) / rgba(255, 255, 255, 0.1) (dark)
Backdrop Filter: blur(10px)
Border Radius: 12px
Padding: 12px 16px
Focus State: Border color brightened, shadow enhanced
```

### Glass Modal
```
Background: rgba(0, 0, 0, 0.4) (overlay)
Content Background: rgba(255, 255, 255, 0.1) (light) / rgba(255, 255, 255, 0.05) (dark)
Backdrop Filter: blur(20px)
Border Radius: 24px
Padding: 24px
Shadow: 0 20px 60px rgba(0, 0, 0, 0.3)
```

## Navigation Structure

```
Root Layout
├── Tab Navigation (Glass Tab Bar)
│   ├── Dashboard (Home)
│   ├── Transactions
│   ├── Budget
│   └── Search & Export
├── Modals (Overlays)
│   ├── Add/Edit Transaction
│   ├── Edit Budget
│   ├── Export Options
│   └── Date Picker
└── Deep Links
    └── Transaction Detail (from notification/share)
```

## Accessibility
- Minimum touch target: 44x44pt
- Color contrast ratio: 4.5:1 for text
- All interactive elements have clear labels
- Glass effects have sufficient opacity for readability
- Dark mode support throughout

## Performance Considerations
- Lazy load charts (render only when visible)
- Virtualize long transaction lists
- Debounce search input
- Cache chart data
- Optimize blur effects for older devices (fallback to solid colors)
