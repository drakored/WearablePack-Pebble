// *  ************************************************************************************** FIRST LINE
// *  Salesforce1 Pebble Dashbaord Sample App
// *  See documentation and disclaimer that are on GitHub before use
// *  **************************************************************************************
      var sf_instance = "https://na00.salesforce.com";   //The is what the Org ID or Salesforce Instance will look like
      var sf_owner_id = "005o0000000gk5FAAQ";            //this is the UUID of the Salesforce user (you)
      var sf_org_id = "00DG0000000jBCR";                 // store the org id we connect to
      var sf_known = false;                              // used to track if the connection to SF is established
      var client_id = "client id goes here";             // used to store your connected app's client id
      var client_secret = "client secret goes here";     // used to store your connected app's client secret
      // these are the two arrays to store all the values for the reports 
      var reportName = ["to Salesforce1","to manage OAuth","in the Pebble App"];
      var reportValue = ["Log In","on your phone","in SETTINGS"];
// *  ***************************************************************************************
// *  ***************************************************************************************

//Set up a global Access Token to store the response from Salesforce - so it is available easily
//If you are debugging your code, use the below as a sample fo what the token should look like
var sf_access_token = "BEARER 00DG0000000jBCR!ARQ___sample_access_token_form_will_be_long___Z9Xx4VGP4DaN70_DanHca_on_GitHUB_susPIOEJJQKpVHEbZ1Ip";
// Setup a global variable for the refresh token
var sf_refresh_token = null;


