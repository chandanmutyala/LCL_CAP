const cds = require('@sap/cds');




module.exports = cds.service.impl(async function () {
    const { ScopeItems, MissingScopeItems } = cds.entities;
    const workflow = require('./helper/workflow');


    this.on('resetAndInsertScopeItems', async (req) => {
        const newItems = req.data.items;
        console.log(`Received ${newItems.length} items for processing`);

        try {
            const db = await cds.connect.to('db');
            let insertedCount = 0;

            await db.tx(async (tx) => {
                // // Only delete existing records on the first batch
                // if (newItems[0].autoID) {
                //     // console.log("Deleting old records from ScopeItems table...");
                //     // await tx.run(DELETE.from(ScopeItems));
                // }

                console.log(`Inserting ${newItems.length} new records into ScopeItems table...`);
                for (let item of newItems) {
                    await tx.run(INSERT.into(ScopeItems).entries(item));
                    insertedCount++;
                }
            });

            console.log(`Successfully inserted ${insertedCount} records`);
            return { message: `${insertedCount} records inserted successfully!` };
        } catch (error) {
            console.error("Error during delete/insert operation:", error);
            req.error(500, `An error occurred while inserting data. ${error.message}`);
        }
    });

    this.on('deleteAllScopeItems', async (req) => {
        try {
            const db = await cds.connect.to('db');
            const affectedRows = await db.run(DELETE.from(ScopeItems));
            console.log(`Deleted ${affectedRows} records from ScopeItems table`);
            return { message: `${affectedRows} records deleted successfully` };
        } catch (error) {
            console.error("Error during delete operation:", error);
            req.error(500, `An error occurred while deleting old data. ${error.message}`);
        }
    });

    this.on('startWF', async (req) => {
        try {
            const workflowContext = {
                "definitionId": "eu10.mena-afria-eu10-fw9xdn1s.localizationworkflow.cTLProcess", //"us10.33d86b24trial.ctl.cTLProcess", 
                "context": {"name":"test-workflow"}
            };

            console.log(`[INFO] Workflow context payload: ${JSON.stringify(workflowContext)}`);

            const wfAPI = await cds.connect.to('processautomation');

            const result = await wfAPI.send('POST', '/workflow/rest/v1/workflow-instances', workflowContext, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Request Headers: ", req.headers);
            console.log("Workflow Context: ", workflowContext);

        } catch (error) {
            console.error("Error during delete operation:", error);
            req.error(500, `An error occurred while deleting old data. ${error.message}`);
        }
    });



    this.on('getUniqueValues', async (req) => {
        const { column } = req.data;

        if (!['ScopeItemID', 'Description', 'LOB', 'BusinessArea', 'Status'].includes(column)) {
            return req.error(400, `Invalid column name: ${column}`);
        }

        const query = SELECT.distinct.from(ScopeItems).columns(column);
        const result = await cds.run(query);

        return result.map(item => ({
            keey: item[column],
            text: item[column]
        }));
    });

    this.on('getUniqueValuesRms', async (req) => {
        const { column } = req.data;

        if (!['oppurtunityNumber', 'customerName', 'ScopeItemID'].includes(column)) {
            return req.error(400, `Invalid column name: ${column}`);
        }

        const query = SELECT.distinct.from(MissingScopeItems).columns(column);
        const result = await cds.run(query);

        return result.map(item => ({
            keey: item[column],
            text: item[column]
        }));
    });
    this.on('CREATE', 'MissingScopeItems', async (req) => {
        try {
            console.log(`[INFO] Received request to create MissingScopeItems: ${JSON.stringify(req.data)}`);

            let items = req.data;

            // Ensure items is an array, even if a single record is sent
            if (!Array.isArray(items)) {
                console.log(`[INFO] Single record received. Converting to array: ${JSON.stringify(items)}`);
                items = [items]; // Convert single object to an array with one element
            } else {
                console.log(`[INFO] Array of records received: ${JSON.stringify(items)}`);
            }

            // Fetch the max autoId to increment for the new entry
            console.log(`[INFO] Fetching maximum autoId from MissingScopeItems table...`);
            const autoIdResult = await this.run(SELECT.one.from(MissingScopeItems).columns('max(autoId) as maxID'));
            console.log(`[INFO] Current max autoId: ${JSON.stringify(autoIdResult)}`);

            // Starting point for the autoId (adjust the value as per your need)
            const startingID = 100;
            let currentMaxID = autoIdResult.maxID >= startingID ? autoIdResult.maxID : startingID - 1;
            console.log(`[INFO] Starting ID set to: ${currentMaxID + 1}`);

            // Loop through all the items sent in the payload and insert them one by one
            console.log(`[INFO] Beginning insertion of new records...`);
            const insertPromises = items.map(async (item, index) => {
                const newID = ++currentMaxID; // Increment the ID for each new record

                console.log(`[INFO] Preparing new record for insertion [Index: ${index + 1}] with ID: ${newID}`);
                const newScopeItem = {
                    autoId: newID,
                    id:newID,
                    customerOrProspect: item.customerOrProspect,
                    customerName: item.customerName,
                    brandGuardianStatus: 'In Progress',
                    globalServicesStatus: 'In Evaluation',
                    oppurtunityNumber: item.oppurtunityNumber,
                    priority: item.priority,
                    goLiveDate: item.goLiveDate,
                    revenue: item.revenue,
                    country: item.country,
                    industry: item.industry,
                    ScopeItemID: item.ScopeItemID,
                    Description: item.Description,
                    LOB: item.LOB,
                    BusinessArea: item.BusinessArea,
                    createdBy: 'Nywald',
                    createdOn: new Date(),
                };

                // Insert the new entry into the MissingScopeItems table
                console.log(`[INFO] Inserting new entry into the MissingScopeItems table: ${JSON.stringify(newScopeItem)}`);
                await this.run(INSERT.into(MissingScopeItems).entries(newScopeItem));
                console.log(`[INFO] Successfully inserted record with ID: ${newID}`);

                // Post to workflow and handle any workflow operations
                try {
                    console.log(`[INFO] Initiating workflow posting for new record: ${JSON.stringify(newScopeItem)}`);
                    await workflow._postWorkFlow(newScopeItem, MissingScopeItems);
                    console.log(`[INFO] Workflow posted successfully for ID: ${newID}`);
                } catch (workflowError) {
                    console.error(`[ERROR] Workflow posting failed for ID: ${newID} - ${workflowError.message}`);
                }

                return newScopeItem; // Return the newly inserted item
            });

            // Wait for all insert operations to complete
            await Promise.all(insertPromises);
            console.log(`[INFO] All records inserted successfully. Total records created: ${insertPromises.length}`);

            // Return a proper response (you could return created entities or simply null)
            return null; // Indicating successful creation without returning a message string
        } catch (error) {
            // Handle any errors during the insert operation
            console.error(`[ERROR] Error creating MissingScopeItems: ${error.message}`);
            req.error(500, `Error creating MissingScopeItems: ${error.message}`);
        }
    });


    // this.on('CREATE', 'MissingScopeItems', async (req) => {
    //     try {
    //         let items = req.data;

    //         // Ensure items is an array, even if a single record is sent
    //         if (!Array.isArray(items)) {
    //             items = [items]; // Convert single object to an array with one element
    //         }

    //         // Fetch the max autoId to increment for the new entry
    //         const autoIdResult = await this.run(SELECT.one.from(MissingScopeItems).columns('max(autoId) as maxID'));

    //         // Starting point for the autoId (adjust the value as per your need)
    //         const startingID = 100;
    //         let currentMaxID = autoIdResult.maxID >= startingID ? autoIdResult.maxID : startingID - 1;

    //         // Loop through all the items sent in the payload and insert them one by one
    //         const insertPromises = items.map(async (item) => {
    //             const newID = ++currentMaxID; // Increment the ID for each new record

    //             const newScopeItem = {
    //                 autoId: newID,
    //                 customerOrProspect: item.customerOrProspect,
    //                 customerName: item.customerName,
    //                 brandGuardianStatus: 'In Progress',
    //                 globalServicesStatus: 'In Evaluation',
    //                 oppurtunityNumber: item.oppurtunityNumber,
    //                 priority: item.priority,
    //                 goLiveDate: item.goLiveDate,
    //                 revenue: item.revenue,
    //                 country: item.country,
    //                 industry: item.industry,
    //                 ScopeItemID: item.ScopeItemID,
    //                 Description: item.Description,
    //                 LOB: item.LOB,
    //                 BusinessArea: item.BusinessArea,
    //                 createdBy: 'Nywald',
    //                 createdOn: new Date(),
    //             };

    //             // Insert the new entry into the MissingScopeItems table
    //            await this.run(INSERT.into(MissingScopeItems).entries(newScopeItem));

    //            const res = newScopeItem;

    //            await workflow._postWorkFlow(res, MissingScopeItems);
    //            console.log("res: ",newScopeItem);
    //            return res;
    //         });

    //         // Wait for all insert operations to complete
    //         await Promise.all(insertPromises);

    //         // Return a proper response (you could return created entities or simply null)
    //         return null; // Indicating successful creation without returning a message string
    //     } catch (error) {
    //         // Handle any errors during the insert operation
    //         req.error(500, `Error creating MissingScopeItems: ${error.message}`);
    //     }
    // });






    //this is working either of one column passing
    this.on('UPDATE', 'MissingScopeItems', async (req) => {
        try {
            const { autoId, brandGuardianStatus, globalServicesStatus } = req.data;

            // Fetch the current record for the given `autoId`
            const existingRecord = await this.run(SELECT.one.from('MissingScopeItems').where({ autoId }));

            if (!existingRecord) {
                req.error(404, `Record with autoId ${autoId} not found`);
                return;
            }

            // Update only provided fields, retain existing values for fields not provided
            const updatedData = {
                brandGuardianStatus: brandGuardianStatus !== undefined ? brandGuardianStatus : existingRecord.brandGuardianStatus,
                globalServicesStatus: globalServicesStatus !== undefined ? globalServicesStatus : existingRecord.globalServicesStatus
            };

            // Perform the update with merged data
            return await this.run(
                UPDATE(MissingScopeItems)
                    .set(updatedData)
                    .where({ autoId })
            );
        } catch (error) {
            req.error(500, `Error updating record: ${error.message}`);
        }
    });


    this.on('brandGuardianStatusUpdate', async (req) => {
        try {
            const { autoId, brandGuardianStatus } = req.data;
            
            // Initial log to track when the action starts
            console.log(`[INFO] brandGuardianStatus ACTION IS STARTED`);

            // Validate incoming data
        if (!autoId) {
            req.error(400, 'Missing autoId in the request payload.');
            console.log(`[WARN] Missing autoId in the request payload: ${autoId}`);
            return;
        }
    
            // Log the complete incoming request data
            console.log(`[INFO] brandGuardianStatus REQUESTED DATA:`, JSON.stringify(req.data));
    
            // Fetch the current record for the given `autoId`
            console.log(`[INFO] Fetching existing record for autoId: ${autoId}`);
            const existingRecord = await this.run(SELECT.one.from('MissingScopeItems').where({ autoId }));
    
            if (!existingRecord) {
                console.log(`[WARN] No record found for autoId: ${autoId}`);
                req.error(404, `Record with autoId ${autoId} not found`);
                return;
            }
    
            // Log the existing record details before the update
            console.log(`[INFO] Existing Record:`, JSON.stringify(existingRecord));
    
            // Update only provided fields, retain existing values for fields not provided
            const updatedData = {
                brandGuardianStatus: brandGuardianStatus !== undefined ? brandGuardianStatus : existingRecord.brandGuardianStatus,
            };
    
            // Log the updated data that will be used for the update
            console.log(`[INFO] Data to be updated:`, JSON.stringify(updatedData));
    
            // Perform the update with merged data
            const updateResult = await this.run(
                UPDATE(MissingScopeItems)
                    .set(updatedData)
                    .where({ autoId })
            );
    
            // Log the result of the update operation
            console.log(`[INFO] Update result:`, JSON.stringify(updateResult));
    
            return ['200'];
        } catch (error) {
            console.error(`[ERROR] Error updating record: ${error.message}`, error);
            req.error(500, `Error updating record: ${error.message}`);
        }
    });
    
    this.on('globalServicesStatusUpdate', async (req) => {
        try {
            const { autoId, globalServicesStatus } = req.data;

            // Fetch the current record for the given `autoId`
            const existingRecord = await this.run(SELECT.one.from('MissingScopeItems').where({ autoId }));

            if (!existingRecord) {
                req.error(404, `Record with autoId ${autoId} not found`);
                return;
            }

            // Update only provided fields, retain existing values for fields not provided
            const updatedData = {
                globalServicesStatus: globalServicesStatus !== undefined ? globalServicesStatus : existingRecord.globalServicesStatus
            };

            // Perform the update with merged data
             await this.run(
                UPDATE(MissingScopeItems)
                    .set(updatedData)
                    .where({ autoId })

                   
            );
            return ['200'];
        } catch (error) {
            req.error(500, `Error updating record: ${error.message}`);
        }
    });





    this.on('DELETE', 'MissingScopeItems', async (req) => {
        try {
            const { autoId } = req.data;
            return await this.run(DELETE.from(MissingScopeItems).where({ autoId }));
        } catch (error) {
            req.error(500, `Error deleting MissingScopeItems: ${error.message}`);
        }
    });



});