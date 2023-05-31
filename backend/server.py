from flask import Flask, jsonify, make_response

app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello():
    response = {"message": "Hello, World!"}
    return jsonify(response)


@app.after_request
def after_request(response):
    response = make_response(response)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Content-Type"] = "application/json"
    return response


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