//============================================================================================= REST Requests
// This is the function to send the REST request to Salesforce
//============================================================================================= REST Requests
var restRequest = function(restRqst, respAction, restOutput, refreshRecall, onComplete) {
  console.log("==========================REST Request==========================" );
  console.log('Action: ' + respAction);
  if(typeof(onComplete) != "function") {
    onComplete = function(){};
  }
  //Sample REST queries that could be used to retrieve data
  //query?q=SELECT+Id,Description+FROM+Report+WHERE+DeveloperName='Pebble_Watch_Summary_1'
  //query?q=SELECT+Id+FROM+User
  //analytics/reports/00Oi0000004hHWoEAM?includeDetails=false
  var returnValue = 0;
  var url = sf_instance.concat("/services/data/v30.0/");
    
  try {
    url = url.concat(restRqst);
    var csf = new XMLHttpRequest();
    csf.open("GET", url, false);
    csf.setRequestHeader('Authorization', sf_access_token);
    csf.setRequestHeader('Content-Type', 'application/json');


    //----------------------------------------------------------------------------------------- REST Response Handler
    // This is the function that will be called when the REST response is receive from Salesforce
    // It is responsible for parsing the data and storing it locally on the phone
    csf.onreadystatechange = function () {
      // Now check to see if the requst has completed 'readyState' is 4
      if (csf.readyState == 4) {
        // Check the status fo the request; '0' is connection failure; '200' is successful data
        switch (csf.status) {
          case 0:  // request is complete but unable to connect to Salesforce
            console.log('REST: received status 0, unable to connect');
            console.log(JSON.stringify(csf,null,4));
            // try to refresh the token
            console.log('refreshToken: ' + localStorage.getItem('refresh'));
            console.log('refreshRecall: ' + refreshRecall);
            // if we have a refresh token and this isn't the retry after refreshing
            if(localStorage.getItem('refresh') && !refreshRecall) {
              console.log('refresh: refreshing from http status 0 switch');
              // use the refresh token method
              refreshToken({onSuccess:function(){
                console.log('refresh: recalling original restRequest');
                // re-execute the rest functions to load the data, but disallow refreshing again
                restRequest(restRqst, respAction, restOutput, true);
                console.log('refresh: returned from recalling original restRequest');
              },onFailure:function(err){
                console.log('refresh failed: ');
                console.log(JSON.stringify(err,null,4));
                reportName[restOutput] = "LogIn to SF1 on Phone";
                reportValue[restOutput] = "Refresh Failed";
                onComplete();
              }});
            } else {
              console.log('restRequest failed, either no refresh token available to retry login, or refreshRecall already made');
              reportName[restOutput] = "LogIn to SF1 on Phone";
              reportValue[restOutput] = "Connection Failed";
              onComplete();
            }            
            break;
          case 200: // request is complete and data was received.
            // Parse the JSON response
            var JSONresponse = JSON.parse(csf.responseText);
            switch (respAction) {
              case 'ReportName': 
                // There should only exactly one report return [0], otherwise there is an issue
                if (JSONresponse.totalSize == 1) {
                  //Store the data but make sure it will fit on the Pebble sceen
                  try {
                  var tempName = JSONresponse.records[0].Description;
                  reportName[restOutput] = tempName.substring(0,30);
                  var reportID = JSONresponse.records[0].Id;
                  var urd = "analytics/reports/"+reportID+"?includeDetails=false";
                  console.log(">>>>>>>>>>>>>>>>>>>>>>>Search Report Data<<<<<<<<<<<<<<<<<<<<<<<")
                  restRequest(urd, "ReportData", restOutput, false);
                  }
                  catch(err) {
                    reportName[restOutput] = "Invalid Total or Desc.";
                    reportValue[restOutput] = "Report Error";
                    onComplete();
                  }
                } else {
                  reportName[restOutput] = "Report Missing";
                  reportValue[restOutput] = "Unknown";
                  onComplete();
                }
                break;
              case 'ReportData': 
                // Pull the data from the report that is stored in the first [0] 'Total' element
                var reportSUM = JSONresponse.factMap["T!T"].aggregates[0].label;
                // Get the data but make sure it will fit on the Pebble screen
                reportValue[restOutput] = reportSUM.substring(0,30);
                console.log('returning data from reportdata switch');
                onComplete();
                break;
              default: console.log("UNKNOWN respAction");
                reportName[restOutput] = "Check your phone";
                reportValue[restOutput] = "Unable to connect";
                onComplete();
            } //End of Switch for respAction
            break;
          default: console.log("csf.status message not reconized.");
            reportName[restOutput] = "Check your phone";
            reportValue[restOutput] = "No data received";
            onComplete();
          } //End of Switch Case for csf.status
        }; //End of ReadyState = 4 if block  
      }; //End of the function call that is tracking the csf.onreadystatechange
    //----------------------------------------------------------------------------------------- REST Response Handler    
  
  csf.send(null);  //Sends the request to Salesforce.
  onComplete();
  console.log("__________________________REST Complete________________________" );
  }
  catch(err) {
    console.log('received exception: ' + err);
    reportName[restOutput] = "LogIn to SF1 on Phone";
    reportValue[restOutput] = "Connection Refresh Failed";
    onComplete();
  }
  return returnValue;
};

