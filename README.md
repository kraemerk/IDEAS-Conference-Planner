# IDEAS Conference Planner

This is a conference planning tool specifically designed for the annual IDEAS conference hosted by the Georgia Department of Education.

[Release Notes](RELEASE-NOTES.md)

## Requirements
This application is designed to run on a variety of operating systems. It has been tested on Windows, GNU/Linux, and macOS

This application requires a working PostgreSQL database. The installation and configuration process is covered below.

## Installation

1. Install PostgreSQL
	> NOTE: This code has been extensively tested with PostgreSQL version 11. Using this version is highly recommended.
	1. [Postgres can be downloaded from this link](https://www.postgresql.org/download/)
	2. Run the Installer
	> NOTE: When choosing a password, keep in mind that this password will be stored in plaintext. Please do not choose anything confidential
	3. When selecting the port, we recommend using the default value (5432)
2. Configure the Database
	1. Open pgadmin (should be in the Start Menu in the PostgreSQL folder)
	2. On the left, in the server browser, click on `Servers`, then `PostgreSQL`, and enter the password.
	3. It the server browser, right click on `Databases`, then select `Create -> Database`
		1. Enter a name for the database (we used 'IDEAS') and click save.
	4. In the server browser, right click on this newly created database, and select `Query Tool...`
	5. Above this new window, press the `Open File` button, and select the file: `database/build.sql` from this repository.
	6. Click the lightning bolt to run the script.
	7. You can now close the browser window.
3. Download and extract this application from [fix this link](google.com)
4. Initialize the Config file.
	1. Navigate to the `ideas-conference-planner` folder
	2. Create a Copy of `config-template.ini` and rename it to `config.ini`
	3. Open this file in the text editor of your choice.
		1. Leave the host and port at their default setting, unless you installed postgresql with another port/on another computer
			(if you installed postgresql on another computer, set host to that computer's ip address)
		2. Set the username (should be 'postgres' by default)
		3. Set password to whatever you selected earlier
		4. Set the database to whatever you named the database (in our example, 'IDEAS')
		5. Set the schema to 'ideas'
		6. Set the api_key, event_id, speaker_id, and speaker_role_id based off of the eventmobi data

## Usage
 - Simply launch this application by clicking on the exe file.
 - First, you will want to import the databases by selecting `Choose File` and opening the csv file which has been exported from JotForm
 - Next, add a user, then select this user.
 - Then, you can press `Edit Categories` to add new categories, and rename or remove existing ones.
 - Now, you can select any presentation and set a category or rate it.
 - You can also use the `Sync to EventMobi` button anytime to sync the changes between the database and EventMobi.

All changes are stored in the Postgres Database

<br/><br/><br/><br/><br/>

## Dependencies
- npm / node.js 

	[You can download it from this link](https://www.npmjs.com/get-npm)

## Building the Application
### Configure npm
Run the following from within a terminal window in this folder.
```
cd ideas-conference-planner
npm install
```

### Run the application
Run the following from within a terminal window in the folder `ideas-conference-planner`:
`npm start`


## Packaging
>TODO: Packaging Step
```
npm install electron-builder
``