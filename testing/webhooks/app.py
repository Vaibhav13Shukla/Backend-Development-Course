from flask import Flask, jsonify
import requests

app = Flask(__name__)


def send_simple_message():
    return requests.post(
        "https://api.mailgun.net/v3/sandboxf1695dc9bcbf4a14bbf36854bb6584c5.mailgun.org/messages",
        auth=("api", "3917881dec953c0d16557ca05c32ef0e-c02fd0ba-54c6e27f"),
        data={
            "from": "vaibhav.shuklahere@gmail.com <mailgun@sandboxf1695dc9bcbf4a14bbf36854bb6584c5.mailgun.org>",
            "to": ["vimal.j@atriauniversity.edu.in"],
            "subject": "Hello",
            "text": "Testing some Mailgun awesomeness!"
        }
    )


@app.route('/', methods=['POST'])
def index():
    send_simple_message()
    return "Email sent!"


@app.route('/webhook', methods=['POST'])
def webhook():
    print("Webhook received")
    return jsonify({"message":"OK"})

if __name__ == "__main__":
    app.run(debug=True)