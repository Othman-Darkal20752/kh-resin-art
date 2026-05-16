# Kh Resin Art Arabic Catalog

## Run
```bash
npm install
npm run dev
```

## Change WhatsApp number
Edit `src/components/WhatsAppButton.jsx`:
```js
const PHONE_NUMBER = '963000000000';
```
Use international format without `+`.

## Replace images
- Logo: replace `src/assets/logo.jpg`
- Products: replace files inside `src/assets/products/`
- Then update imports or product fields inside `src/data/products.js`

## Structure
```text
src/
  assets/
    logo.jpg
    products/
  components/
    Navbar.jsx
    Footer.jsx
    ProductCard.jsx
    WhatsAppButton.jsx
    FloatingWhatsApp.jsx
  pages/
    HomePage.jsx
    ProductsPage.jsx
    ProductDetailsPage.jsx
    AboutPage.jsx
    ContactPage.jsx
  data/
    products.js
    categories.js
  styles/
    global.css
    navbar.css
    home.css
    products.css
    details.css
    footer.css
```
