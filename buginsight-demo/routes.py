from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/v1/users", methods=["POST"])
def create_user():
    """Endpoint to create a new user.
    
    WARNING: Contains an API Validation bug!
    """
    data = request.json
    
    # BUG: Does not validate if 'email' is actually present in data
    # If client sends {"name": "John"}, this crashes with KeyError
    email = data["email"]
    
    # BUG: Does not validate email format, allowing malicious strings
    if len(email) > 100:
        return jsonify({"error": "Email too long"}), 400
        
    # Save user to DB...
    return jsonify({"status": "created", "email": email}), 201
