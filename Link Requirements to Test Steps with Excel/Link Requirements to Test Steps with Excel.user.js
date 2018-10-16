//Put your custom functions and variables in this file
var username = 'administrator';
var apiKey = '{25070416-723F-4FF1-8B38-A810C7EF1BA6}';
var projectId = 1;	/* Sample: LIS */

//Documentation on Inflectra website
//http://api.inflectra.com/Spira/Services/v5_0/RestService.aspx

function Init()
{
	//Set the correct URL
	Session.SetUrl('http://api.inflectra.com/Spira', 'http://doctor/SpiraTeam');
}

function LoadRequirementTestStepTraceability()
{
	//Attach to the sheet
	SeS('DataToLoad').DoAttach('%WORKDIR%\DataToLoad.xlsx', 'Requirement-TestSteps');
	while (SeS('DataToLoad').DoSequential())
	{
		//Create the association between the requirement and the test step
		var newAssociation = {
			"RequirementId": SeS('DataToLoad').GetCell('Requirement ID'),
			"TestStepId": SeS('DataToLoad').GetCell('Test Step ID')
		};
		
		//Excute the REST call
		SeS('RequirementTestStepCoverage_AddTestStepCoverage').SetCredential(username, apiKey);
		SeS('RequirementTestStepCoverage_AddTestStepCoverage').SetRequestBodyObject(newAssociation);
		SeS('RequirementTestStepCoverage_AddTestStepCoverage').DoExecute({"project_id": projectId});
	}	
}

function wcfDate(date)
{
	return '/Date(' + date.getTime() + '-0500)/';
}