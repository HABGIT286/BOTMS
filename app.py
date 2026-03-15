from flask import Flask, request, jsonify, send_from_directory
import requests

app = Flask(__name__)

VT_API_KEY = "ضع_هنا_API_KEY_الخاصة_بك"

# Serve HTML/CSS/JS
@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory("frontend", path)

# API endpoint للفحص
@app.route("/scan", methods=["POST"])
def scan():
    data = request.json
    url = data.get("url")
    
    if not url:
        return jsonify({"error": "URL missing"}), 400

    headers = {"x-apikey": VT_API_KEY}

    # إرسال الرابط للفحص
    resp = requests.post("https://www.virustotal.com/api/v3/urls",
                         headers=headers,
                         data={"url": url})
    
    analysis_data = resp.json()
    analysis_id = analysis_data.get("data", {}).get("id")

    if not analysis_id:
        return jsonify({"error": "Failed to get analysis ID"}), 500

    # استرجاع نتائج التحليل لكل المحركات
    result = requests.get(f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
                          headers=headers).json()

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
