# Laura Martínez Temiño — Portfolio

Personal portfolio built with Flask and plain HTML/CSS/JS, deployed on Vercel.
Live: https://laura-website-pi.vercel.app/

## Run locally
```
pip install -r requirements.txt
python app.py        # http://127.0.0.1:5000
```

## Structure
```
app.py                     Flask app (homepage + local serving of public/)
templates/index.html       The whole portfolio page
templates/404.html         Not-found page
public/static/css|js       Styles and the small script (theme, menu, reveal, form)
public/static/images       Optimised photos (WebP + JPG), logos, project thumbnails
public/static/files        CV and thesis PDFs
public/brussels-by-power/  The live "Brussels, by power" 3D app (static build of
                           github.com/laura-martinez00/brussels-by-power, bxl/web)
vercel.json                Redirects and cache headers
```
On Vercel everything in `public/` is served from the CDN; only the HTML pages run through Flask.

## Common updates
- **CV**: replace `public/static/files/LauraMartinezCV.pdf`.
- **Text, experience, projects**: edit `templates/index.html`.
- **Brussels, by power data refresh**: rebuild in the project repo, then copy its `bxl/web/` folder over
  `public/brussels-by-power/` (keep the small "← Laura Martínez Temiño" link in `index.html` and its CSS).
