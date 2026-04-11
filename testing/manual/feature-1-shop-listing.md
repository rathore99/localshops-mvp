# Manual Test Plan — Feature 1: Shop Listing

**Feature:** Shop Listing (`GET /shops`, `GET /shops/{id}`, `GET /categories`)
**Frontend pages:** Home, ShopDetail
**Tester:** _______________
**Date:** _______________
**Environment:** [ ] Local  [ ] Staging (Railway URL: _______________)
**Device tested:** [ ] Desktop Chrome  [ ] Android Chrome  [ ] iPhone Safari

---

## Pre-conditions
- Seed data is loaded: at least 3 active shops, 1 inactive shop, multiple categories
- Backend is running and `/api/v1/health` returns 200
- Frontend is running and accessible

---

## TC-1: Home Page Loads

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Open the app URL | Page loads without errors | |
| 2 | Observe header | "LocalShops" title visible, "Shopkeeper Login" link visible | |
| 3 | Observe categories section | At least 3 category tiles visible | |
| 4 | Observe shops section | Active shops listed, inactive shop NOT listed | |
| 5 | Open browser console | No JS errors or failed network requests | |

---

## TC-2: Shop Card Information

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Look at a shop card on Home | Shop name, category, short description visible | |
| 2 | Check for "View shop" button | Button present and tappable | |
| 3 | Tap "View shop" | Navigates to ShopDetail page for that shop | |

---

## TC-3: Shop Detail Page

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Navigate to a shop's detail page | Page loads, shop name in heading | |
| 2 | Observe shop info | Phone, address, category visible | |
| 3 | Observe product list | Products with name and availability shown | |
| 4 | Check unavailable products | Unavailable products shown with a clear "Unavailable" label, not hidden | |
| 5 | Tap WhatsApp/Call link | Opens WhatsApp or dialler on mobile | |
| 6 | Tap "Reserve items" button | Navigates to Reservation page for this shop | |

---

## TC-4: Category Filter (if implemented on Home)

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Tap a category tile (e.g. "Apparel") | Shows shops filtered to that category | |
| 2 | Tap another category | Filter updates | |
| 3 | Check count | Only shops of that category are shown | |

---

## TC-5: Empty States

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Navigate to an invalid shop ID in URL (e.g. /shops/9999) | Shows "Shop not found" message, not a blank page or error stack | |
| 2 | If all shops are deactivated (test env) | Home shows "No shops available right now" message | |

---

## TC-6: Mobile Rendering

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Open app on a real Android phone | Page renders correctly, no horizontal scroll | |
| 2 | Check tap targets | Buttons and cards are easy to tap without mis-tapping adjacent elements | |
| 3 | Check font size | Text is readable without zooming | |
| 4 | Open shop detail on mobile | Product list readable, WhatsApp button clearly visible | |
| 5 | Rotate to landscape | Layout does not break | |

---

## TC-7: Performance Check

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Open Chrome DevTools → Network → Throttle to "Fast 4G" | |
| 2 | Hard refresh Home page | Page is interactive within 3 seconds | |
| 3 | Navigate to ShopDetail | Page loads within 2 seconds | |
| 4 | Check Network tab | No request fails (red rows) | |

---

## TC-8: API Behaviour (verify via DevTools Network tab)

| Step | Action | Expected Result | Pass/Fail |
|---|---|---|---|
| 1 | Load Home page | `GET /api/v1/shops` returns 200 with array | |
| 2 | Load ShopDetail | `GET /api/v1/shops/{id}` returns 200 with shop + products | |
| 3 | Load Home page | `GET /api/v1/categories` returns 200 with string array | |
| 4 | Load ShopDetail for inactive shop | Returns 404 (should not be reachable from UI anyway) | |

---

## Sign-off Checklist

- [ ] All test cases above completed
- [ ] All automated tests passing (`mvn test`)
- [ ] All integration tests passing (`mvn test -Dtest="*IntegrationTest"`)
- [ ] Postman collection `feature-1-shop-listing.json` passes via Newman
- [ ] No console errors on Home or ShopDetail
- [ ] Tested on real Android device
- [ ] Feature deployed to Railway/Vercel staging

**Approved to proceed to Feature 2?** [ ] Yes  [ ] No

**Notes / Issues found:**
```
(write any bugs, UX issues, or suggestions here)
```
