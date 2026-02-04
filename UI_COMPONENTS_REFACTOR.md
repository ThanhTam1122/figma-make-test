# UI Components Generalization - Summary

## Overview
Successfully refactored UI components to be more general and reusable, removing hardcoded language-specific text and making components language-agnostic.

## Changes Made

### 1. **StatusBadge Component** (`ui/status-badge.tsx`)
**Before:**
- Hardcoded Japanese labels in `statusConfig`
- Labels were not customizable

**After:**
- Now requires `label` prop (string)
- `variant` prop is optional, used only for color styling
- Added `color` prop for custom colors
- Added generic variants: `success`, `warning`, `error`, `info`
- More flexible and language-agnostic

### 2. **ActionButtons Component** (`ui/action-buttons.tsx`)
**Before:**
- Hardcoded Japanese labels: "編集", "削除", "承認", "却下"
- No way to customize labels

**After:**
- Added new `ActionButton` base component with flexible props
- All button components now accept optional `label` prop
- Default to English labels: "Edit", "Delete", "Approve", "Reject"
- Added `variant` prop for styling: `default`, `destructive`, `primary`, `ghost`
- `ActionButtonGroup` now accepts label props: `editLabel`, `deleteLabel`, `approveLabel`, `rejectLabel`

### 3. **SearchBar Component** (`ui/search-bar.tsx`)
**Before:**
- Hardcoded placeholder: "検索..."
- No clear button

**After:**
- Customizable `placeholder` (defaults to "Search...")
- Added `showClearButton` prop (default: true)
- Added `onClear` callback
- Added `disabled` prop
- Added focus ring styling

### 4. **DataTable Component** (`ui/data-table.tsx`)
**Before:**
- Hardcoded empty message: "データがありません"
- Limited customization

**After:**
- Customizable `emptyMessage` (defaults to "No data available")
- Added `striped` prop for alternating row colors
- Added `hoverable` prop (default: true)
- Added `bordered` prop (default: true)
- Added `headerClassName` prop
- Added `width` support for columns
- Better transition effects

### 5. **Modal Component** (`ui/modal.tsx`)
**Before:**
- Limited functionality
- No keyboard support

**After:**
- Added `showCloseButton` prop (default: true)
- Added `closeOnOverlayClick` prop (default: true)
- Added `closeOnEscape` prop (default: true) with keyboard handler
- Added `footer` prop for custom footer content
- Added `maxWidth` options: `3xl`, `4xl`
- Body scroll lock when modal is open
- Better accessibility (ESC key support, aria-label)
- Proper overflow handling

### 6. **FloorPicker Component** (`ui/floor-picker.tsx`)
**Before:**
- Hardcoded Japanese text: "キャンセル", "決定", "お住まいの階数"
- Only worked for floors

**After:**
- Created new generic `ScrollPicker` component
- Accepts `options` array or `min`/`max` range
- All text is customizable: `title`, `cancelLabel`, `confirmLabel`, `suffix`
- `FloorPicker` now wraps `ScrollPicker` for backward compatibility
- Can be used for any numeric or custom option selection

### 7. **Status Labels Helper** (`ui/status-labels.ts`)
**New File:**
- Provides Japanese labels for all status variants
- `statusLabels` object maps variants to Japanese text
- `getStatusLabel()` helper function
- Keeps language-specific text separate from components
- Easy to add other languages in the future

### 8. **Updated Component Index** (`ui/common-index.ts`)
- Added exports for new components and helpers:
  - `ActionButton`
  - `getStatusLabel`, `statusLabels`
  - `ScrollPicker` (via floor-picker)

## Usage Examples

### StatusBadge (New API)
```typescript
// With variant (uses predefined colors)
<StatusBadge variant="success" label="成功" />

// Custom color
<StatusBadge label="カスタム" color="bg-purple-100 text-purple-700" />

// With helper (keeps Japanese labels in one place)
import { getStatusLabel } from './ui/common-index';
<StatusBadge variant="approved" label={getStatusLabel('approved')} />
```

### ActionButtons (New API)
```typescript
// Individual buttons with custom labels
<EditButton onClick={handleEdit} label="編集" />
<DeleteButton onClick={handleDelete} label="削除" />

// Button group with Japanese labels
<ActionButtonGroup
  onEdit={handleEdit}
  onDelete={handleDelete}
  onApprove={handleApprove}
  onReject={handleReject}
  editLabel="編集"
  deleteLabel="削除"
  approveLabel="承認"
  rejectLabel="却下"
/>
```

### SearchBar (New API)
```typescript
<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="名前、電話番号で検索..."
  showClearButton={true}
  onClear={() => console.log('Cleared')}
/>
```

### DataTable (New API)
```typescript
<DataTable
  columns={columns}
  data={data}
  keyExtractor={(row) => row.id}
  emptyMessage="データがありません"
  striped={true}
  hoverable={true}
  bordered={true}
/>
```

### Modal (New API)
```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="詳細情報"
  subtitle="ユーザー情報の編集"
  maxWidth="xl"
  showCloseButton={true}
  closeOnEscape={true}
  closeOnOverlayClick={true}
  footer={
    <div className="flex gap-2">
      <button>キャンセル</button>
      <button>保存</button>
    </div>
  }
>
  {/* content */}
</Modal>
```

### ScrollPicker (New Generic Component)
```typescript
// For floors
<ScrollPicker
  value={selectedFloor}
  onChange={setSelectedFloor}
  onClose={handleClose}
  min={1}
  max={60}
  suffix="階"
  title="お住まいの階数"
  cancelLabel="キャンセル"
  confirmLabel="決定"
/>

// For custom options (e.g., time slots)
<ScrollPicker
  value={selectedTime}
  onChange={setSelectedTime}
  onClose={handleClose}
  options={[
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    // ...
  ]}
  title="時間を選択"
/>
```

## Benefits

1. **Language Agnostic**: Components no longer have hardcoded Japanese text
2. **Flexibility**: All labels and messages are customizable via props
3. **Reusability**: Components can be used in any language or context
4. **Maintainability**: Language-specific text centralized in `status-labels.ts`
5. **Better UX**: Added features like keyboard support, clear button, striped tables
6. **Type Safety**: All props are properly typed with TypeScript
7. **Backward Compatibility**: Provided default English labels and helpers for Japanese

## Migration Notes

For existing code using these components:
- **StatusBadge**: Add `label` prop or use `getStatusLabel(variant)` helper
- **ActionButtons**: Add label props (`editLabel`, `deleteLabel`, etc.) for Japanese text
- **SearchBar**, **DataTable**, **Modal**: Optional - defaults work, but can customize
- **FloorPicker**: No changes needed - backward compatible

## Files Modified

### Component Files:
- `ui/status-badge.tsx` - Made label required, variant optional
- `ui/action-buttons.tsx` - Added label props to all buttons
- `ui/search-bar.tsx` - Added clear button and customization
- `ui/data-table.tsx` - Added striped, hoverable, bordered options
- `ui/modal.tsx` - Added keyboard support, footer, better UX
- `ui/floor-picker.tsx` - Created ScrollPicker, kept FloorPicker for compatibility

### New Files:
- `ui/status-labels.ts` - Japanese label mappings

### Updated Files:
- `ui/common-index.ts` - Added new exports
- `admin/application-management.tsx` - Updated to use new props
- `admin/report-management.tsx` - Updated to use new props  
- `admin/supporter-management.tsx` - Updated to use getStatusLabel and label props
- `admin/client-management.tsx` - Updated to use getStatusLabel and label props
