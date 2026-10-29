# SmartShop - Online Product Store

CSE-3532 Mid Project (Tools and Technologies for Internet Programming)

## Team
| Name | ID |
|---|---|
| Tafsirul Islam | C243025 |
| Rafi Alam | C243015 |

## Built With
HTML, Tailwind CSS (CDN), JavaScript DOM, Fetch API, FakeStore API, localStorage

## Features
- Sticky navbar with active link highlight and mobile menu
- Sliding banner (auto + prev/next)
- Products from FakeStore API
- Cart with subtotal, delivery charge, shipping cost, coupon (`SMART10` = 10% off) and total
- Reviews from local `reviews.json` with a carousel
- User balance (starts at 1000 BDT, "Add Money" +1000, saved in localStorage)
- Extra feature: sort products by price (low to high, high to low)
- Bonus: Contact form with validation, About Us section
- Footer with "Back to Top" button

## How to Run
Open the folder in VS Code and start **Live Server** (right click `index.html` > Open with Live Server).

A local server is needed because the browser blocks `fetch("reviews.json")` when the file is opened directly.

## Files
- `index.html`: page layout (Tailwind classes only, no CSS file)
- `script.js`: all JavaScript
- `reviews.json`: customer reviews
