from pathlib import Path

from flask import Flask, redirect, render_template, send_from_directory

BASE = Path(__file__).parent
PUBLIC = BASE / "public"

# On Vercel, everything in public/ is served straight from the CDN (fast, cached).
# Flask points at the same folder so `python app.py` works identically in local development.
app = Flask(__name__, static_folder=str(PUBLIC / "static"), static_url_path="/static")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/brussels-by-power")
def brussels_by_power_redirect():
    return redirect("/brussels-by-power/", code=301)


@app.route("/brussels-by-power/", defaults={"path": "index.html"})
@app.route("/brussels-by-power/<path:path>")
def brussels_by_power(path):
    return send_from_directory(PUBLIC / "brussels-by-power", path)


@app.errorhandler(404)
def not_found(_):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
