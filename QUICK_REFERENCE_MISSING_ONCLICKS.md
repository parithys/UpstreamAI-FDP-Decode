# Quick Reference: Missing onClick Handlers
## ADNOC FDP Application - Implementation Checklist

---

## 🚨 CRITICAL: Restore Dashboard.tsx First!
**The Dashboard.tsx file is corrupted and must be restored from version control before any implementation.**

---

## HIGH PRIORITY FIXES (Do First) 

### 1. Dashboard.tsx - Data Sources Card
```tsx
// Location: Line ~334
// Current: <div> wrapper with no onClick
// Fix:
const [showDataSourcesModal, setShowDataSourcesModal] = useState(false);

<div 
  onClick={() => setShowDataSourcesModal(true)}
  className="... cursor-pointer"
>
  {/* Existing content */}
</div>

{/* Add at end of component */}
{showDataSourcesModal && (
  <DataSourcesModal onClose={() => setShowDataSourcesModal(false)} />
)}
```

### 2. ExecutiveDashboard.tsx - Decision Queue Items
```tsx
// Location: Line 177
// Current: Hover state, no onClick
// Fix:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

<div 
  onClick={() => navigate('/insights/decision-approval', { 
    state: { decisionId: decision.item }
  })}
  className="... cursor-pointer"
>
```

### 3. ExecutiveDashboard.tsx - Pipeline Table Rows
```tsx
// Location: Line 110
// Current: TableRow with hover, no onClick
// Fix:
<TableRow 
  onClick={() => navigate(`/asset-detail/${item.asset.toLowerCase().replace(' ', '-')}`)}
  className="... cursor-pointer"
>
```

### 4. DataHealth.tsx - Category Cards Without Paths
```tsx
// Location: Lines 198-262
// Cards missing paths: Petro Logs, Geological, Geophysical, Production

// Option 1: Add paths
path: '/data-health/petro-logs'

// Option 2: Add drawer
const [selectedCategory, setSelectedCategory] = useState(null);

onClick={() => setSelectedCategory(card.id)}
```

### 5. Insights.tsx - Insight Cards
```tsx
// Location: Lines 125-175
// Current: div with hover, no onClick
// Fix:
const [selectedInsight, setSelectedInsight] = useState(null);

<div 
  onClick={() => setSelectedInsight(insight.id)}
  className="... cursor-pointer"
>
```

### 6. Dashboard.tsx - KPI Cards (Recovery, Water Cut, NPV)
```tsx
// Locations: Lines 215, 242, 269
// Fix:
const [expandedKPI, setExpandedKPI] = useState(null);

<div 
  onClick={() => setExpandedKPI('recovery-factor')}
  className="... cursor-pointer"
>

{/* Add modal component */}
{expandedKPI && (
  <KPIExpandedModal 
    kpiType={expandedKPI}
    onClose={() => setExpandedKPI(null)}
  />
)}
```

---

## MEDIUM PRIORITY FIXES

### 7. SubsurfaceUncertainty.tsx - Parameter Rows
```tsx
// Location: Lines 400+
// Make parameter rows clickable for editing
<div 
  onClick={() => handleEditParameter(param.id)}
  className="p-2 hover:bg-card-hover cursor-pointer rounded"
>
```

### 8. Uncertainty.tsx - "View Details" Buttons
```tsx
// Location: Lines 108-122 (4 category cards)
// Fix each button:
<Button 
  variant="outline" 
  size="sm"
  onClick={() => handleViewDetails(category.id)}
>
  View Details →
</Button>

const handleViewDetails = (categoryId) => {
  navigate(`/uncertainty/${categoryId}`);
};
```

### 9. AILedIntegration.tsx - Data Source Cards
```tsx
// Location: Lines 216-240
// Add onClick to each card:
const [selectedSource, setSelectedSource] = useState(null);

<div 
  onClick={() => setSelectedSource(source.id)}
  className="... cursor-pointer"
>
```

### 10. MultidisciplinaryWorkflow.tsx - Discipline Cards
```tsx
// Location: Lines 90-150
// Add navigation to discipline detail:
<div 
  onClick={() => navigate(`/discipline/${discipline.id}`)}
  className="... cursor-pointer"
>
```

---

## LOW PRIORITY ENHANCEMENTS

### 11. TornadoChart.tsx - Interactive Bars
```tsx
// Add click handlers to SVG rects
<rect 
  onClick={() => handleBarClick(param)}
  className="cursor-pointer hover:opacity-80"
  style={{ transition: 'opacity 0.2s' }}
/>

const handleBarClick = (param) => {
  setSelectedParameter(param);
  // Show tooltip or modal with details
};
```

