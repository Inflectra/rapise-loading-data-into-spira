//Put your custom functions and variables in this file
var templatesAndSampleProjectIds = [1,2,3];
var templateId = 2;
var sampleProjectId = 1;	/* Library Information System */

var PROJECT_ROLE_PROJECT_OWNER = 1;
var PROJECT_ROLE_TESTER = 4;

var username = 'administrator';
var apiKey = '......';

//Populates a relase and some components to all non-template/sample projects
function populateComponentsReleases()
{
	//get the list of projects
	SeS('Project_Retrieve').SetCredential(username, apiKey);
	SeS('Project_Retrieve').DoExecute();
	var projects = SeS('Project_Retrieve').GetResponseBodyObject();
	Tester.Message('Found ' + projects.length + ' project(s).');
	var count = 0;
	for (var i = 0; i < projects.length; i++)
	{
		//Populate the project unless it's one of the special ones we are asked to leave
		var project = projects[i];
		var projectId = parseInt(project.ProjectId);
		if (!contains(templatesAndSampleProjectIds, projectId))
		{
			Tester.Message('Populating project PR' + project.ProjectId + ' - ' + project.Name);
			
			//Create one release and several components
			var newRelease = {
				"ProjectId": projectId,
				"Name": "Sample Release 2.0.0.0",
				"VersionNumber": "2.0.0.0",
				"CreationDate": wcfDate(new Date()),
				"Summary": true,
				"ReleaseStatusId": 2,
				"ReleaseTypeId": 1,
				"StartDate": wcfDate(new Date("4/1/2018")),
				"EndDate": wcfDate(new Date("12/31/2018"))
			};
			SeS('Release_Create1').SetCredential(username, apiKey);
			SeS('Release_Create1').SetRequestBodyObject(newRelease);
			SeS('Release_Create1').DoExecute({"project_id": projectId});
			
			var components = ["GUI", "Functionality", "Registration", "Performance"];
			for (var k = 0; k < components.length; k++)
			{
				var newComponent = {
					"ProjectId": projectId,
					"Name": components[k],
					"IsActive": true,
					"IsDeleted": false
				};
				SeS('Component_Create').SetCredential(username, apiKey);
				SeS('Component_Create').SetRequestBodyObject(newComponent);
				SeS('Component_Create').DoExecute({"project_id": projectId});
			}
			count++;
		}
	}
	
	Tester.Message('Populated ' + count + ' project(s).');
}

function wcfDate(date)
{
	return '/Date(' + date.getTime() + '-0500)/';
}

//Deletes all projects except the two template ones and the sample
function deleteOldProjects()
{
	//get the list of projects
	SeS('Project_Retrieve').SetCredential(username, apiKey);
	SeS('Project_Retrieve').DoExecute();
	var projects = SeS('Project_Retrieve').GetResponseBodyObject();
	Tester.Message('Found ' + projects.length + ' project(s).');
	var count = 0;
	for (var i = 0; i < projects.length; i++)
	{
		//Delete the project unless it's one of the special ones we are asked to leave
		var project = projects[i];
		var projectId = parseInt(project.ProjectId);
		if (!contains(templatesAndSampleProjectIds, projectId))
		{
			Tester.Message('Deleting project PR' + project.ProjectId + ' - ' + project.Name);
			SeS('Project_Delete').SetCredential(username, apiKey);
			SeS('Project_Delete').DoExecute({"project_id": projectId});
			count++;
		}
	}
	Tester.Message('Deleted ' + count + ' project(s).');
}

