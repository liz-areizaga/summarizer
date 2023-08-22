# Import flask and datetime module for showing date and time
from flask import Flask
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi

# Initializing flask app
app = Flask(__name__)
CORS(app)

transcript_list = YouTubeTranscriptApi.get_transcript('c79wsBqDW1A')

transcript = ' '.join(item['text'] for item in transcript_list)
transcript = transcript.replace("[Music]","")
transcript = transcript.replace("  "," ")

# Route for seeing a data
@app.route('/data')
def get_yt_transcript():
	# Returning an api for showing in reactjs
	return {
		'Transcript': transcript
	}
   # return transcript
   
# Running app
if __name__ == '__main__':
	app.run(debug=True)
