const cds = require('@sap/cds');
module.exports = cds.service.impl(async function () {
    const {ScopeItems, MissingScopeItems } = cds.entities;

    
    this.on('resetAndInsertScopeItems', async (req) => {

        const newItems = req.data.items; // Get the array of items from the request

        try {
            // Log the data being inserted
            console.log("Inserting new data: ", newItems);

            // First, delete all existing records in ScopeItems
            console.log("Deleting old records from ScopeItems table...");
            await DELETE.from(ScopeItems);

            // Log success message after delete
            console.log("Old records deleted successfully!");

            // Then insert the new data
            console.log("Inserting new records into ScopeItems table...");
            await INSERT.into(ScopeItems).entries(newItems);

            console.log("New records inserted successfully!");
            return { message: "Old records deleted and new data inserted successfully!" };

        } catch (error) {
            // Log the error in BTP logs for troubleshooting
            console.error("Error during delete/insert operation:", error);

            // Send the error back in the response
            req.error(500, "An error occurred while deleting old records or inserting new data.");
        }
    });

    // this.on('getUniqueScopeItems', async (req) => {
    //     try {
    //         // Fetch unique scope items from the database
    //         const uniqueItems = await SELECT.from(ScopeItems)
    //         .columns(['ScopeItemID', 'Description', 'LOB', 'BusinessArea', 'Status'])
    //         .groupBy(['ScopeItemID', 'Description', 'LOB', 'BusinessArea', 'Status']);
    //         return uniqueItems;
    //     } catch (error) {
    //         // Handle errors appropriately
    //         console.error('Error fetching unique scope items:', error);
    //         // Optionally, you can throw an error to return to the client
    //         req.error(500, 'Error fetching unique scope items');
    //     }
    // });
    
    // this.on('getUniqueValues', async (req) => {
    //     const { column } = req.data;
        
    //     if (!['ScopeItemID', 'Description', 'LOB', 'BusinessArea', 'Status'].includes(column)) {
    //         return req.error(400, `Invalid column name: ${column}`);
    //     }

    //     const query = SELECT.distinct.from(ScopeItems).columns(column);
    //     const result = await cds.run(query);
        
    //     return result.map(item => item[column]);
    // });
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
  

this.on('CREATE', 'MissingScopeItems', async (req) => {
    try {
        let items = req.data;

        // Ensure items is an array, even if a single record is sent
        if (!Array.isArray(items)) {
            items = [items]; // Convert single object to an array with one element
        }

        // Fetch the max autoId to increment for the new entry
        const autoIdResult = await this.run(SELECT.one.from(MissingScopeItems).columns('max(autoId) as maxID'));
        
        // Starting point for the autoId (adjust the value as per your need)
        const startingID = 100;
        let currentMaxID = autoIdResult.maxID >= startingID ? autoIdResult.maxID : startingID - 1;
        
        // Loop through all the items sent in the payload and insert them one by one
        const insertPromises = items.map(async (item) => {
            const newID = ++currentMaxID; // Increment the ID for each new record

            const newScopeItem = {
                autoId: newID,
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
            return this.run(INSERT.into(MissingScopeItems).entries(newScopeItem));
        });

        // Wait for all insert operations to complete
        await Promise.all(insertPromises);

        // Return a proper response (you could return created entities or simply null)
        return null; // Indicating successful creation without returning a message string
    } catch (error) {
        // Handle any errors during the insert operation
        req.error(500, `Error creating MissingScopeItems: ${error.message}`);
    }
});


   

    // this working if we are passing 2 columns
    //   this.on('UPDATE', 'MissingScopeItems', async (req) => {
    //     try {
    //         const { autoId,brandGuardianStatus ,globalServicesStatus  } = req.data;
    //         return await this.run(UPDATE(MissingScopeItems).set({  brandGuardianStatus ,globalServicesStatus  }).where({ autoId }));
    //     } catch (error) {
    //         req.error(500, `Error updating customer: ${error.message}`);
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

  this.on('DELETE', 'MissingScopeItems', async (req) => {
    try {
        const { autoId } = req.data;
        return await this.run(DELETE.from(MissingScopeItems).where({ autoId }));
    } catch (error) {
        req.error(500, `Error deleting MissingScopeItems: ${error.message}`);
    }
});
  
  
      
});