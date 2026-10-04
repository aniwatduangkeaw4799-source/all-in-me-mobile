# ALL IN ME — Mobile Storefront
Built from the latest Excel workbook uploaded by the user.

## Real Excel mapping
- Category = Column B
- Store name = Column C
- Detail store = Column D
- Store URL = Column E
- Embedded Store Image = extracted from the workbook and stored in `assets/`

20 stores / 20 embedded images were extracted.

## Run locally
```bash
cd all-in-me-mobile-final
python3 -m http.server 8080 --bind 0.0.0.0
```
Open on the Mac:
`http://localhost:8080`

For a phone on the same Wi-Fi, find the Mac IP:
```bash
ipconfig getifaddr en0
```
Then open:
`http://YOUR-MAC-IP:8080`

## Public URL
This is a static site and can be deployed to Render Static Site, Netlify, Vercel, or GitHub Pages.
No backend is required for the storefront.
