// const cds = require('@sap/cds');
// const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
// const { getDestination } = require('@sap-cloud-sdk/connectivity');

// const _postWorkFlow = async function (res, MissingScopeItems) {
//     try {
//         // Build workflow context payload
//         const workflowContext = {
//             "definitionId": "us10.33d86b24trial.ctl.cTLProcess", 
//             "context": res
//         };

//         console.log(`[INFO] Workflow context payload: ${JSON.stringify(workflowContext)}`);

//         // Retrieve destination configuration
//         const destination = await getDestination({
//             destinationName: 'ProcessAutomation' // Replace with the correct destination name
//         });

//         if (destination) {
//             // Check for any authentication token errors
//             destination.authTokens?.forEach(authToken => {
//                 if (authToken.error) {
//                     throw new Error(`Error in authToken: ${authToken.error}`);
//                 }
//             });
//             console.log(`[INFO] Destination retrieved successfully: ${JSON.stringify(destination)}`);
//         } else {
//             throw new Error('Destination is undefined.');
//         }

//         // Make the HTTP POST request to the workflow API
//         const response = await executeHttpRequest(destination, {
//             method: 'POST',
//             url: '/workflow/rest/v1/workflow-instances', // Ensure this matches the required endpoint
//             data: workflowContext,
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         if (!response.data) {
//             throw new Error('No data returned from the workflow service');
//         }

//         console.log(`[INFO] Workflow started successfully. Response: ${JSON.stringify(response.data)}`);

//         // Optionally update your entity
//         // await UPDATE(RequestCapture).set({ wfRequestId: response.data.id }).where({ ID: res.ID });

//         return response.data;

//     } catch (error) {
//         console.error(`[ERROR] Failed to start workflow instance: ${error.message}`);
//         console.error(`[ERROR] Error Details: ${JSON.stringify(error)}`);
//         throw new Error(`Failed to start workflow instance: ${error.message}`);
//     }
// };

// module.exports = { _postWorkFlow };















const cds = require('@sap/cds');

const _postWorkFlow = async function (res, MissingScopeItems) {
    try {
        // Build workflow context payload
        const workflowContext = {
            "definitionId": "us10.33d86b24trial.ctl.cTLProcess", 
            "context": {}
        };
        
        console.log(`[INFO] Workflow context payload: ${JSON.stringify(workflowContext)}`);


       const wfAPI = await cds.connect.to('processautomation');
       // const result = await wfAPI.send('POST', '/workflow/rest/v1/workflow-instances', workflowContext, { "Content-Type": "application/json" });
    


        // Connect to ProcessAutomation service defined in CAP project
        // var workflow = await cds.connect.to('ProcessAutomationWorkflow');

        // console.log(`[INFO] Connected to ProcessAutomation service. Sending request to start workflow...`);

        // const response = await workflow.send({
        //     method: 'POST',
        //     path: `/rest/v1/workflow-instances`,
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Accept": "application/json"
        //     },
        //     data: {
        //         "definitionId": definitionID,
        //         "context": contextData
        //     }
        // });

        // Send the POST request to create a workflow instance
        const result = await wfAPI.send('POST', '/workflow/rest/v1/workflow-instances', workflowContext, {
            headers: { 
                "Content-Type": "application/json"
            }
        });
        console.log("Request Headers: ", req.headers);
console.log("Workflow Context: ", workflowContext);


        console.log(`[INFO] Workflow started successfully. Response: ${JSON.stringify(result)}`);
        
        // You can update your entity if needed (commented out)
        // await UPDATE(RequestCapture).set({ wfRequestId: result.id }).where({ ID: res.ID });

        return result;

    } catch (error) {
        console.error(`[ERROR] Failed to start workflow instance: ${error.message}`);
        console.error(`[ERROR] Error Details: ${JSON.stringify(error)}`);
        throw new Error(`Failed to start workflow instance: ${error.message}`);
    }
};


module.exports = { _postWorkFlow };
