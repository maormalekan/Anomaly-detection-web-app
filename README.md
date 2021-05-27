# Anomaly-detection-web-app
A web application that allows many users to upload csv files that contain data about flights such as speed, altitude, direction, etc and detect anomalies between them.</br>
The user needs to upload 2 csv files - one represents normal data of each feature of the flight and the other is the file that the user wants
to detect anomalies with. The user also needs to choose the detection algorithm that the app will use to find anoamalies.</br>
First, The app will train the anomaly detection model according to the data of the normal file and after that will calculate anomalies between features from the detect file by the trained model.</br>

## How it works?
The app listens on local host, port 8080 so type : "http://localhost:8080/" (http GET command) in your browser and you will get the home page of the app:
<img width="957" alt="‏‏לכידה" src="https://user-images.githubusercontent.com/54501031/118989022-5d7c8880-b98a-11eb-963e-07f9b6f30f4a.PNG"></br>

Then, choose a detection algorithm that you want to detect with, and upload 2 csv files as explained above (examples of these csv files appear in the project folder).</br>
When you click on "detect!" (http POST command) the app will calculate the correlated features and in cases of anomaly detection between them, the time ranges of the anomalies will be saved also.</br>
All the details of correlated features and anomalies between them will be sent back to the controller (server in our case) as JSON.</br>
The server creates a Json file called 'result.json' that will keep the data that got back from the model. After that the server will turn to the client side of the app (result.html page) that will transform the data from json to html table that will get back to the user as a response.</br>
Example:
<img width="946" alt="‏‏לכידה1" src="https://user-images.githubusercontent.com/54501031/119794204-fefe5f80-bedf-11eb-9946-b2de5510b7a6.PNG"></br>

## Implementation
This app was built with node.js and based on MVC software architectural pattern that has three main parts that run it, each part with its own designated responsibilities.</br>
The model is responsble to calculate the anomalies , the controller is responsible to connect the http requests from the client to the calculation of the model behind the scenes and the view is responsible to display the web pages to the client (with html pages). </br>
### [UML](https://github.com/nimrod97/Anomaly-detection-web-app/blob/main/Untitled%20Diagram.png)
<img src="https://github.com/nimrod97/Anomaly-detection-web-app/blob/main/Untitled%20Diagram.png" width="550" height="300">

## Collaborators
Developed by Nimrod Gabbay and Maor Malekan.</br>

## Explanation video
