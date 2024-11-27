import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

def send_simple_message():
    response = requests.post(
        "https://api.mailgun.net/v3/sandboxd67c519a4b6949318e1f371c6e40ca0a.mailgun.org/messages",
        auth=("api","4be43a7ba38628dc914006728d3df9af-c02fd0ba-56b9258b"),
        data={
            "from": "vaibhav <mailgun@sandboxd67c519a4b6949318e1f371c6e40ca0a.mailgun.org>",
            "to": ["opwala2426@gmail.com"],
            "subject": "Hello",
            "text": "Testing some Mailgun awesomeness!"
        }
    )
    return response

@app.route('/', methods=['POST'])
def index():
    response = send_simple_message()
    return f"Email sent! Status Code: {response.status_code}, Response: {response.text}"

@app.route('/webhook', methods=['POST'])
def webhook():
    print("Webhook received")
    datas = request.get_json()
    print(datas)
    return jsonify({"message": "ok"})

if __name__ == '_main_':
    app.run(debug=True)