### 12. Layer3Visualizations - Chart Interactions
```tsx
// Add onClick to chart data points
<LineChart onClick={(data) => handleDataPointClick(data)}>
  {/* Chart content */}
</LineChart>

const handleDataPointClick = (dataPoint) => {
  toast.info(`Value: ${dataPoint.value} at ${dataPoint.date}`);
};
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1 (This Week):
- [ ] **RESTORE Dashboard.tsx from version control** ⚠️
- [ ] Add Data Sources modal (Dashboard)
- [ ] Add Decision Queue onClick (ExecutiveDashboard)
- [ ] Add Pipeline row onClick (ExecutiveDashboard)
- [ ] Add Category card paths/onClick (DataHealth)
- [ ] Add Insight card onClick (Insights)
- [ ] Add KPI card expansion (Dashboard)

### Phase 2 (Next Week):
- [ ] Add Parameter row onClick (SubsurfaceUncertainty)
- [ ] Fix "View Details" buttons (Uncertainty)
- [ ] Add Data Source card onClick (AILedIntegration)
- [ ] Add Discipline card onClick (MultidisciplinaryWorkflow)

### Phase 3 (Sprint 3):
- [ ] Add chart interactivity (TornadoChart, Layer3Visualizations)
- [ ] Add keyboard navigation to all clickable divs
- [ ] Add ARIA attributes for accessibility
- [ ] Add focus indicators

---

## TESTING CHECKLIST

After each fix, verify:
- [ ] Element is visually clickable (cursor: pointer)
- [ ] Click action works as expected
- [ ] No console errors
- [ ] Navigation works (if applicable)
- [ ] Modal/drawer closes properly (if applicable)
- [ ] Toast notification appears (if applicable)
- [ ] Loading states work (if async)
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces action (if applicable)

---

## COMMON PATTERNS

### Pattern: Card with Navigation
```tsx
<Link to="/path" className="cursor-pointer hover:shadow-glow-hover">
  {content}
</Link>
```

### Pattern: Card with Modal
```tsx
const [show, setShow] = useState(false);
<div onClick={() => setShow(true)} className="cursor-pointer">{content}</div>
{show && <Modal onClose={() => setShow(false)} />}
```

### Pattern: Table Row Navigation
```tsx
<TableRow onClick={() => navigate('/path')} className="cursor-pointer hover:bg-card-hover">
  {cells}
</TableRow>
```

### Pattern: Toast Notification
```tsx
<Button onClick={() => toast.success('Action completed!')}>
  Action
</Button>
```

### Pattern: Accessible Clickable Div
```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
  className="cursor-pointer focus:ring-2 focus:ring-primary"
  aria-label="Description"
>
  {content}
</div>
```

---

## FILES TO MODIFY

### High Priority:
1. `/src/app/screens/Dashboard.tsx` ⚠️ RESTORE FIRST
2. `/src/app/screens/ExecutiveDashboard.tsx`
3. `/src/app/screens/DataHealth.tsx`
4. `/src/app/screens/Insights.tsx`

### Medium Priority:
5. `/src/app/screens/SubsurfaceUncertainty.tsx`
6. `/src/app/screens/Uncertainty.tsx`
7. `/src/app/screens/AILedIntegration.tsx`
8. `/src/app/screens/MultidisciplinaryWorkflow.tsx`

### Low Priority:
9. `/src/app/components/TornadoChart.tsx`
10. `/src/app/components/visualizations/Layer3Visualizations.tsx`

---

## QUICK STATS

- **Total Issues:** 88 missing onClick handlers
- **High Priority:** 28 elements (32%)
- **Medium Priority:** 42 elements (48%)
- **Low Priority:** 18 elements (20%)

- **Estimated Time:**
  - Phase 1: 4-6 hours
  - Phase 2: 8-10 hours
  - Phase 3: 12-16 hours
  - **Total:** 24-32 hours

---

## NOTES

1. **Always test after each change** - Don't batch multiple fixes without testing
2. **Use consistent patterns** - Follow the patterns shown above
3. **Add cursor-pointer** - Users need visual feedback
4. **Accessibility matters** - Add keyboard support and ARIA attributes
5. **Toast feedback** - User should know their action was received

---

**Last Updated:** February 9, 2026  
**Quick Reference Version:** 1.0
