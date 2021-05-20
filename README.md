# Anomaly-detection-web-app
web application that allows many users to upload csv files that contain data about flights such as speed, altitude, direction, etc.
The user needs to upload 2 csv files - one represents proper data of each feature of the flight and the other is the file that the user wants
to detect (according to the proper data). The user also needs to choose the detection algorithm that the app will use to find anoamalies.
First, The app will train the anomaly detection model according the data of the proper file and after that will calculate anomalies between features from the detect file by the trained model.

## How it works?
The app listens at port 8080 so type : "http://localhost:8080/" (GET command) and you will get the home page of the app:
<img width="957" alt="‏‏לכידה" src="https://user-images.githubusercontent.com/54501031/118989022-5d7c8880-b98a-11eb-963e-07f9b6f30f4a.PNG">
Then, choose a detection algorithm that you want that to detect with, and upload 2 csv files as explained below.
When you click "detect!" (POST command) the app will calculate the correlated features and in cases of anomaly detection between them, the time of the anomalies will be 
saved also.
All the details of correlated features and anomalies between them will be sent back to the user as JSON.
Example:
![Inked‏‏לכידה PNG1_LI](https://user-images.githubusercontent.com/54501031/118995474-d9c59a80-b98f-11eb-95fb-9359096043ef.jpg)

## Implementation
This App based on MVC software architectural pattern that has three main parts that run it, each part with its own designated responsibilities. </br>
The model is responsble to calculate the anomalies , the controller is the server that responsible to connect the http requests from the client , to the calculation of the model behind the scenes. The view is responsible to display the web pages to the client (with html pages). 
