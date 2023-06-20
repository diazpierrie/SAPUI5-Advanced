sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "logaligroup/employees/model/formatter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.Fragment} Fragment

   */
  function (Controller, Fragment, formatter) {
    function onInit() {
      this._bus = sap.ui.getCore().getEventBus();
    }

    async function onCreateIncidence(oEvent) {
      var tableIncidence = this.getView().byId("tableIncidence");
      var fragName = "logaligroup.employees.fragment.NewIncidence";
      var oView = this.getView();

      await this.loadFragment({
        name: fragName
      }).then((oFrag) => {
        var inModel = oView.getModel("incidenceModel");
        var oData = inModel.getData();
        var index = oData.length;
        oData.push({ index: index + 1, date: undefined });
        inModel.refresh();
        oFrag.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(oFrag);
      });
    }

    function onDeleteIncidence(oEvent) {

      var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
      this._bus.publish("incidence", "onDeleteIncidence", {
        IncidenceId: contextObj.IncidenceId,
        SapId : contextObj.SapId,
        EmployeeId : contextObj.EmployeeId
      });
    }

    function onSaveIncidence(oEvent) {
      var incidence = oEvent.getSource().getParent().getParent();
      var incidenceRow = incidence.getBindingContext("incidenceModel");
      this._bus.publish("incidence", "onSaveIncidence", {
        incidenceRow: incidenceRow.sPath.replace("/", ""),
      });
    }

    function updateIncidenceCreationDate(oEvent) {
      var context = oEvent.getSource().getBindingContext("incidenceModel");
      var contextObj = context.getObject();
      contextObj.CreationDateX = true;
    }

    function updateIncidenceReason(oEvent) {
      var context = oEvent.getSource().getBindingContext("incidenceModel");
      var contextObj = context.getObject();
      contextObj.ReasonX = true;
    }

    function updateIncidenceType(oEvent) {
      var context = oEvent.getSource().getBindingContext("incidenceModel");
      var contextObj = context.getObject();
      contextObj.TypeX = true;
    }

    var EmployeeDetails = Controller.extend(
      "logaligroup.employees.controller.EmployeeDetails",
      {}
    );

    EmployeeDetails.prototype.onInit = function () {};
    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
    EmployeeDetails.prototype.updateIncidenceCreationDate =
      updateIncidenceCreationDate;
    EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
    EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;

    return EmployeeDetails;
  }
);
