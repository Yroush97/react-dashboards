import React , {useState,useEffect,useRef} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Checkbox } from 'primereact/checkbox';
import {Password} from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from "primereact/card";
import classNames from 'classnames';
import axios from "../../axios";

const Users = () => {

    //#region variables
        let emptyUser = {
            id: null,
            first_name: '',
            last_name: '',
            email: '',
            password:'',        
            role: 'free-user',
            is_active: false,
            is_online: false,
        };
        const [users, setUsers] = useState();
        const [dataUsers, setDataUsers] = useState([]);
        const [roles, setRoles] = useState([]);
        const [userDialog, setUserDialog] = useState(false);
        const [deleteUserDialog, setDeleteUserDialog] = useState(false);
        const [user, setUser] = useState(emptyUser);
        const [submitted, setSubmitted] = useState(false);
        const [emailTaken , setEmailTaken] = useState('');
        const [passwordValidation , setPasswordValidation] = useState('');
        const toast = useRef(null);
        const dt = useRef(null);
        const [loading, setLoading] = useState(false);
        const [first, setFirst] = useState(0);
        const [rows, setRows] = useState(50);
        const [page, setPage] = useState(1);
        const input = useRef(null);
        const [newUser, setNewUser] = useState(false);
        const [totalRecords, setTotalRecords] = useState(0);
        const token = localStorage.getItem('token');
        const [role, setRole] = useState(null);
        const [sortOrder, setSortOrder] = useState(-1);
        const [sortField, setSortField] = useState(null);
    //#endregion
    
    //#region useEffect
        useEffect(() => {   
            setLoading(true);
            axios
            .get(`api/dashboard/users/all?page=${page}&records_number=${rows}`, {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setDataUsers([])
                response.data.data.forEach((index) => {
                    dataUsers.push({
                        id:index.id,
                        first_name: index.first_name,
                        last_name: index.last_name,
                        role: index.role,
                        email: index.email,
                        download_data : formatBytes(index.download_data),
                        upload_data : formatBytes(index.upload_data),
                        last_login : index.last_login,
                        last_logout : index.last_logout,
                        is_online: index.is_online == 0 ? false:true,
                        is_active: index.is_active  == 0 ? false:true,
                        is_expired: index.is_expired  == 0 ? false:true
                    });});
                setTotalRecords(response.data.total);
                setUsers(dataUsers)   
                setLoading(false);        
            })
            .catch((error) => {
                console.log(error)
            });

            axios
            .get("api/dashboard/roles/all", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setRoles(response.data)           
            })
            .catch((error) => {
                console.log(error)
            });

        }, [page,rows]); 
    //#endregion

    //#region open dialog
        const openNew = () => {
            setUser(emptyUser);
            setSubmitted(false);
            setUserDialog(true);
            setRole(null);
            setNewUser(true);
        }
    //#endregion

    //#region lazy loading
        const onPage = (event) => {
            setLoading(true);
            setTimeout(() => {
                const { first:_first, rows } = event;
                setFirst(_first);
                setPage(event.page + 1);
                setRows(event.rows)
                setLoading(false);
            }, 500);
        }    
        let modelFilter = (val,placeholder) => {
            return (
            <input
                name={val}
                placeholder={placeholder}            
                className="p-inputtext p-component p-column-filter"
                onChange={onFilter}
            />
            );
        };
        const onFilter = (event)=> {
            let filterValue = event.target.value.toLowerCase();
            const trueValue = "true";
            const falseValue = "false";

            if(event.target.name === "is_active" || event.target.name === "is_online" || event.target.name === "is_expired")
            {
                if(falseValue.includes(filterValue))
                {
                    filterValue =0;
                }
                else if(trueValue.includes(filterValue))
                {
                    filterValue =1;
                }
            }
            else{
                filterValue= event.target.value;
            }

            if(event.target.value !== "")
            { 
                axios.get(`api/dashboard/users/all?page=${page}&records_number=${rows}&${event.target.name}=${filterValue}`,
                { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => 
                { 
                    setDataUsers([])
                    response.data.data.forEach((index) => {
                        dataUsers.push({
                            id:index.id,
                            first_name: index.first_name,
                            last_name: index.last_name,
                            role: index.role,
                            email: index.email,
                            download_data : formatBytes(index.download_data),
                            upload_data : formatBytes(index.upload_data),
                            last_login : index.last_login,
                            last_logout : index.last_logout,
                            is_online: index.is_online == 0 ? false:true,
                            is_active: index.is_active  == 0 ? false:true,
                            is_expired: index.is_expired  == 0 ? false:true
                        });});
                        setUsers(dataUsers)
                })
            }
            else{ 
                    axios
                    .get(
                    `api/dashboard/users/all?page=${page}&records_number=${rows}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                    )
                    .then((response) => 
                    { 
                        setDataUsers([])
                        response.data.data.forEach((index) => {
                            dataUsers.push({
                                id:index.id,
                                first_name: index.first_name,
                                last_name: index.last_name,
                                role: index.role,
                                email: index.email,
                                download_data : formatBytes(index.download_data),
                                upload_data : formatBytes(index.upload_data),
                                last_login : index.last_login,
                                last_logout : index.last_logout,
                                is_online: index.is_online == 0 ? false:true,
                                is_active: index.is_active  == 0 ? false:true,
                                is_expired: index.is_expired  == 0 ? false:true
                            });});
                            setUsers(dataUsers)
                    })
            }
        }
        const onSort = (event) => {

            setSortOrder(event.sortOrder);
            setSortField(event.sortField);   

            if (event.sortOrder == 1) {          
            let usersSortReverse = users.sort((a, b) => {
                if (a[event.sortField] == null) return 1;
                if (b[event.sortField] == null) return -1;
        
                if (a[event.sortField] < b[event.sortField]) return -1;
                if (a[event.sortField] > b[event.sortField]) return 1;
            });
            setUsers(usersSortReverse);
            } 
            else if (event.sortOrder === -1) {
            
            let usersSortNormal = users.sort((a, b) => {
                if (a[event.sortField] == null) return 1;
                if (b[event.sortField] == null) return -1;
        
                if (a[event.sortField] < b[event.sortField]) return 1;
                if (a[event.sortField] > b[event.sortField]) return -1;
            });
            setUsers(usersSortNormal);
        }       
        }
    //#endregion
  
    //#region hide dialogs
        const hideDialog = () => {
            setSubmitted(false);
            setUserDialog(false);
        }
        const hideDeleteUserDialog = () => {
            setDeleteUserDialog(false);
        }
    //#endregion

    //#region crud
        const saveUser = () => {
            setSubmitted(true);
            setEmailTaken('')
            if (user.email.trim()) {
                let _users = [...users];
                let _user = {...user};                          
                if (user.id) {   
                    if(_user.password === ""){
                       delete _user.password
                    }     
                    axios.put("api/dashboard/users/update", _user, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {                       
                        const index = findIndexById(user.id);
                        _users[index] = _user;
                        setUsers(_users);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 4000 });
                        if(user.email !== "")
                        {
                             setUserDialog(false);
                             setUserDialog(false);
                             setUser(emptyUser);
                        }
           
                    })
                    .catch((error) => {
                        setEmailTaken(error.response.data.errors.email)
                        toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});    
                    });

                }
                else {
                    axios.post("api/dashboard/users/add", _user, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        _user.id = response.data.id;
                        _user.is_expired = false;
                        _users.push(_user);
                        setUsers(_users);
                        setTotalRecords(totalRecords+1)
                        if(response.status === 201){
                            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 4000 });                   
                        } 
                        if(user.email !== "" && user.password !== "")
                        {
                             setUserDialog(false);
                             setUserDialog(false);
                             setUser(emptyUser);
                        }                     
                    })
                    .catch((error) => {
                        setEmailTaken(error.response.data.errors.email)
                        setPasswordValidation(error.response.data.errors.password)
                        toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                    });  
                }              
            }
        }
        const editUser = (user) => {
            let _user = {...user};
            _user.password = "" ;
            setUser(_user);
            setUserDialog(true);
            let _role = roles.filter(val => val.name === user.role)[0];
            setRole(_role);
            setNewUser(false);
        }
        const confirmDeleteUser = (user) => {
            setUser(user);
            setDeleteUserDialog(true);
        }
        const deleteUser = () => {       
            axios.delete(`api/dashboard/users/remove/${user.id}`, {
                    headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {               
                   setTotalRecords(totalRecords-1)
                   let _users = users.filter(val => val.id !== user.id);
                   setUsers(_users);
                   setDeleteUserDialog(false);
                   setUser(emptyUser);
                   toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 4000 });                  
                })
                .catch((error) => {
                    toast.show({severity: 'error', summary: 'Error Message', detail: error.message});
                });
        }
        const findIndexById = (id) => {
            let index = -1;
            for (let i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    //#endregion
   
    //#region change inputs
        const onRoleChange = (e) => {       
            let _user = {...user};
            _user["role"] = e.value.name; 
            setUser(_user)
            setRole(e.value)      
        }
        const onCheckboxChange = (e) => {
            let _user = {...user};
            _user[e.target.name] = e.checked;
            setUser(_user);
        }
        const onInputChange = (e, name) => {         
            const val =  e.target.value;           
            let _user = {...user};
            _user[`${name}`] = val; 
            setUser(_user);
        }
        const formatBytes =(bytes, decimals = 2)=> {
            if (bytes === 0 || bytes === null) return '';            
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];        
            const i = Math.floor(Math.log(bytes) / Math.log(k));        
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
        const onlineStatus = (rowData) => {
            let online = rowData.is_online === false ? "false" : "true";
            return <span className={`custom-badge status-${rowData.is_online}`}>{online}</span>;
        }
        const expiredStatus = (rowData) => {
            let expired = rowData.is_expired === false ? "false" : "true";
            return <span className={`custom-badge status-${rowData.is_expired}`}>{expired}</span>;
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
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editUser(rowData)} />
                    <Button icon="pi pi-trash" disabled={rowData.role === "admin"  | rowData.role === "super-admin" ? true:false}  className="p-button-rounded p-button-danger" onClick={() => confirmDeleteUser(rowData)} />
                </React.Fragment>
            );
        }
        const cols = [
            {field: 'id', header: 'Id'},
            {field: 'first_name', header: 'First name'},
            {field: 'last_name', header: 'Last name'},
            {field: 'role', header: 'Role'},
            {field: 'email', header: 'Email'},
            {field: 'download_data', header: 'Download data'},
            {field: 'upload_data', header: 'Upload data'},
            {field: 'last_login', header: 'Last login'},
            {field: 'last_logout', header: 'Last logout'},
            {field: 'is_online', header: 'Online',status:onlineStatus},
            {field: 'is_expired', header: 'Expired', status:expiredStatus},
            {field: 'is_active', header: 'Active', status:activeStatus},
            {field: 'operations' , status:actionBodyTemplate}
        ];
        let dynamicColumns = cols.map((col, i) => {
            input.current = col.field;
            return col.field === "operations"?
                        <Column ref={input} key={i} className='colume' field={col.field} body={col.status} style={{ wordWrap: "break-word" }}/> :
                        <Column ref={input} key={i} className='colume' field={col.field} header={col.header} sortable filter 
                        filterElement={modelFilter(col.field , `Search by ${col.header.toLowerCase()}`)} body={col.status} style={{ wordWrap: "break-word" }}/>;
        });
    //#endregion
   
    //#region dialog footer
        const userDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
            </React.Fragment>
        );

        const deleteUserDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUser} />
            </React.Fragment>
        );
    //#endregion

    //#region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Users</h5>                
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
                    <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm" ref={dt} value={users} lazy totalRecords={totalRecords}
                        lazy first={first} onPage={onPage} loading={loading} sortOrder={sortOrder}  sortField={sortField}
                        dataKey="id" paginator rows={rows} rowsPerPageOptions={[50, 100, 500, 1000]} onSort={onSort}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        emptyMessage="No users found." header={header}>
                        {dynamicColumns}
                    </DataTable>
                </Card>

                {/* dialog for add / update user  */}
                <Dialog visible={userDialog} style={{ width: '450px' }} header={newUser === true ? "Add new user" : "Update user"} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
            
                    <div className="p-field">
                    <div className="p-formgrid p-grid">
                            <div className="p-field p-col-6">
                                    <label htmlFor="first_name">First Name</label>
                                    <InputText id="first_name" name="first_name" value={user.first_name} onChange={(e) => onInputChange(e, 'first_name')} autoFocus />
                            </div>  
                            <div className="p-field p-col-6">
                                    <label htmlFor="last_name">Last Name</label>
                                    <InputText id="last_name" name="last_name" value={user.last_name} onChange={(e) => onInputChange(e, 'last_name')} autoFocus />
                            </div>
                        </div>
                    </div>
                
                    <div className="p-field">
                        <label htmlFor="role">Role</label>
                        <Dropdown value={role} options={roles} onChange={onRoleChange} optionLabel="name" placeholder="Select a role" autoFocus />
                    </div>

                    <div className="p-field">
                    <label htmlFor="email">Email</label>
                        <InputText id="email" name="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email })} />
                        {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                        {submitted && <small className="p-invalid">{emailTaken}</small>}
                    </div>
                
                    <div className="p-field">
                        <label htmlFor="password">Password</label>
                        <Password  id="password" name="password"  value={user.password}  onChange={(e) => onInputChange(e, 'password')} autoFocus />
                        {submitted && <small className="p-invalid">{passwordValidation}</small>}
                    </div>

                    <div className="p-field p-mt-5">
                        <div className="p-formgrid p-grid">
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_online" name="is_online" onChange={onCheckboxChange} checked={user.is_online} />
                                <label htmlFor="is_online">Online</label>
                            </div>                         
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_active" name="is_active" onChange={onCheckboxChange} checked={user.is_active} />
                                <label htmlFor="is_active">Active</label>
                            </div>                        
                        </div>
                    </div>
                
                </Dialog>

                {/* dialog for delete user  */}
                <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {user && <span>Are you sure you want to delete <b style={{color:"#D32F2F"}}>{user.first_name + " " + user.last_name}</b> ?</span>}
                    </div>
                </Dialog>

            </div>
        )
    //#endregion

}
export default Users