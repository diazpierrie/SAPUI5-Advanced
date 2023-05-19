sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.model.Filter} Filter
   * @param {typeof sap.ui.model.FilterOperator} FilterOperator
   */
  function (Controller, Filter, FilterOperator) {
    "use strict";

    function onInit() {
      var oView = this.getView();
      var i18nBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      var oJsonModelEmployees = new sap.ui.model.json.JSONModel();
      // @ts-ignore
      oJsonModelEmployees.loadData(
        "./localService/mockdata/Employees.json",
        false
      );
      oView.setModel(oJsonModelEmployees, "employees");

      var oJsonModelCountries = new sap.ui.model.json.JSONModel();
      // @ts-ignore
      oJsonModelCountries.loadData(
        "./localService/mockdata/Countries.json",
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

    function showOrders(oEvent) {
      var ordersTable = this.getView().byId("ordersTable");
      ordersTable.destroyItems();

      var itemPressed = oEvent.getSource();
      var oContext = itemPressed.getBindingContext("employees");

      var objectContext = oContext.getObject();
      var orders = objectContext.Orders;

      var ordersItems = [];

      for (var i in orders) {
        ordersItems.push(
          new sap.m.ColumnListItem({
            cells: [
              new sap.m.Label({ text: orders[i].OrderID }),
              new sap.m.Label({ text: orders[i].Freight }),
              new sap.m.Label({ text: orders[i].ShipAddress }),
            ],
          })
        );
      }

      var newTable = new sap.m.Table({
        width: "auto",
        columns: [
          new sap.m.Column({
            header: new sap.m.Label({ text: "{i18n>orderID}" }),
          }),
          new sap.m.Column({
            header: new sap.m.Label({ text: "{i18n>freight}" }),
          }),
          new sap.m.Column({
            header: new sap.m.Label({ text: "{i18n>shipAddress}" }),
          }),
        ],
        items: ordersItems,
      }).addStyleClass("sapUiSmallMargin");
      
      ordersTable.addItem(newTable);    
      
      var newTableJSON = new sap.m.Table();
      newTableJSON.setWidth("auto");
      newTableJSON.addStyleClass("sapUiSmallMargin");

      var columnOrderID = new sap.m.Column();
      var labelOrderID = new sap.m.Label();
      labelOrderID.bindProperty("text", "i18n>orderID");
      columnOrderID.setHeader(labelOrderID);
      newTableJSON.addColumn(columnOrderID);

      var columnFreight = new sap.m.Column();
      var labelFreight = new sap.m.Label();
      labelFreight.bindProperty("text", "i18n>freight");
      columnFreight.setHeader(labelFreight);
      newTableJSON.addColumn(columnFreight);

      var columnShipAddress = new sap.m.Column();
      var labelShipAddress = new sap.m.Label();
      labelShipAddress.bindProperty("text", "i18n>shipAddress");
      columnShipAddress.setHeader(labelShipAddress);
      newTableJSON.addColumn(columnShipAddress);

      var columnListItem = new sap.m.ColumnListItem();

      var cellOrderID = new sap.m.Label();
      cellOrderID.bindProperty("text", "employees>OrderID");
      columnListItem.addCell(cellOrderID);

      var cellFreight = new sap.m.Label();
      cellFreight.bindProperty("text", "employees>Freight");
      columnListItem.addCell(cellFreight);

      var cellShipAddress = new sap.m.Label();
      cellShipAddress.bindProperty("text", "employees>ShipAddress");
      columnListItem.addCell(cellShipAddress);

      var oBindingInfo = {
        model: "employees",
        path: "Orders",
        template: columnListItem
      }

      newTableJSON.bindAggregation("items", oBindingInfo)
      newTableJSON.bindElement("employees>" + oContext.getPath());

      ordersTable.addItem(newTableJSON);
    }

    var Main = Controller.extend(
      "logaligroup.employees.controller.MainView",
      {}
    );

    (Main.prototype.onInit = function () {}),
      (Main.prototype.onValidate = function () {
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

    Main.prototype.onInit = onInit;
    Main.prototype.onFilter = onFilter;
    Main.prototype.onFilterClear = onFilterClear;
    Main.prototype.showPostalCode = showPostalCode;
    Main.prototype.onShowCity = onShowCity;
    Main.prototype.onHideCity = onHideCity;
    Main.prototype.showOrders = showOrders;
    return Main;
  }
);
