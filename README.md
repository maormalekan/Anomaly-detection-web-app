# Anomaly-detection-web-app
A web application that allows many users to upload csv files that contain data about flights such as speed, altitude, direction, etc and detect anomalies between them.</br>
The user needs to upload 2 csv files - one represents proper data of each feature of the flight and the other is the file that the user wants
to detect anomalies with. The user also needs to choose the detection algorithm that the app will use to find anoamalies.</br>
First, The app will train the anomaly detection model according to the data of the proper file and after that will calculate anomalies between features from the detect file by the trained model.</br>

## How it works?
The app listens on local host, port 8080 so type : "http://localhost:8080/" (http GET command) in your browser and you will get the home page of the app:
<img width="957" alt="‏‏לכידה" src="https://user-images.githubusercontent.com/54501031/118989022-5d7c8880-b98a-11eb-963e-07f9b6f30f4a.PNG"></br>

Then, choose a detection algorithm that you want to detect with, and upload 2 csv files as explained above.</br>
When you click on "detect!" (http POST command) the app will calculate the correlated features and in cases of anomaly detection between them, the time ranges of the anomalies will be saved also.</br>
All the details of correlated features and anomalies between them will be sent back to the user as JSON.</br>
Example:
![Inked‏‏לכידה PNG1_LI](https://user-images.githubusercontent.com/54501031/118995474-d9c59a80-b98f-11eb-95fb-9359096043ef.jpg)</br>

## Implementation
This app was built with node.js and based on MVC software architectural pattern that has three main parts that run it, each part with its own designated responsibilities.</br>
The model is responsble to calculate the anomalies , the controller is responsible to connect the http requests from the client to the calculation of the model behind the scenes and the view is responsible to display the web pages to the client (with html pages). </br>
### UML
<img src="https://github.com/nimrod97/Anomaly-detection-web-app/blob/main/Untitled%20Diagram.jpg" width="400" height="400">

## Collaborators
Developed by Nimrod Gabbay and Maor Malekan.</br>

## Explanation video
