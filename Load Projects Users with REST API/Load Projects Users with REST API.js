
//########## Script Steps ##############

function Test(params)
{
	//Delete the old projects
	deleteOldProjects();

	//Create the new projects and users
	createProjectsAndUsers();

	//Populate missing Components and Releases
	populateComponentsReleases();





}

g_load_libraries=["%g_browserLibrary:Firefox HTML%","Web Service"];



