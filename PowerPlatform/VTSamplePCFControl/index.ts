import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class VTSamplePCFControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Empty constructor.
     */
    constructor()
    {

    }
    
    private txtName : HTMLInputElement;
    private txtDesc : HTMLInputElement;
    private btnSubmit : HTMLButtonElement;
    private btnOpenUrl : HTMLButtonElement;
    private btnCreateItem : HTMLButtonElement;
    private btnShowAccounts : HTMLButtonElement;
    private btnDeleteItem : HTMLButtonElement;
    private divAccounts : HTMLDivElement;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        // Add control initialization code
        //Day - 1
        //container.appendChild(document.createTextNode("Welcome to PCF Training"));

        //Day-2
        // var txtPCFInputControl = document.createElement("INPUT");
        // txtPCFInputControl.setAttribute("type", "text");
        // txtPCFInputControl.setAttribute("value", "Welcome to Hexa - VT");
        // container.appendChild(txtPCFInputControl);

        this.txtName = document.createElement("input");
        this.txtName.setAttribute("type", "text");
        this.txtName.setAttribute("value", context.parameters.nameProperty.raw || "");
        container.appendChild(this.txtName);

        this.txtDesc = document.createElement("input");
        this.txtDesc.setAttribute("type", "text");
        this.txtDesc.setAttribute("value", context.parameters.descProperty.raw || "");
        container.appendChild(this.txtDesc);

        this.txtName.addEventListener("change", (e) => {notifyOutputChanged();});
        this.txtDesc.addEventListener("change", (e) => {notifyOutputChanged();});

        //Alert Btn
        this.btnSubmit = document.createElement("button");
        this.btnSubmit.innerHTML = "Sample Button";
        const alertMsg = `Hello ${context.userSettings.userName}! You created alert message.`;
        this.btnSubmit.onclick = () => {
            const alertSettings = {confirmButtonLabel : "Yes", text:alertMsg, title:"Sample Alert"};
            const alertOptions = {height:300, width:300};
            context.navigation.openAlertDialog(alertSettings, alertOptions);
        };
        container.appendChild(this.btnSubmit);

        //URL Btn
        this.btnOpenUrl = document.createElement("button");
        this.btnOpenUrl.innerHTML = "Open Hxw";
        this.btnOpenUrl.onclick = () => {            
            const dialogOptions = {height:500, width:500};
            context.navigation.openUrl("https://hexaware.com", dialogOptions);
        };
        container.appendChild(this.btnOpenUrl);

        //Display Accounts
        let outputData = "";
        this.btnShowAccounts = document.createElement("button");
        this.btnShowAccounts.innerHTML = "List Accounts";
        this.btnShowAccounts.onclick = () => {            
            context.webAPI.retrieveMultipleRecords("account", "?$select=name,accountid").then(
                (results) =>{
                    outputData = "";
                    for(let i=0;i<results.entities.length;i++){
                        outputData = (outputData == "") ? results.entities[i].name : outputData + "," + results.entities[i].name;
                        console.log("Account ID: " + results.entities[i].accountid +", Account Name: " + results.entities[i].name);
                    }
                    this.divAccounts.innerHTML = outputData;
                },
                (error) => {
                    console.log(error.message);
                }
            );
        };
        container.appendChild(this.btnShowAccounts);

        //Create Btn
        let lastCreatedAccId = "";
        this.btnCreateItem = document.createElement("button");
        this.btnCreateItem.innerHTML = "Create New Account";
        this.btnCreateItem.onclick = () => { 
            const randomNum = (Math.floor(Math.random() * 1000) + 1).toString();            
            context.webAPI.createRecord("account", {
                name : "Sample Account - " + randomNum,
                accountnumber : randomNum
            }).then(
                function(acc){//success function
                    console.log("Account Sample Account - " + randomNum + " is created with ID: " + acc.id);
                    lastCreatedAccId = acc.id;
                },
                function(error){
                    console.log(error.message);
                }
            );      
        };
        container.appendChild(this.btnCreateItem);

        //Delete Btn
        this.btnDeleteItem = document.createElement("button");
        this.btnDeleteItem.innerHTML = "Delete Account";
        this.btnDeleteItem.onclick = () => {            
            context.webAPI.deleteRecord("account",lastCreatedAccId).then(
                function(acc){//success function
                    console.log("Account with ID: " + acc.id + " is deleted.");
                },
                function(error){
                    console.log(error.message);
                }
            );      
        };
        container.appendChild(this.btnDeleteItem);

        this.divAccounts = document.createElement("div");
        this.divAccounts.innerHTML = outputData;
        container.appendChild(this.divAccounts);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs
    {
        return {
            nameProperty : this.txtName.value,
            descProperty : this.txtDesc.value
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
