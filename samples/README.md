Wear Pack for Pebble
====================



Installation
------------

*Salesforce1 Pebble Dashboard* sample application requires the installation of
the GitHub package on your phone and the creation of three Salesforce Reports in
your Salesforce Org/Instance.  This document will outline the prerequisites and
required steps.  These instructions and the testing have been done with an
iPhone5.



### Prerequisites

1.  Install the Pebble App on your phone and enable the Pebble Developer Mode.

    -   From the "App Store" search for the Pebble Smartwatch app from Pebble
        Technologies.

    -   Install the App.

    -   Enable Developer Mode, in iOS you open the iPhone's Settings and find
        the Pebble app.  Then toggle on "Developer Mode".

    -   From the Pebble Smartwatch app, go to the menu list and select
        "DEVELOPER" and toggle it on.  It will time-out regularly so you will
        need to turn it off then on again to reset it.

2.  Sign-up for a CloudPebble account.

    -   Go to <https://cloudpebble.net/> and sign up for an account.

    -   It is recommended you try the 'Hello World' guide to make sure
        everything is working properly.

        -   <https://developer.getpebble.com/2/guides/>

    -   You will normally need your smartphone and computer on the same network
        to download new Pebble applications.

3.  Get a Salesforce Org/Instance available for use.

    -   A free Developer Edition Org is available at
        <https://developer.salesforce.com/signup> .

    -   Note: enter a real email address that but your user name should be
        something like "your.name@pebble.test".  You will get a confirmation
        after a few minutes to complete the sign up process.



### Installation

1.  Install the *Salesforce1 Pebble Dashboard.*

    -   In the CloudPebble web console select "PROJECTS".

    -   Choose "IMPORT".

    -   Select "IMPORT FROM GITHUB".

    -   Use "Salesforce1" or a similar name that you want to be displayed from
        the app list on the smartwatch.

    -   Enter "github.com/developerforce/WearablePack-Pebble" for the GITHUB
        PROJECT.

    -   Then click IMPORT and wait for the load to complete.

    -   Select "COMPILATION" on the left side bar in CloudPebble web console.

    -   Select "RUN BUILD".

    -   It is suggested that you toggle the "DEVELOPER" setting in the Pebble
        smartwatch application off then on again to make sure it hasn't timed
        out.  Make sure it is ON.

    -   Select "INSTALL AND RUN" to download the *Salesforce1 Pebble Dashboard*
        to your Pebble watch.  It may take one or two minutes but if it take any
        longer it likely did not establish a suitable connection; try refreshing
        the browser page and making sure you are on the same WiFi network.

2.  Log into Salesforce.

    -   In the Pebble App on your smartphone, go to the "MY PEBBLE" page that
        will show all the custom apps you have on the watch.

    -   Click on the watch icon that is now on the screen with the name you
        installed. eg. "Salesforce1"

    -   Click on "SETTINGS".

    -   Enter your Salesforce credentials (user name and password).

    -   You may be told that you need to provide a verification code that will
        be emailed or SMS within a few minutes.  You need to provide that 5
        digit code here.

    -   Next you will be prompted to "Allow" the Pebble watch application to use
        the APIs to connect to Salesforce.

3.  Create the Salesforce Reports.

    -   From a web browser, log in to <https://login.salesforce.com> .

    -   Click on the "Reports" tab.

    -   Select a report, for example under the "Administrative Reports" select
        "All Active Users".  Click on the "Customize" button then "Save As" or
        "Save".

    -   Make sure the "Report Properties" are updated to have "Report Unique
        Name" set to **Pebble_Watch_Summary_0** and the "Report Description" is
        a short string describing the report.

4.  Select the App on your Watch.

    -   Click on the top row to see the dashboard information.



This sample application is part of the [Salesforce Wear Developer Pack][2], a
collection of open-source starter apps that let you quickly design and build
wearable apps that connect to the Salesforce1 Platform.

[2]: <http://developer.salesforce.com/wear>



Getting Started
===============

Please refer to the [getting started guide][1] for details on how to run and
test the app and about the underlying app architecture and code.

[1]: <http://developer.salesforce.com/wear>






