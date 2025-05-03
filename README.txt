# Laura Martínez Temiño - Personal Website

This project is a minimalist personal website built with Flask, HTML, CSS, and JavaScript.

## 🖥️ How to run locally

1. Make sure you have Python installed (preferably version 3.7+).
2. (Optional) Create a virtual environment:
   python -m venv env
   source env/bin/activate  (on Mac/Linux)
   env\Scripts\activate  (on Windows)
3. Install dependencies:
   pip install -r requirements.txt
4. Run the server:
   python app.py
5. Open your browser at:
   http://127.0.0.1:5000

---

## 🚀 How to deploy on Render

1. Push your project to a GitHub repository.
2. Create a free account at https://render.com/.
3. Click on "New +" → "Web Service".
4. Connect your GitHub repo.
5. Set:
   - Build Command: *(leave empty)*
   - Start Command: `gunicorn app:app`
6. Select Free Plan.
7. Deploy and your website will be live!

---

## 📁 Project Structure

/ (root) │ app.py │ requirements.txt │ Procfile │ README.txt ├── /static │ ├── /css/styles.css │ ├── /js/script.js │ └── /files/LauraMartinezCV.pdf ├── /templates │ └── index.html


---

## 📬 Notes
- To update your CV: replace the PDF file inside `/static/files/`.
- To modify your text or skills: edit `index.html`.
- You can add more animations by editing `script.js` and `styles.css`.
