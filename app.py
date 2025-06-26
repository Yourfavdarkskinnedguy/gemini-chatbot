from flask import Flask, render_template, redirect, url_for, jsonify, request, session
from backend import generate_prompt
import json
import firebase_admin
from firebase_admin import auth, credentials
from dotenv import load_dotenv
import os
load_dotenv()



cred_dict = json.loads(os.environ["FIREBASE_ADMIN_CREDENTIALS"])
cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(cred)

app = Flask(__name__)
app.secret_key=os.getenv('app_secret_key')

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template('login.html')



@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return ''




@app.route('/sessionLogin', methods=['POST'])
def session_login():
    data= request.get_json()
    print(f'data is {data}')
    id_token= data.get('idToken')
    print(f'id_token is {id_token}')
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        session['logged_in'] = True
        session['uid'] = uid
        print(f'session is {session}')
        return '', 200
    except Exception as e:
        print(f'error found is {e}')
        return 'Unauthorized', 401



@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/chatbot')
def chatbot():
    print(f'first session in chatbot is {session}')
    print(f'login check in session(chatbot) is {session.get('logged_in')}')
    if session.get('logged_in') == True:
        return render_template('chatbot.html')
        
    else:
        return render_template('unauthorized.html')

    

@app.route('/api/chat', methods=['POST'])
def get_response():
    try:
        data= request.json
        print(f'data is {data}')
        print(f'data type is {type(data)}')

        if not data:
            print('no query found')
        
        response, suggestion= generate_prompt(data)
        print(f'response is {response}')
        print(f'suggestion is {suggestion}')

        response_chat= {'response': response, 'suggestions': suggestion}
        print(f'response_chat is {response_chat}')
        print(jsonify(response_chat)) 
        return response_chat
    except Exception as e :
        print(f'error found is {e}')

if __name__ == '__main__':
    app.run(debug=True)
