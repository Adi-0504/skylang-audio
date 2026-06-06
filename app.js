from flask import Flask, request, send_file, jsonify
import subprocess
import os

app = Flask(__name__, static_folder="static")

# 🔊 超簡單 G2P（先穩）
def g2p(text):
    return text.lower().split()

phoneme_map = {
    "na": "na.wav",
    "mu": "mu.wav",
    "ra": "ra.wav",
    "ka": "ka.wav"
}

@app.route("/")
def home():
    return send_file("static/index.html")

@app.route("/speak", methods=["POST"])
def speak():
    data = request.json
    text = data.get("text", "")

    tokens = g2p(text)

    audio_files = []

    for t in tokens:
        if t in phoneme_map:
            path = f"audio/phonemes/{phoneme_map[t]}"
            if os.path.exists(path):
                audio_files.append(path)

    if not audio_files:
        return jsonify({"error": "no valid phonemes"}), 400

    # 🔥 FFmpeg list
    with open("list.txt", "w") as f:
        for a in audio_files:
            f.write(f"file '{a}'\n")

    output = "output/out.mp3"

    subprocess.run([
        "ffmpeg",
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", "list.txt",
        "-ar", "44100",
        "-ac", "2",
        output
    ])

    return send_file(output, mimetype="audio/mp3")

if __name__ == "__main__":
    app.run(debug=True)
