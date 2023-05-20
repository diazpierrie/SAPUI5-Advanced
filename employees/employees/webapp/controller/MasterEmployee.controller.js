sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.model.Filter} Filter
   * @param {typeof sap.ui.model.FilterOperator} FilterOperator
   * @param {typeof sap.ui.core.Fragment} Fragment
   */
  function (Controller, Filter, FilterOperator, Fragment) {
    "use strict";

    function onInit() {
      this._bus = sap.ui.getCore().getEventBus();
      
      var oView = this.getView();
      var i18nBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      var oJsonModelEmployees = new sap.ui.model.json.JSONModel();
      oJsonModelEmployees.loadData(
        "./localService/mockdata/Employees.json",
        // @ts-ignore
        false
      );
      oView.setModel(oJsonModelEmployees, "employees");

      var oJsonModelCountries = new sap.ui.model.json.JSONModel();
      oJsonModelCountries.loadData(
        "./localService/mockdata/Countries.json",
        // @ts-ignore
        false
      );
      oView.setModel(oJsonModelCountries, "countries");

      var oJsonModelConfig = new sap.ui.model.json.JSONModel({
        visibleID: true,
        visibleName: true,
        visibleCountry: true,
        visibleCity: true,
        visibleBtnShowCity: false,
        visibleBtnHideCity: true,
      });
      oView.setModel(oJsonModelConfig, "config");
    }

    function onFilter() {
      var oJSON = this.getView().getModel("countries").getData();

      var filters = [];

      if (oJSON.EmployeeId !== "") {
        filters.push(
          new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId)
        );
      }

      if (oJSON.CountryKey !== "") {
        filters.push(
          new Filter("Country", FilterOperator.EQ, oJSON.CountryKey)
        );
      }

      var oList = this.getView().byId("tableEmployee");
      var oBinding = oList.getBinding("items");
      oBinding.filter(filters);
    }

    function onFilterClear() {
      var oModel = this.getView().getModel("countries");
      oModel.setProperty("/EmployeeId", "");
      oModel.setProperty("/CountryKey", "");

      var filters = [];
      var oList = this.getView().byId("tableEmployee");
      var oBinding = oList.getBinding("items");
      oBinding.filter(filters);
    }

    function showPostalCode(oEvent) {
      var itemPressed = oEvent.getSource();
      var oContext = itemPressed.getBindingContext("employees");
      var objectContext = oContext.getObject();

      sap.m.MessageToast.show(objectContext.PostalCode);
    }

    function onShowCity(oEvent) {
      var model = this.getView().getModel("config");
      model.setProperty("/visibleCity", true);
      model.setProperty("/visibleBtnShowCity", false);
      model.setProperty("/visibleBtnHideCity", true);
    }

    function onHideCity(oEvent) {
      var model = this.getView().getModel("config");
      model.setProperty("/visibleCity", false);
      model.setProperty("/visibleBtnShowCity", true);
      model.setProperty("/visibleBtnHideCity", false);
    }

    async function showOrders(oEvent) {
      var iconPressed = oEvent.getSource();
      var oContext = iconPressed.getBindingContext("employees");
      // @ts-ignore
      var oView = this.getView();
      var fragName = "logaligroup.employees.fragment.DialogOrders";

      if (!this._oDialogOrders) {
        await Fragment.load({
          id: oView.getId(),
          name: fragName,
          controller: this,
        }).then((oDialog) => {
          this._oDialogOrders = oDialog;
          oView.addDependent(oDialog);
        })
      } 

      // @ts-ignore
      this._oDialogOrders.bindElement("employees>" + oContext.getPath());
      // @ts-ignore
      this._oDialogOrders.open();        
    }

    function onCloseOrders() {
      this._oDialogOrders.close();
    }

    function showEmployee(oEvent) {
      var path = oEvent.getSource().getBindingContext("employees").getPath();
      this._bus.publish("flexible", "showEmployee", path);
    }

    var MasterEmployee = Controller.extend(
      "logaligroup.employees.controller.MasterEmployee",
      {}
    );

    (MasterEmployee.prototype.onInit = function () {}),
      (MasterEmployee.prototype.onValidate = function () {
        var inputEmployee = this.getView().byId("inputEmployee");
        var valueEmployee = inputEmployee.getValue();

        if (valueEmployee.length === 6) {
          inputEmployee.setDescription("OK");

          this.getView().byId("labelCountry").setVisible(true);
          this.getView().byId("slCountry").setVisible(true);
        } else {
          inputEmployee.setDescription("Not OK");

          this.getView().byId("labelCountry").setVisible(false);
          this.getView().byId("slCountry").setVisible(false);
        }
      });

    MasterEmployee.prototype.onInit = onInit;
    MasterEmployee.prototype.onFilter = onFilter;
    MasterEmployee.prototype.onFilterClear = onFilterClear;
    MasterEmployee.prototype.showPostalCode = showPostalCode;
    MasterEmployee.prototype.onShowCity = onShowCity;
    MasterEmployee.prototype.onHideCity = onHideCity;
    MasterEmployee.prototype.showOrders = showOrders;
    MasterEmployee.prototype.onCloseOrders = onCloseOrders;
    MasterEmployee.prototype.showEmployee = showEmployee;
    return MasterEmployee;
  }
);
