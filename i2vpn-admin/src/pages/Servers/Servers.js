import React,{useState,useRef,useEffect} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from "primereact/card"; 
import classNames from 'classnames';
import IPut from 'iput';
import "./Servers.css";
import axios from "../../axios";

const Servers = () => {

    //#region variables
        let emptyServer = {
            id: null,
            name: '',
            country_id: null,       
            ip: '0.0.0.0',
            max_connections_count: 0.0,
            bandwidth: 0.0,        
            download_data: 0.0,
            upload_data: 0.0,
            is_active: false,
            is_premium: false,
            // is_uae: false,
            is_dead: false,
            check_health: false,
            bandwidth_reached: false,
        };
        const [countries, setCountries] = useState(null);
        const [country, setCountry] = useState(null);
        const [servers, setServers] = useState([]);
        const [serverDialog, setServerDialog] = useState(false);
        const [deleteServerDialog, setDeleteServerDialog] = useState(false);
        const [server, setServer] = useState(emptyServer);
        const [submitted, setSubmitted] = useState(false);
        const [newServer, setNewServer] = useState(false);
        const [ipTaken , setIpTaken] = useState('');
        const [nameTaken , setNameTaken] = useState('');
        const [dataServers] = useState([]);
        const toast = useRef(null);
        const dt = useRef(null);
        const input = useRef(null);
        const token = localStorage.getItem('token');
    //#endregion
   
    //#region useEffect
        useEffect(() => {  
            // servers     
            axios
            .get("api/dashboard/servers/all", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                response.data.forEach((index) => {
                    dataServers.push({
                        id: index.id,
                        name: index.name,
                        bandwidth: index.bandwidth,
                        bandwidth_reached:index.bandwidth_reached,
                        country_name:index.country_name,
                        max_connections_count: index.max_connections_count,
                        ip: index.ip,
                        connections_count: index.connections_count,
                        total_connected_sessions: index.total_connected_sessions,
                        total_disconnected_sessions: index.total_disconnected_sessions,
                        bandwidth_reached: index.bandwidth_reached === 0 ? false : true,
                        is_premium: index.is_premium == 0 ? false : true,
                        is_dead:index.is_dead == 0 ? false : true,
                        // is_uae:index.is_uae == 0 ? false : true,
                        is_active: index.is_active == 0 ? false : true,
                        check_health: index.check_health == 0 ? false : true,
                        download_data:index.download_data ,
                        upload_data:index.upload_data 
                    });});
                setServers(dataServers)
            })
            .catch((error) => {
                console.log(error)
            });

            // countries
            axios
            .get("api/dashboard/countries/all", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => 
            {
                setCountries(response.data);
            })
            .catch((error) => {
                console.log(error)
            });
        }, []); 
    //#endregion

    //#region open dialog
        const openNew = () => {
            setServer(emptyServer);
            setCountry(null);
            setSubmitted(false);
            setServerDialog(true);
            setNewServer(true);
        }
    //#endregion

    //#region hide dialogs
        const hideDialog = () => {
            setSubmitted(false);
            setServerDialog(false);
        }
        const hideDeleteServerDialog = () => {
            setDeleteServerDialog(false);
        }
    //#endregion

    //#region crud
        const saveServer = () => {
            setSubmitted(true);
            setNameTaken('')
            setIpTaken('')
            if (server.name.trim()) {
                let _servers = [...servers];
                let _server = {...server}
                /* update server */
                if (server.id) {   
                    axios
                    .put("api/dashboard/servers/update",_server, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    })
                    .then((response) => {
                        const index = findIndexById(server.id);
                        _servers[index] = _server;
                        setServers(_servers);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 4000 });
                        if(server.name !== "" && server.country_id !== null)
                        {
                            setServerDialog(false);
                            setServer(emptyServer);
                            setCountry(null);
                        } 
                    })
                    .catch((error) => {
                        setNameTaken(error.response.data.errors.name)
                        setIpTaken(error.response.data.errors.ip)
                        toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                    });

                }
                /* add new server */
                else {
                    axios
                    .post("api/dashboard/servers/add",_server , {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    })
                    .then((response) => {     
                        _server.id = response.data.id;
                        _server.connections_count = 0 ;
                        _server.total_connected_sessions = 0;
                        _server.total_disconnected_sessions = 0;
                        _servers.push(_server);
                        setServers(_servers);
                        if(response.status === 201){
                            toast.current.show({ severity: 'success', summary: 'Successful', detail: "Successfully added server!", life: 4000 });
                        }   
                        if(server.name !== "" && server.country_id !== null)
                        {
                            setServerDialog(false);
                            setServer(emptyServer);
                            setCountry(null);
                        }                     
                    })
                    .catch((error) => {                       
                        setIpTaken(error.response.data.errors.ip)
                        setNameTaken(error.response.data.errors.name)
                        toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                    });  
                }  
            }
        }
        const editServer = (server) => {
            let _server = {...server};           
            _server['download_data'] = server.download_data.toString().includes(',')? server.download_data.replace(',', ''): server.download_data;
            _server['upload_data'] = server.upload_data.toString().includes(',')? server.upload_data.replace(',', ''): server.upload_data;
            setServer({..._server});
            setServerDialog(true);
            setNewServer(false);
            let _country = countries.filter(val => val.name === server.country_name)[0];
            setCountry(_country)   
        }       
        const confirmDeleteServer = (server) => {
            setServer(server);
            setDeleteServerDialog(true);
        }
        const deleteServer = () => {       
            axios
                .delete(`api/dashboard/servers/remove/${server.id}`, {
                    headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    let _servers = servers.filter(val => val.id !== server.id);
                    setServers(_servers);
                    setDeleteServerDialog(false);
                    setServer(emptyServer);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 3500 });
                })
                .catch((error) => {
                    toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                });
        }
        const findIndexById = (id) => {
            let index = -1;
            for (let i = 0; i < servers.length; i++) {
                if (servers[i].id === id) {
                    index = i;
                    break;
                }
            }
            return index;
        }  
    //#endregion

    //#region change inputs
        const onCheckboxChange = (e) => {
            let _server = {...server};
            _server[e.target.name] = e.checked;
            setServer(_server);
        }
        const onInputChange = (e, name) => {
            setNameTaken('')
            let val = null;  
            if(name === "name") {val = e.target.value;}
            else if(name === "ip") {val = e ;}
            else {val = e.value;}
            let _server = {...server};
            _server[`${name}`] = val; 
            setServer(_server);           
        }   
        const onCountryChange = (e) => {        
            let _server = {...server};
            _server["country_id"] = parseInt(e.value.id); 
            _server["country_name"] = e.value.name;
            setServer(_server)
            setCountry(e.value)
        }
    //#endregion

    //#region toolbar 
        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                </React.Fragment>
            )
        }
    //#endregion
 
    //#region status
        const premiumStatus = (rowData) => {
            let premium = rowData.is_premium === false ? "false" : "true";
            return <span className={`custom-badge status-${rowData.is_premium}`}>{premium}</span>;
        }
        const deadStatus = (rowData) => {
            let dead = rowData.is_dead === false ? "false" : "true";
            return <span className={`custom-badge status-${rowData.is_dead}`}>{dead}</span>;
        }
        // const uaeStatus = (rowData) => {
        //     let uae = rowData.is_uae === false ? "false" : "true";
        //     return <span className={`custom-badge status-${rowData.is_uae}`}>{uae}</span>;
        // }
        const checkHealthStatus = (rowData) => {
            let checkHealth = rowData.check_health === false ? "false" : "true";
            return <span className={`custom-badge status-${rowData.check_health}`}>{checkHealth}</span>;
        }
        const bandwidthReachedStatus = (rowData) => {
            let bandwidthReached = rowData.bandwidth_reached === false ? "false" : "true";
            return <span className={`custom-badge status-${rowData.bandwidth_reached}`}>{bandwidthReached}</span>;
        }        
        const activeStatus = (rowData) => {
            let active = rowData.is_active === false ? "false" : "true";
            return <span className={`custom-badge status-${rowData.is_active}`}>{active}</span>;
        }
    //#endregion
   
    //#region columns
        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editServer(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteServer(rowData)} />
                </React.Fragment>
            );
        }
        const cols = [
            {field: 'id', header: 'Id' },
            {field: 'name', header: 'Name'},
            {field: 'country_name', header: 'Country'},
            {field: 'bandwidth', header: 'Bandwidth'},
            {field: 'download_data', header: 'Download data'},
            {field: 'upload_data', header: 'Upload data'},
            {field: 'max_connections_count', header: 'Max Connections'},
            {field: 'connections_count', header: 'Connections Count'},
            {field: 'total_connected_sessions', header: 'Connected Sessions'},
            {field: 'total_disconnected_sessions', header: 'Disconnected Sessions'},
            {field: 'ip', header: 'IP', placeholder:'Search by upload ip'},
            {field: 'bandwidth_reached', header: 'Bandwidth Reached',status:bandwidthReachedStatus},
            {field: 'is_dead', header: 'Dead', status:deadStatus},
            {field: 'is_premium', header: 'Premium',status:premiumStatus},
            {field: 'is_active', header: 'Active', status:activeStatus},
            // {field: 'is_uae', header: 'UAE', status:uaeStatus},
            {field: 'check_health', header: 'Check Health', status:checkHealthStatus},
            {field: 'operations' , status:actionBodyTemplate}
        ];
        let dynamicColumns = cols.map((col, i) => {
        input.current = col.field;
        return col.field === "operations"?
                    <Column ref={input} key={i} className='colume' field={col.field} body={col.status} style={{ wordWrap: "break-word" }}/> :
                    <Column ref={input} key={i} className='colume' field={col.field} header={col.header} style={{ wordWrap: "break-word" }} 
                            sortable filter filterPlaceholder={`Search by ${col.header.toLowerCase()}`} body={col.status}/>;
        });
    //#endregion
  
    //#region dialog footer
        const serverDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveServer} />
            </React.Fragment>
        );
        const deleteServerDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteServerDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteServer} />
            </React.Fragment>
        );
    //#endregion
 
    //#region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Servers</h5>                
            </div>
        );
    //#endregion

    //#region datatable
        return (
            <div className="datatable-responsive-demo p-p-4 p-d-block p-mx-auto">                
                {/* toast notification  */}
                <Toast ref={toast} />
                
                <Card style={{padding:"1rem"}}>
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate} ></Toolbar>
                    <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm" ref={dt} value={servers}
                        dataKey="id" paginator rows={50} rowsPerPageOptions={[50, 100, 500, 1000]} header={header} emptyMessage="No servers found."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Servers">                    
                    {dynamicColumns}
                    </DataTable>
                </Card>
                    
                {/* dialog for add / update server  */}
                <Dialog visible={serverDialog} style={{ width: '450px' }} header={newServer === true ? "Add new server" : "Update server"} modal className="p-fluid" footer={serverDialogFooter} onHide={hideDialog}>

                    <div className="p-field">
                        <label htmlFor="latitude">Name</label>
                        <InputText id="name" name="name" value={server.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !server.name })} />
                        {submitted && !server.name && <small className="p-invalid">Name is required.</small>}
                        {submitted && <small className="p-invalid">{nameTaken}</small>}
                    </div>

                    <div className="p-field">
                        <div className="p-formgrid p-grid">
                            <div className="p-field p-col-6">
                                <label htmlFor="country_id">Country</label>
                                <Dropdown value={country} options={countries} onChange={onCountryChange} optionLabel="name" placeholder="Select a Country" required autoFocus className={classNames({ 'p-invalid': submitted && !server.country_name })} />
                                {submitted && !server.country_name && <small className="p-invalid">Country is required.</small>}
                            </div>
                            <div className="p-field p-col-6">
                                <label htmlFor="max_connections_count">Max Connection</label>
                                <InputNumber id="max_connections_count" name="max_connections_count"  value={server.max_connections_count} min={0} onChange={(e) => onInputChange(e, 'max_connections_count')} />
                            </div>                                              
                        </div>
                    </div>

                    <div className="p-field">
                        <div className="p-formgrid p-grid">
                            <div className="p-field p-col-6">
                                <label htmlFor="bandwidth">Bandwidth</label>
                                <InputNumber id="bandwidth" name="bandwidth" value={server.bandwidth} onChange={(e) => onInputChange(e, 'bandwidth')} mode="decimal" minFractionDigits={2} />
                            </div>  
                                <div className="p-field p-col-6">
                                    <label htmlFor="ip">IP</label><br />
                                    <IPut id="ip" defaultValue={server.ip}  onChange={(e) => onInputChange(e, 'ip')} required autoFocus className={classNames({ 'react-ip-input  has-error': submitted && !server.ip })} />
                                    {submitted && <small className="p-invalid">{ipTaken}</small>}
                                </div>
                            </div>
                    </div>

                    <div className="p-field">
                        <div className="p-formgrid p-grid">
                            <div className="p-field p-col-6">
                                <label htmlFor="download_data">Download data</label>
                                <InputNumber id="download_data" name="download_data" value={server.download_data} onChange={(e) => onInputChange(e, 'download_data')} mode="decimal" minFractionDigits={4} />
                            </div>
                            <div className="p-field p-col-6">
                                <label htmlFor="longitude">Upload data</label>
                                <InputNumber id="upload_data" name="upload_data" value={server.upload_data} onChange={(e) => onInputChange(e, 'upload_data')} mode="decimal" minFractionDigits={4} />
                            </div>                        
                        </div>
                    </div>
            
                    <div className="p-field">
                        <div className="p-formgrid p-grid">
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="bandwidth_reached" name="bandwidth_reached" onChange={onCheckboxChange} checked={server.bandwidth_reached} />
                                <label htmlFor="bandwidth_reached">Bandwidth reached</label>
                            </div>
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_dead" name="is_dead" onChange={onCheckboxChange} checked={server.is_dead} />
                                <label htmlFor="is_dead">Dead</label>
                            </div> 
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_premium" name="is_premium" onChange={onCheckboxChange} checked={server.is_premium} />
                                <label htmlFor="is_premium">Premium</label>
                            </div>  
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_active" name="is_active" onChange={onCheckboxChange} checked={server.is_active} />
                                <label htmlFor="is_active">Active</label>
                            </div>
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="check_health" name="check_health" onChange={onCheckboxChange} checked={server.check_health} />
                                <label htmlFor="check_health">Check Health</label>
                            </div> 
                            {/* <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_uae" name="is_uae" onChange={onCheckboxChange} checked={server.is_uae} />
                                <label htmlFor="is_uae">UAE</label>
                            </div>                        */}
                        </div>
                    </div>
            
                </Dialog>

                {/* dialog for delete server  */}
                <Dialog visible={deleteServerDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServerDialogFooter} onHide={hideDeleteServerDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {server && <span>Are you sure you want to delete <b style={{color:"#D32F2F"}}>{server.name}</b> ?</span>}
                    </div>
                </Dialog>
            </div>
        )
    //#endregion

}
export default Servers;