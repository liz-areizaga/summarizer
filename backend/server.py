from flask import Flask, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from flask import request
import re

# Initializing flask app
app = Flask(__name__)
CORS(app)

# Route for seeing a data
@app.route('/data', methods=['GET'])
def get_yt_transcript():
	video_id = request.args.get('id')
	transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
	transcript = ' '.join(item['text'] for item in transcript_list)
	# transcript = transcript.replace("[Music]","")
	transcript = re.sub(r'\[[^\]]+\]', "", transcript)
	transcript = transcript.replace("  "," ")
	transcript = "No transcript or no words found" if transcript == "" else transcript
	return jsonify(transcript)
   
# Running app
if __name__ == '__main__':
	app.run(debug=True)
