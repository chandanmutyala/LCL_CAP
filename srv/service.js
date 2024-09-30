const cds = require('@sap/cds');
module.exports = cds.service.impl(async function () {
    const { MissingScopeItems } = cds.entities;
    // this.on('CREATE', 'MissingScopeItems', async (req) => {
    //     try {
    //       // Extract the data sent in the request
    //       const {
    //         customerOrProspect,
    //         customerName,
    //         oppurtunityNumber,
    //         priority,
    //         goLiveDate,
    //         revenue,
    //         country,
    //         industry,
    //         ScopeItemID,
    //         Description,
    //         LOB,
    //         BusinessArea,
    //       } = req.data;
      
    //       // Fetch the max autoId to increment for the new entry
    //       const autoIdResult = await this.run(SELECT.one.from(MissingScopeItems).columns('max(autoId) as maxID'));
      
    //       // Starting point for the autoId (adjust the value as per your need)
    //       const startingID = 100;
      
    //       // Set the new autoId based on the highest existing one or the starting ID
    //       const newID = (autoIdResult.maxID >= startingID ? autoIdResult.maxID : startingID - 1) + 1;
      
    //       // Create the new entry with all required fields
    //       const newScopeItem = {
    //         autoId: newID,
    //         customerOrProspect,
    //         customerName,
    //         brandGuardianStatus:'In Progress',
    //         globalServicesStatus: 'In Evaluation',
    //         oppurtunityNumber,
    //         priority,
    //         goLiveDate,
    //         revenue,
    //         country,
    //         industry,
    //         ScopeItemID,
    //         Description,
    //         LOB,
    //         BusinessArea,
    //         createdBy: 'Nywald', // Default value
    //         createdOn: new Date(), // Set to current date and time
    //       };
      
    //       // Insert the new entry into the MissingScopeItems table
    //       return await this.run(INSERT.into(MissingScopeItems).entries(newScopeItem));
    //     } catch (error) {
    //       // Handle any errors during the insert operation
    //       req.error(500, `Error creating MissingScopeItem: ${error.message}`);
    //     }
    //   });
//     this.on('CREATE', 'MissingScopeItems', async (req) => {

//       try {
  
//           const items = req.data.items; // Receive an array of items from the payload
   
//           // Fetch the max autoId to increment for the new entry
  
//           const autoIdResult = await this.run(SELECT.one.from(MissingScopeItems).columns('max(autoId) as maxID'));
   
//           // Starting point for the autoId (adjust the value as per your need)
  
//           const startingID = 100;
  
//           let currentMaxID = autoIdResult.maxID >= startingID ? autoIdResult.maxID : startingID - 1;
   
//           // Loop through all the items sent in the payload and insert them one by one
  
//           const insertPromises = items.map(async (item) => {
  
//               const newID = ++currentMaxID; // Increment the ID for each new record
   
//               const newScopeItem = {
  
//                   autoId: newID,
  
//                   customerOrProspect: item.customerOrProspect,
  
//                   customerName: item.customerName,
  
//                   brandGuardianStatus: 'In Progress',
  
//                   globalServicesStatus: 'In Evaluation',
  
//                   oppurtunityNumber: item.oppurtunityNumber,
  
//                   priority: item.priority,
  
//                   goLiveDate: item.goLiveDate,
  
//                   revenue: item.revenue,
  
//                   country: item.country,
  
//                   industry: item.industry,
  
//                   ScopeItemID: item.ScopeItemID,
  
//                   Description: item.Description,
  
//                   LOB: item.LOB,
  
//                   BusinessArea: item.BusinessArea,
  
//                   createdBy: 'Nywald',
  
//                   createdOn: new Date(),
  
//               };
   
//               // Insert the new entry into the MissingScopeItems table
  
//               return this.run(INSERT.into(MissingScopeItems).entries(newScopeItem));
  
//           });
   
//           // Wait for all insert operations to complete
  
//           await Promise.all(insertPromises);
   
//           return 'Records created successfully';
  
//       } catch (error) {
  
//           // Handle any errors during the insert operation
  
//           req.error(500, `Error creating MissingScopeItems: ${error.message}`);
  
//       }
  
//   });
  

// this.on('CREATE', 'MissingScopeItems', async (req) => {
//     try {
//         const items = req.data; // Directly receive the payload
        
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
//             return this.run(INSERT.into(MissingScopeItems).entries(newScopeItem));
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