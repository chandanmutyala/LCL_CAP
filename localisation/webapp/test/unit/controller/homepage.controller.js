/*global QUnit*/

sap.ui.define([
	"localisation/controller/homepage.controller"
], function (Controller) {
	"use strict";

	QUnit.module("homepage Controller");

	QUnit.test("I should test the homepage controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
