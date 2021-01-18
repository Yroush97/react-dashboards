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
import { Card } from 'primereact/card';

const Notifications = () => {

    //#region variables
        let emptyNotification = {
            id: null,
            title: '',
            message: '',       
        };
        const [notifications, setNotifications] = useState([]);
        const [notificationDialog, setNotificationDialog] = useState(false);
        const [deleteNotificationDialog, setDeleteNotificationDialog] = useState(false);
        const [notification, setNotification] = useState(emptyNotification);
        const [submitted, setSubmitted] = useState(false);
        const [viewNotificationInfo, setViewNotificationInfo] = useState(false);
        const toast = useRef(null);
        const dt = useRef(null);
        const token = localStorage.getItem('token');
    //#endregion
  
    //#region useEffect
        useEffect(() => {       
            axios
            .get("api/dashboard/get_all_notifications", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setNotifications(response.data)  
            })
            .catch((error) => {
                console.log(error)
            });
        }, []);
    //#endregion
    
    //#region open dialog
        const openNew = () => {
            setNotification(emptyNotification);
            setSubmitted(false);
            setNotificationDialog(true);
        }
    //#endregion
   
    //#region hide dialogs
        const hideDialog = () => {
            setSubmitted(false);
            setNotificationDialog(false);
            setViewNotificationInfo(false);
        }
        const hideDeleteNotificationDialog = () => {
            setDeleteNotificationDialog(false);
        }
    //#endregion

    //#region crud
        const saveNotification = () => {
            setSubmitted(true);
            if (notification.title.trim()) {
                let _notifications = [...notifications];
                let _notification = {...notification}; 

                axios
                .post("api/dashboard/notify-all", {
                    title: _notification.title,
                    message: _notification.message,               
                    }, {
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {    
                    _notifications.push(_notification);               
                    setNotifications(_notifications)     
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Notification Sent', life: 3000 });  
                    if(notification.title !== "" && notification.message !== "")
                    {
                        setNotificationDialog(false);
                        setNotification(emptyNotification);
                    } 
                
                })
                .catch((error) => {                    
                    toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                });                 
            }
        }
        const viewNotification = (notification) => {
            setNotification({...notification});
            setNotificationDialog(true);
            setViewNotificationInfo(true);
        }
        const confirmDeleteNotification = (notification) => {
            setNotification(notification);
            setDeleteNotificationDialog(true);
        }
        const deleteNotification = () => {              
            axios
                .delete(`api/dashboard/posts/remove/${notification.id}`, {
                    headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    let _notifications = notifications.filter(val => val.id !== notification.id);
                    setNotifications(_notifications);
                    setDeleteNotificationDialog(false);
                    setNotification(emptyNotification);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 3000 });
                })
                .catch((error) => {
                    toast.show({severity: 'error', summary: 'Error Message', detail: 'Validation failed'});
                });
        }
    //#endregion

    //#region toolbar
        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="Send notification" icon="pi pi-bell" className="p-button-success p-mr-2" onClick={openNew}  />
                </React.Fragment>
            )
        }
    //#endregion
 
    //#region change inputs
        const onInputChange = (e, name) => {   
            const val = e.target.value ;           
            let _notification = {...notification};
            _notification[`${name}`] = val; 
            setNotification(_notification);
        }
    //#endregion

    //#region oprations
        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-info p-mr-2" onClick={() => viewNotification(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteNotification(rowData)} />
                </React.Fragment>
            );
        }
    //#endregion

    //#region dialog footer
    const notificationDialogFooter = (
        <React.Fragment>
            {
                viewNotificationInfo === true ? 
                    <Button label="Close" icon="pi pi-times" className="p-button-text" onClick={hideDialog} /> :
                <>
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                    <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveNotification} />
                </>
            }           
        </React.Fragment>
    );
    const deleteNotificationDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteNotificationDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteNotification} />
        </React.Fragment>
    );
    //#endregion

    //#region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Notifications</h5>            
            </div>
        );
    //#endregion

    //#region datatable
        return (
            <div className="datatable-responsive-demo p-p-4 p-d-block p-mx-auto">
                
                {/* toast notification  */}
                <Toast ref={toast} />
            
                {/* dataTable & columns  */}
                <Card style={{padding:"1rem"}}>                
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate} ></Toolbar>
                    <DataTable ref={dt} value={notifications} className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm"
                        dataKey="id" paginator rows={50} rowsPerPageOptions={[50, 100, 500, 1000]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} notifications"
                        header={header} emptyMessage="No notifications found.">
                        <Column field="title" header="Title" sortable filter filterPlaceholder="Search by title" style={{ wordWrap: "break-word" }}></Column>
                        <Column field="message" header="Message" sortable filter filterPlaceholder="Search by message" style={{ wordWrap: "break-word" }}></Column>
                        <Column body={actionBodyTemplate} ></Column>
                    </DataTable>
                </Card>   
        
                {/* dialog for add notification  */}
                <Dialog visible={notificationDialog} style={{ width: '450px' }} header={viewNotificationInfo !== true ? "Add new notification" : "Notification Details"}  modal className="p-fluid" footer={notificationDialogFooter} onHide={hideDialog}>
                
                    <div className="p-field p-mt-3">
                        <label htmlFor="title">Title</label>
                        <InputText id="title" name="title" value={notification.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !notification.title })} />
                        {submitted && !notification.title && <small className="p-invalid">Title is required.</small>}
                    </div>
                
                    <div className="p-field">
                    <label htmlFor="message">Message</label>
                        <InputTextarea id="message" name="message" rows={5} cols={30} value={notification.message} placeholder="Max length 250 characters" onChange={(e) => onInputChange(e, 'message')} required autoFocus className={classNames({ 'p-invalid': submitted && !notification.message })} />
                        {submitted && !notification.message && <small className="p-invalid">Message is required.</small>}
                    </div>
                
                </Dialog>

                {/* dialog for delete notification  */}
                <Dialog visible={deleteNotificationDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteNotificationDialogFooter} onHide={hideDeleteNotificationDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {notification && <span>Are you sure you want to delete <b style={{color:"#D32F2F"}}>{notification.title}</b> ?</span>}
                    </div>
                </Dialog>

            </div>
        )
    //#endregion

}
export default Notifications