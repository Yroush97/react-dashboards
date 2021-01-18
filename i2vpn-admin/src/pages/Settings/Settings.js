import React,{useState,useRef,useEffect} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from "../../axios";
import classNames from 'classnames';
import { Card } from "primereact/card";

const Settings = () => {

    //#region variables
        let emptySetting = {
            key: '',
            value: '',       
        };
        const [settings, setSettings] = useState([]);
        const [sett] = useState([]);
        const [settingsDialog, setSettingsDialog] = useState(false);
        const [deleteSettingsDialog, setDeleteSettingsDialog] = useState(false);
        const [setting, setSetting] = useState(emptySetting);
        const [submitted, setSubmitted] = useState(false);
        const [newSetting, setNewSetting] = useState(false);
        const toast = useRef(null);
        const dt = useRef(null);
        const token = localStorage.getItem('token');
    //#endregion

    //#region useEffect
        useEffect(() => {       
            axios
            .get("api/client/settings/all", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                Object.keys(response.data).map((key)=> {        
                    sett.push({
                        'key' : [key][0],
                        'value': response.data[key]
                    })               
                }); 
                setSettings(sett)              
            })
            .catch((error) => {
                console.log(error)
            });
        
        }, []);
    //#endregion

    //#region open dialog
        const openNew = () => {
            setSetting(emptySetting);
            setSubmitted(false);
            setSettingsDialog(true);
            setNewSetting(true);
        }
    //#endregion

    //#region hide dialogs
        const hideDialog = () => {
            setSubmitted(false);
            setSettingsDialog(false);
        }
        const hideDeleteSettingsDialog = () => {
            setDeleteSettingsDialog(false);
        }
    //#endregion
    
    //#region crud
        const saveSettings = () => {
        
            setSubmitted(true);

            if (setting.key.trim()) {
                // old settings
                let _settings = [...settings];
                // new setting
                let _setting = {...setting}; 
                // console.log(_setting)
                let filterSettings = settings.map((item) => {
                    return item.key == setting.key
                    ? { ...item, key: _setting.key, value: _setting.value }
                    : item;
                });

                let filterelement = settings.filter((i) => i.key == setting.key);
                //   console.log(filterelement)
                //   if(filterelement.length === 0)
                //   { console.log('js')
                //     setSettings([
                //     ...settings,
                //     _setting
                //     ]);
                //     settings.push({
                //         key: setting.key,
                //         value: setting.value,
                //     });
                //   }
                //   else{
                //       console.log('ds')
                //     setSettings(filterSettings);
                //   }
                axios
                .put("api/dashboard/settings", {
                    key: _setting.key,
                    value: _setting.value,               
                    }, {
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {  
                    if(filterelement.length === 0)
                    { 
                        setSettings([
                        ...settings,
                        _setting
                        ]);
                        // settings.push({
                        //     key: setting.key,
                        //     value: setting.value,
                        // });
                    }
                    else{
                        setSettings(filterSettings);
                    }
                   toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 3000 });            
                   if(setting.key !== "" && setting.value !== "")
                   {
                    setSettingsDialog(false);
                    setSetting(emptySetting);
                   }
                //    setSettings([
                //     ...settings,
                //     _setting
                //   ]);
                //   settings.push({
                //     key: setting.key,
                //     value: setting.value,
                //   });

                //setSettings(tempExpense);

            
                })
                .catch((error) => {
                    toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});

                });           
                
            }
        } 
        const editSettings = (setting) => {
            setSetting({...setting});
            setSettingsDialog(true);
            setNewSetting(false);
        }
        const confirmDeleteSettings = (setting) => {
            setSetting(setting);
            setDeleteSettingsDialog(true);
        }
        const deleteSettings = () => {  
            axios
                .delete(`api/dashboard/settings/remove/${setting.key}`, {
                    headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {  
                    let _settings = settings.filter(val => val.key !== setting.key);
                    setSettings(_settings)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 3000 });            
                    setDeleteSettingsDialog(false);
                    setSetting(emptySetting);                        
                })
                .catch((error) => {
                    toast.show({severity: 'error', summary: 'Error Message', detail: error.message});
                });
        }
    //#endregion
  
    //#region toolbar
        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew}  />
                </React.Fragment>
            )
        }
    //#endregion
  
    //#region change inputs
        const onInputChange = (e, name) => {   
            const val = e.target.value ;           
            let _setting = {...setting};
            _setting[`${name}`] = val; 
            setSetting(_setting);
        }
    //#endregion

    //#region operations
        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editSettings(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteSettings(rowData)} />
                </React.Fragment>
            );
        }
    //#endregion

    //#region dialog footer
        const SettingsDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveSettings} />
            </React.Fragment>
        );
        const deleteSettingsDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSettingsDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSettings} />
            </React.Fragment>
        );
    //#endregion

    //#region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Settings</h5>           
            </div>
        );
    //#endregion

    //#region datatable
        return (
            <div className="datatable-responsive-demo p-p-4 p-d-block p-mx-auto">
                
                {/* toast settings  */}
                <Toast ref={toast} />
                
                {/* dataTable & columns  */}
                <Card style={{padding:"1rem"}}>
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate} ></Toolbar>
                    <DataTable ref={dt} value={settings} className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm"
                        dataKey="id" paginator rows={50} rowsPerPageOptions={[50, 100, 500, 1000]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} settings"
                        emptyMessage="No settings found." header={header}>
                        <Column field="key" header="Key" sortable filter filterPlaceholder="Search by key" style={{ wordWrap: "break-word" }}></Column>
                        <Column field="value" header="Value" sortable filter filterPlaceholder="Search by value" style={{ wordWrap: "break-word" }}></Column>
                        <Column body={actionBodyTemplate} style={{textAlign:"center"}}></Column>
                    </DataTable>
                </Card>
                    
                {/* dialog for add settings  */}
                <Dialog visible={settingsDialog} style={{ width: '450px' }} header={newSetting === true ? "Add new setting" : "Update setting"} modal className="p-fluid" footer={SettingsDialogFooter} onHide={hideDialog}>
                
                    <div className="p-field">
                        <label htmlFor="key">Key</label>
                        <InputText id="key" name="key" value={setting.key} onChange={(e) => onInputChange(e, 'key')} required autoFocus className={classNames({ 'p-invalid': submitted && !setting.key })} />
                        {submitted && !setting.key && <small className="p-invalid">Key is required.</small>}
                    </div>
                
                    <div className="p-field">
                        <label htmlFor="value">Value</label>
                        <InputTextarea id="value" name="value" rows={20} cols={40} value={setting.value} onChange={(e) => onInputChange(e, 'value')} required autoFocus className={classNames({ 'p-invalid': submitted && !setting.value })} />
                        {submitted && !setting.value && <small className="p-invalid">Value is required.</small>}
                    </div>
                
                </Dialog>

                {/* dialog for delete settings  */}
                <Dialog visible={deleteSettingsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSettingsDialogFooter} onHide={hideDeleteSettingsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {Settings && <span>Are you sure you want to delete <b style={{color:"#D32F2F"}}>{setting.key}</b> ?</span>}
                    </div>
                </Dialog>

            </div>
        )
    //#endregion

}
export default Settings