sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("localisation.controller.createRms", {
        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("./model/data.json");
            this.getView().setModel(oModel, "countryModel");

            var oModelTable = this.getOwnerComponent().getModel("tableModel") || new JSONModel({
                ProductCollection: []
            });
            this.getOwnerComponent().setModel(oModelTable, "tableModel");
        },

        onSavePress: function () {
            // Get form data from the input fields
            var oView = this.getView();

            var sCustomer = oView.byId("customerId").getSelected() ? "Customer" : "";
var sProspect = oView.byId("prospectId").getSelected() ? "Prospect" : "";       
            var sCustomerName = oView.byId("customerName").getValue();
                    var sOpportunity = oView.byId("opportunityNumber").getValue();
                    var sPriority = oView.byId("priorityComboBox").getSelectedKey();

            
          
            var goLiveDate = oView.byId("goLiveDate").getValue(); // Assuming you add an ID for the go-live date input
            var revenue = oView.byId("revenue").getValue();

            // For MultiComboBox (Countries and Industries)
            var selectedCountries = oView.byId("countryBox").getSelectedKeys();
            var selectedIndustries = oView.byId("industrybox").getSelectedKeys();
            // Initialize the variable to store the non-empty value
var customerOrProspect = "";

// Assign the non-empty value to customerOrProspect
if (sCustomer) {
    customerOrProspect = sCustomer;
} else if (sProspect) {
    customerOrProspect = sProspect;
}
            var countriesString = selectedCountries.join(", ");
            var industriesString = selectedIndustries.join(", ");

          // Get the table and selected items
var oTable = oView.byId("idProductsTaable");
var selectedItems = oTable.getSelectedItems();

// Check if there is at least one selected item
if (selectedItems.length > 0) {
    var item = selectedItems[0];  // Get the first selected item
    var context = item.getBindingContext();

    // Assign values to variables
    var scopeItemID = context.getProperty("ScopeItemID");
    var description = context.getProperty("Description");
    var lob = context.getProperty("LOB");
    var businessArea = context.getProperty("BusinessArea");

} else {
    console.log("No items selected.");
}

            // Construct the payload
            var payload = {
                customerOrProspect: customerOrProspect,
                customerName: sCustomerName,
                oppurtunityNumber: sOpportunity,
                priority: sPriority,
                goLiveDate: goLiveDate,
                revenue: revenue,
                country:countriesString, // Assuming multiple countries can be selected
                industry: industriesString,
                ScopeItemID: scopeItemID,
                Description: description,
                LOB:lob,
                BusinessArea:businessArea          
            };

            // Now you can send this payload to your backend or process it further
            console.log(payload);

            let oModel = this.getView().getModel();
            let oBindList = oModel.bindList("/MissingScopeItems");
            oBindList.create(payload);

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteRMS",true);


        }
    });

})