function createProjectsAndUsers()
{
	//Loop through the data
	Spreadsheet.DoAttach('%WORKDIR%/DataToLoad.xlsx');
	while (Spreadsheet.DoSequential())
	{
		//Project
		var projectName = Spreadsheet.GetCell('Project Name');
		var organization = Spreadsheet.GetCell('Organization');
		
		//User 1
		var firstName1 = Spreadsheet.GetCell('First Name 1');
		var lastName1 = Spreadsheet.GetCell('Last Name 1');
		var email1 = Spreadsheet.GetCell('Email Address 1');
		var login1 = Spreadsheet.GetCell('Login Name 1');

		//User 2
		var firstName2 = Spreadsheet.GetCell('First Name 2');
		var lastName2 = Spreadsheet.GetCell('Last Name 2');
		var email2 = Spreadsheet.GetCell('Email Address 2');
		var login2 = Spreadsheet.GetCell('Login Name 2');
		
		//Populate project
		var newProject = {
			Name: projectName,
			Description: '' + organization
		};
		
		//Create the project first using the template
		Tester.Message('Creating project \'' + projectName + '\' using template PR' + templateId);
		SeS('Project_Create').SetCredential(username, apiKey);
		SeS('Project_Create').SetRequestBodyObject(newProject);
		SeS('Project_Create').DoExecute({"existing_project_id": templateId});
		newProject = SeS('Project_Create').GetResponseBodyObject();
		var newProjectId = newProject.ProjectId;
		Tester.Message('Created project \'' + projectName + '\', new ID=' + newProjectId);
		
		//Now add the users to the system and the project
		if (login1 && login1 != '')
		{
			Tester.Message('Adding user \'' + login1 + '\' to project ' + projectName);
			
			//Add user to their project as project owner
			var params = {
				"password": "changeme",
				"password_question": "What is 1+1?",
				"password_answer": "2",
				"project_id": newProjectId,
				"project_role_id": PROJECT_ROLE_PROJECT_OWNER
			};
			var newUser = {
				"FirstName": firstName1,
				"LastName": lastName1,
				"UserName": login1,
				"EmailAddress": email1,
				"Admin": false,
				"Active": true,
				"Approved": true,
				"Locked": false
			};
			SeS('User_Create').SetRequestBodyObject(newUser);
			SeS('User_Create').SetCredential(username, apiKey);
			SeS('User_Create').DoExecute(params);
			newUser = SeS('User_Create').GetResponseBodyObject();
			var newUserId = newUser.UserId;
			
			//Add user to sample project as 'tester'
			var newAllocation = {
				"ProjectId": sampleProjectId,
				"UserId": newUserId,
				"ProjectRoleId": PROJECT_ROLE_TESTER
			};
			SeS('ProjectUser_AddUserMembership').SetCredential(username, apiKey);
			SeS('ProjectUser_AddUserMembership').SetRequestBodyObject(newAllocation);
			SeS('ProjectUser_AddUserMembership').DoExecute({ "project_id": sampleProjectId });
		}

		if (login2 && login2 != '')
		{
			Tester.Message('Adding user \'' + login2 + '\' to project ' + projectName);
			
						//Add user to their project as project owner
			var params = {
				"password": "changeme",
				"password_question": "What is 1+1?",
				"password_answer": "2",
				"project_id": newProjectId,
				"project_role_id": PROJECT_ROLE_PROJECT_OWNER
			};
			var newUser = {
				"FirstName": firstName2,
				"LastName": lastName2,
				"UserName": login2,
				"EmailAddress": email2,
				"Admin": false,
				"Active": true,
				"Approved": true,
				"Locked": false
			};
			SeS('User_Create').SetRequestBodyObject(newUser);
			SeS('User_Create').SetCredential(username, apiKey);
			SeS('User_Create').DoExecute(params);
			newUser = SeS('User_Create').GetResponseBodyObject();
			var newUserId = newUser.UserId;
			
			//Add user to sample project as 'tester'
			var newAllocation = {
				"ProjectId": sampleProjectId,
				"UserId": newUserId,
				"ProjectRoleId": PROJECT_ROLE_TESTER
			};
			SeS('ProjectUser_AddUserMembership').SetCredential(username, apiKey);
			SeS('ProjectUser_AddUserMembership').SetRequestBodyObject(newAllocation);
			SeS('ProjectUser_AddUserMembership').DoExecute({ "project_id": sampleProjectId });
		}
	}
}

function contains(/*Array*/arr, /*Number*/id)
{
	for (var j = 0; j < arr.length; j++)
	{
		if (arr[j] == id)
		{
			return true;
		}
	}
	return false;
}