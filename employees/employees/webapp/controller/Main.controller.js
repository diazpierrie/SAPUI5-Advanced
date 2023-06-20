sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "logaligroup/employees/model/formatter",
    "sap/ui/core/IconPool",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.Fragment} Fragment
   * @param {typeof sap.ui.core.IconPool} IconPool
   *
   */
  function (Controller, Fragment, formatter, IconPool) {
    "use strict";

    function onBeforeRendering() {
      this._detailEmployeeView = this.getView().byId("detailEmployeeView");
    }

    function onInit() {
      var oView = this.getView();
      var i18nBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      // var oJsonModelEmployees = new sap.ui.model.json.JSONModel();
      // oJsonModelEmployees.loadData(
      //   "./localService/mockdata/Employees.json",
      //   // @ts-ignore
      //   false
      // );
      // oView.setModel(oJsonModelEmployees, "jsonEmployees");

      var oJsonModelCountries = new sap.ui.model.json.JSONModel();
      oJsonModelCountries.loadData(
        "./localService/mockdata/Countries.json",
        // @ts-ignore
        false
      );
      oView.setModel(oJsonModelCountries, "countries");

      var oJsonModelLayout = new sap.ui.model.json.JSONModel();
      oJsonModelLayout.loadData(
        "./localService/mockdata/Layout.json",
        // @ts-ignore
        false
      );
      oView.setModel(oJsonModelLayout, "layout");

      var oJsonModelConfig = new sap.ui.model.json.JSONModel({
        visibleID: true,
        visibleName: true,
        visibleCountry: true,
        visibleCity: true,
        visibleBtnShowCity: false,
        visibleBtnHideCity: true,
      });
      oView.setModel(oJsonModelConfig, "config");

      this._bus = sap.ui.getCore().getEventBus();

      this._bus.subscribe(
        "flexible",
        "showEmployee",
        this.showEmployeeDetails,
        this
      );
      this._bus.subscribe(
        "incidence",
        "onSaveIncidence",
        this.onSaveODataIncidence,
        this
      );
      this._bus.subscribe(
        "incidence",
        "onDeleteIncidence",
        function (channelId, eventId, data) {

          var i18nBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

          this.getView()
            .getModel("incidenceModel")
            .remove(
              "/IncidentsSet(IncidenceId='" +
              data.IncidenceId +
                "',SapId='" +
                data.SapId +
                "',EmployeeId='" +
                data.EmployeeId +
                "')",
              {
                success: function () {
                  this.onReadODataIncidence.bind(this)(data.EmployeeId);
                  sap.m.MessageToast.show(i18nBundle.getText("odataDeleteOK"));
                }.bind(this),
                error: function (e) {
                  sap.m.MessageToast.show(i18nBundle.getText("odataDeleteKO"));
                }.bind(this),
              }
            );
        },
        this
      );
    }

    function showEmployeeDetails(category, nameEvent, path) {
      var detailView = this.getView().byId("detailEmployeeView");
      detailView.bindElement("odataNorthwind>" + path);
      this.getView()
        .getModel("layout")
        .setProperty("/ActiveKey", "TwoColumnsMidExpanded");

      var incidenceModel = new sap.ui.model.json.JSONModel([]);
      detailView.setModel(incidenceModel, "incidenceModel");
      detailView.byId("tableIncidence").removeAllContent();

      this.onReadODataIncidence(
        this._detailEmployeeView.getBindingContext("odataNorthwind").getObject()
          .EmployeeID
      );
    }

    function onSaveODataIncidence(channelId, eventId, data) {
      var i18nBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      var employeeId = this._detailEmployeeView
        .getBindingContext("odataNorthwind")
        .getObject().EmployeeID;
      var incidenceModel = this._detailEmployeeView
        .getModel("incidenceModel")
        .getData();

      if (!incidenceModel[data.incidenceRow].IncidenceId) {
        var body = {
          SapId: this.getOwnerComponent().SapId,
          EmployeeId: employeeId.toString(),
          CreationDate: incidenceModel[data.incidenceRow].CreationDate,
          Type: incidenceModel[data.incidenceRow].Type,
          Reason: incidenceModel[data.incidenceRow].Reason,
        };

        this.getView()
          .getModel("incidenceModel")
          .create("/IncidentsSet", body, {
            success: function () {
              this.onReadODataIncidence.bind(this)(employeeId);
              sap.m.MessageToast.show(i18nBundle.getText("odataSaveOK"));
            }.bind(this),
            error: function (e) {
              sap.m.MessageToast.show(i18nBundle.getText("odataSaveKO"));
            }.bind(this),
          });
      } else if (
        incidenceModel[data.incidenceRow].CreationDateX ||
        incidenceModel[data.incidenceRow].ReasonX ||
        incidenceModel[data.incidenceRow].TypeX
      ) {
        var bodyUpdate = {
          CreationDate: incidenceModel[data.incidenceRow].CreationDate,
          CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
          Reason: incidenceModel[data.incidenceRow].Reason,
          ReasonX: incidenceModel[data.incidenceRow].ReasonX,
          Type: incidenceModel[data.incidenceRow].Type,
          TypeX: incidenceModel[data.incidenceRow].TypeX,
        };

        this.getView()
          .getModel("incidenceModel")
          .update(
            "/IncidentsSet(IncidenceId='" +
              incidenceModel[data.incidenceRow].IncidenceId +
              "',SapId='" +
              incidenceModel[data.incidenceRow].SapId +
              "',EmployeeId='" +
              incidenceModel[data.incidenceRow].EmployeeId +
              "')",
            bodyUpdate,
            {
              success: function () {
                this.onReadODataIncidence.bind(this)(employeeId);
                sap.m.MessageToast.show(i18nBundle.getText("odataUpdateOK"));
              }.bind(this),
              error: function (e) {
                sap.m.MessageToast.show(i18nBundle.getText("odataUpdateKO"));
              }.bind(this),
            }
          );
      } else {
        sap.m.MessageToast.show(i18nBundle.getText("odataNoChanges"));
      }
    }

    async function onReadODataIncidence(employeeId) {
      this._detailEmployeeView.setBusyIndicatorDelay(0);
      this._detailEmployeeView.setBusy(true);

      this.getView()
        .getModel("incidenceModel")
        .read("/IncidentsSet", {
          filters: [
            new sap.ui.model.Filter(
              "SapId",
              "EQ",
              this.getOwnerComponent().SapId
            ),
            new sap.ui.model.Filter("EmployeeId", "EQ", employeeId.toString()),
          ],
          success: async function (data) {
            var incidenceModel =
              this._detailEmployeeView.getModel("incidenceModel");
            incidenceModel.setData(data.results);
            var fragName = "logaligroup.employees.fragment.NewIncidence";

            var tableIncidence =
              this._detailEmployeeView.byId("tableIncidence");
            tableIncidence.removeAllContent();

            var fragment = await Fragment.load({
              name: fragName,
              controller: this._detailEmployeeView.getController(),
            }).catch((e) => console.log(e));

            for (var incidence in data.results) {
              var frag = fragment.clone();
              this._detailEmployeeView.addDependent(frag);
              frag.bindElement("incidenceModel>/" + incidence);
              tableIncidence.addContent(frag);
            }
          }.bind(this),
          error: function (e) {
            console.log(e);
          }.bind(this),
        });
      this._detailEmployeeView.setBusy(false);
    }

    var Main = Controller.extend("logaligroup.employees.controller.Main", {});

    Main.prototype.onInit = function () {};
    Main.prototype.onInit = onInit;
    Main.prototype.onBeforeRendering = onBeforeRendering;
    Main.prototype.showEmployeeDetails = showEmployeeDetails;
    Main.prototype.onSaveODataIncidence = onSaveODataIncidence;
    Main.prototype.onReadODataIncidence = onReadODataIncidence;
    Main.prototype.Formatter = formatter;

    return Main;
  }
);