var refreshToken = function(options) {
  try {
    console.log("__________________________Token Refresh Started________________________" );
    var refreshUrl = "https://login.salesforce.com/services/oauth2/token";
    var params = "grant_type=refresh_token&client_id=" + client_id + "&client_secret=" + client_secret + "&refresh_token=";
    console.log(localStorage.getItem('refresh'));
    params = params.concat(localStorage.getItem('refresh'));
    console.log(refreshUrl);
    console.log(params);
    var csf = new XMLHttpRequest();
    csf.open("POST", refreshUrl, false);
    csf.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    csf.setRequestHeader("Content-length", params.length);

    csf.onreadystatechange = function () {
      if (csf.readyState == 4) {
        console.log('refresh readystate 4 met');
        // Check the status fo the request; '0' is connection failure; '200' is successful data
        switch (csf.status) {
          case 0:  // request is complete but unable to connect to Salesforce
            console.log('refresh status 0 found');
            options.onFailure();
            break;
          case 200: // request is complete and data was received.
            // Parse the JSON response
            console.log('refresh 200 received');
            var results = JSON.parse(csf.responseText);
            console.log(JSON.stringify(csf, null, 4));
            
            sf_access_token = results.access_token;
            var t_bearer = "Bearer ";
            sf_access_token = t_bearer.concat(sf_access_token);

            sf_instance = results.instance_url;

            var ownerlist = results.id.split("/");
            sf_owner_id = ownerlist[5];
            sf_org_id = ownerlist[4];

            // we now have access to salesforce again
            sf_known = true;

            localStorage.setItem('saved', true);
            localStorage.setItem('owner', sf_owner_id);
            localStorage.setItem('orgid', sf_org_id);
            localStorage.setItem('token', sf_access_token);
            localStorage.setItem('instance', sf_instance);

            console.log('refresh: debugging localStorage');
            for(var i=0;i<localStorage.length;i++) {
              console.log(localStorage.key(i) + ': ' + localStorage.getItem(localStorage.key(i)));
            }
            // execute the callback
            console.log('exiting refreshToken method');
            options.onSuccess();
            break;
          default:
            console.log('refresh found unplanned status');
            console.log(JSON.stringify(csf,null,4));
            options.onFailure();

          } //End of Switch Case for csf.status
        }; //End of ReadyState = 4 if block  
      }; //End of the function call that is tracking the csf.onreadystatechange
    //----------------------------------------------------------------------------------------- REST Response Handler    
  
    csf.send(params);  //Sends the request to Salesforce.
    console.log('refresh completed send');
  } catch(err) {
    console.log('refresh passing failure message');
    options.onFailure(err);
  }
  console.log("__________________________Token Refresh Complete________________________" );
  return 0;
}
//============================================================================================= REST Requests
//============================================================================================= Ready
// This is the function to listen to the first initialization event from the Pebble watch
//============================================================================================= Ready
Pebble.addEventListener("ready",
  function(e) {
    console.log("SF1 PB: Initialized");
    sf_known = localStorage.getItem('saved');
    if (sf_known=='true') {
      console.log("Token from memory");
      sf_access_token = localStorage.getItem('token');
      sf_refresh_token = localStorage.getItem('refresh');
      sf_owner_id = localStorage.getItem('owner');
      sf_org_id = localStorage.getItem('orgid');
      sf_instance = localStorage.getItem('instance');
      var dict = {KEY_DASHBOARD : 0};
      Pebble.sendAppMessage(dict);
    } else {
      console.log("No Token");
    }
  }
);
//============================================================================================= Ready
//============================================================================================= App Message
// Review the incoming message, Only interested in knowing which Dashboard to reload
//============================================================================================= App Message
Pebble.addEventListener("appmessage",
  function(e) {
    console.log("SF1 PB: AppMessage");
    console.log(JSON.stringify(e,null,4));
    var vDB = e.payload.KEY_DASHBOARD;    //Store the dashboard to refresh in a shorter variable
    var iDB = parseInt(vDB);              //Store the integer version of the dashbard number
    if (iDB >= 0 && iDB < 3) {            //Make sure it is one of the dashboards we want to see
        // Define the REST command to send to Salesforce1
        url = "query?q=SELECT+Id,Description+FROM+Report+WHERE+DeveloperName='Pebble_Watch_Summary_"+vDB+"'";
        console.log(">>>>>>>>>>>>>>>>>>>>>>Find the Report Name<<<<<<<<<<<<<<<<<<<<<<")
        restRequest(url, "ReportName", iDB, false, function(){
          console.log('entering appmessage callback from restRequest');
          var dict = { KEY_MSG_TYPE : iDB, KEY_MSG_NAME : reportName[iDB], KEY_MSG_VALUE : reportValue[iDB]};
          Pebble.sendAppMessage(dict);
        });
        // Now send the results back to the Pebble
        
    }
    console.log("Done  addEventListener"); 
  }
);
//============================================================================================= App Message
//============================================================================================= Configuration Screen
// Here is the code that manages the Salesforce Login and OAuth process
//============================================================================================= Configuration Screen
Pebble.addEventListener("showConfiguration", function() {
  console.log('showing OAuth loging page');
  // The client_id is common for all Salesforce Orgs so this line does NOT need to change
  // The redirect_uri is how the Salesforce OAuth page knows to send control back to the Pebble App on the phone
  var url = "https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9xOCXq4ID1uH7MEYOng_Ctk_BGeQGT5T8HY6LrCgY.0SEtGTN8PHVpoeVTS3KjqJYaZDQpmkccCJvekNx&redirect_uri=pebblejs%3A%2F%2Fclose";
  // This opens the Salesforce OAuth page on the phone then continues processing.
  // The response from the OAuth page is handled by 'webviewclose'
  Pebble.openURL(url);
});
//============================================================================================= Configuration Screen
//============================================================================================= OAuth Response
// Here is the code that manages the Salesforce Login and OAuth process
//============================================================================================= OAuth Response
Pebble.addEventListener("webviewclosed", function(e) {
  // The Salesforce OAuth window is closed; now parse the response string, 
  // there may be other parse options but this works and is flexible.
  try {
    // 22-sept-2014-rtuttle, added if block to ignore when android executes this event twice (once proper, once 'CANCELLED')
    if(e.response != 'CANCELLED') {
      console.log('-----webviewclosed-------');
      console.log(JSON.stringify(e,null,4));
      console.log(e.response);
      var args = e.response.split("&");

      var results = {};
      for (i in args) {
        keyval = args[i].split('=');
        results[keyval[0]] = keyval[1];
      }

      console.log(JSON.stringify(results,null,4));

      sf_access_token = results.access_token;
      // Now create the structure for all future calls ... needs to start with 'Bearer'
      var t_bearer = "Bearer ";
      sf_access_token = t_bearer.concat(sf_access_token);

      // The OAuth response also contains other valuable details to log, capture it now
      // The instance name is needed to direct all api connections to the right SF URL
      sf_instance = results.instance_url;

      // Store the refresh token so the app can re-auth later without having 
      sf_refresh_token = results.refresh_token;
    
      // The Users' UUID is good to have but not used in this sample code.
      // You will need if you are creating records or want to get more details about the user.
      // Additionally you could get the refresh token to extend the connection if the token expires
      var ownerlist = results.id.split("/");
      sf_owner_id = ownerlist[5];
      sf_org_id = ownerlist[4];

      console.log("Login Done.");
      sf_known = true;
      // Use 'localStorage' to make the data persistent so you can leave the app and return 
      // without login in every time.
      localStorage.setItem('saved', true);
      localStorage.setItem('token', sf_access_token);
      localStorage.setItem('refresh', sf_refresh_token);
      localStorage.setItem('orgid', sf_org_id);
      localStorage.setItem('owner', sf_owner_id);
      localStorage.setItem('instance', sf_instance);
    
      // It was a successful login so tell the watch to start the load process for first dashboard
      var dict = {KEY_DASHBOARD : 0};
      Pebble.sendAppMessage(dict);
    } // end if not duplicate 'CANCELLED' android webviewclose event
  }
  catch(err) {
    console.log("NOT LOGGED ON - Canceled or invalid OAuth result"); 
    sf_known = false;
    sf_access_token = "no access token - please log in";
    sf_refresh_token = "";
    sf_owner_id = "no user identified";
    sf_org_id = "no org identified";
    sf_instance = "not connected";
    localStorage.setItem('saved', false);
    localStorage.setItem('token', sf_access_token);
    localStorage.setItem('refresh', sf_refresh_token);
    localStorage.setItem('owner', sf_owner_id);
    localStorage.setItem('orgid', sf_org_id);
    localStorage.setItem('instance', sf_instance);
  }
});
//============================================================================================= OAuth Response
// *  ***************************************************************************************** LAST LINE
