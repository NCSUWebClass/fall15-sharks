# Citizen Science Project for CSC 342

## Project Description

NC State University's Paleontology Research Lab and the North Carolina Museum of Natural Sciences are working hard to get kids involved in scientific research. Middle school students are finding fossil shark teeth and measuring them to better understand the size of sharks that lived in NC around 10 million years ago. However, only local schools can participate. You will design and prototype an online tool for this citizen science, where anyone can perform a virtual fossil dig for shark teeth, then identify and measure the teeth in their collection.
 
#### Client

Dr. Terry Gates

#### Team Members

* Derek Schreiner
* Daniel Alley
* Kevin Reed
* Eric Anderson
* William Pruett
* Remington Campbell

## Installation

#### Dependencies

##### Required

* Python 3   (python3)
* MySQL
* pip   (python3-pip)

##### Optional

* MySQL Workbench

#### Process

1. Install Python 3, pip3, and sqlite if they are not already installed
2. Clone the repository
3. Navigate into the repository folder
4. Run the command ```virtualenv --python=python3.4 .env```
5. Source the python virtual environment using the command ```source .env/bin/activate```
6. From the same directory, run the command ```pip3 install -r requirements.pip```.  This will install the necessary Python libraries

## Running the app

#### Production

1. Source the virtual environment (same as step 5 above)
2. Run the command ```gunicorn --bind 0.0.0.0:8000 project.wsgi:app```
3. The site will be made available at http://0.0.0.0:8000/

Alternatively, run the command ```bash run-prod.sh```

#### Development

1. Source the virtual environment (same as step 5 above)
2. Run the command ```python3.4 run.py```
3. The site will be made available at http://0.0.0.0:8000/

