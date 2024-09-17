sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("localisation.controller.homepage", {
        onInit: function () {

        },

        pressSA :function(){
        var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteSA");
        },
        
        pressRMS :function(){
            var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteRMS");
            }
    });
});