#Project Name: ThromboSense 
# Task: app.py file — used to run program on Flask

#import all necessary files
from flask import Flask, render_template, url_for, request, jsonify
from datetime import datetime
import pyrebase
import random


app = Flask(__name__)
config = {}
key = 0 # key is seconds from 0 during data collection


#define routes to each page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/homecopy')
def homecopy():
    return render_template('homecopy.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/signIn')
def signIn():
    return render_template('signIn.html')

@app.route('/authors')
def authors():
    return render_template('authors.html')


@app.route('/ourproduct')
def ourproduct():
    return render_template('ourproduct.html')

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/procedure')
def procedure():
    return render_template('procedure.html')

@app.route('/instructions')
def instructions():
    return render_template('instructions.html')

@app.route('/test', methods=['GET', 'POST'])
def test():
    global config, userID, db, timeStamp, key

    # POST request (FB configuration sent from signIn.js
    if request.method == 'POST':

        #Get the timestamp to be used as firebase node
        # Each data set will be stored under its own child node identified by the timestamp
        timeStamp = datetime.now().strftime('%d-%m-%Y %H:%M:%S')

        # Recieve Firebase configuration credentials, pop uid and assign to User ID
        config = request.get_json()
        print(config)
        userID = config.pop('userID')


        print('User ID ' + userID, flush = True)            # Debug only
        print(config, flush = True)                         # Debug only

        # Initialize firebase connection
        firebase = pyrebase.initialize_app(config)

        # Create a database object ('db') to interact with the database
        db = firebase.database()

        # Write sample data to FB to test connection
        #db.child("users/" + userID + "/data/" + timeStamp).update({"testKey": "testValue"})

        return 'Success', 200
    
    else:
        # code to get data from Arduino will go here 
        if(bool(config) == False):
            print('FB config is empty')

        else: 
            # Take parameters from Arduino and store in variable 'value'
            # value1 = request.args.get('emgSignal')
            # value2 = random.randint(45, 50)

            # value = int(value1) + value2
            value = request.args.get('velocity')

            print('Blood Flow Velocity: ' + value, flush = True)            # Debug only

            # Write arduino data to FB 
            db.child("users/" + userID + "/data/" + '/' + timeStamp).update({key: value})

            # increment key
            key +=1

        return "Success"

@app.route("/test1", methods=['GET', 'POST'])   
def test1():
    global userID, db, timeStamp, key

    db = pyrebase.initialize_app(config)
    if(bool(config) == False):
        print('FB config is empty')

    else: 
        # Take parameters from Arduino and store in variable 'value'
        value = request.args.get('emgSignal')
        

        print('Blood Flow Velocity: ' + value, flush = True)            # Debug only

        # Write arduino data to FB 
        db.child("users/" + userID + "/data/" + '/' + timeStamp).update({key: value})

        # increment key
        key +=1



# Run server on cal IP address  on port 5000
if __name__== '__main__':
    app.run(debug=False, host = '0.0.0.0', port = 5000)
