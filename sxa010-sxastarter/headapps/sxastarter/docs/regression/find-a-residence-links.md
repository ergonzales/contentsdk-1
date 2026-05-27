# Find A Residence Link Regression Checklist

Use this checklist after changes to residence search, province pages, or URL mapping helpers.

## Environment
- Run app in connected mode at `http://localhost:3000`.
- Use desktop viewport and at least one mobile viewport check.

## Core Routes
- Open `/find-a-residence`.
- Open `/find-a-residence/ontario`.
- Open one additional province route (for example `/find-a-residence/quebec`).

## Search Modal Behavior
- Type 1-2 characters in search input: modal/list should not get stuck open.
- Clear input: previous results should clear and page remains interactive.
- Enter valid city term: results render and filter controls are clickable.
- Enter valid postal code: near-me style results render and distance control is usable.

## Province/City Link Behavior
- On province pages, city list links are clickable.
- Clicking city links navigates successfully (no infinite loading indicator).
- Residence links under each city are clickable and navigate.
- Browser back button returns to previous page without frozen overlay.

## Link Data Robustness
- Verify no `[object Object]` appears in rendered href values.
- Verify links still work when data source returns nested link objects.
- Verify links still work when data source returns direct string paths.

## Console and Hydration
- No invalid attribute warnings from image/link props.
- No repeated render-loop errors/warnings.
- No persistent route-loading indicator after successful navigation.

## Mobile Spot Check
- Repeat city/residence link click test on mobile viewport.
- Confirm filter modal opens/closes normally and does not block page interaction.
