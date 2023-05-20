sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "logaligroup/employees/model/formatter"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.Fragment} Fragment

   */
  function (Controller, Fragment, formatter) {

    function onInit() {
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
    }

    async function onCreateIncidence(oEvent) {

      var tableIncidence = this.getView().byId("tableIncidence"); 
      var fragName = "logaligroup.employees.fragment.NewIncidence"; 
      var oView = this.getView();

      await Fragment.load({
        name: fragName,
        controller: this,
      }).then((oFrag) => {
        var inModel = oView.getModel("incidenceModel");
        var oData = inModel.getData();
        var index = oData.length;
        oData.push({ index : index + 1, date : undefined});
        inModel.refresh();
        oFrag.bindElement("incidenceModel>/" + index);
        console.log(inModel);
        tableIncidence.addContent(oFrag);
      })  
      
    }



    function onDeleteIncidence(oEvent) {
        var tableIncidence = this.getView().byId("tableIncidence");
        var rowIncident = oEvent.getSource().getParent().getParent();
        var incidenceModel = this.getView().getModel("incidenceModel");
        var oData = incidenceModel.getData();
        var contextObj = rowIncident.getBindingContext("incidenceModel")

        oData.splice(contextObj.index - 1, 1);

        for (var i in oData) {
          oData[i].index = parseInt(i) + 1;          
        }

        incidenceModel.refresh();
        tableIncidence.removeContent(rowIncident);

        for (var j in tableIncidence.getContent()) {
          tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
        }
    }
    

    var EmployeeDetails = Controller.extend(
      "logaligroup.employees.controller.EmployeeDetails",
      {}
    );

    (EmployeeDetails.prototype.onInit = function () {});
    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.Formatter = formatter;

    return EmployeeDetails;
  }
);
