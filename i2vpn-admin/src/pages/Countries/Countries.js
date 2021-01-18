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
import { Card } from "primereact/card";
import classNames from 'classnames';
import axios from "../../axios";

const Countries = () => {

    //#region variables
        let emptyCountry = {
            id: null,
            name: '',
            img: '',
            sort: 0,
            latitude: 0.0,
            longitude: 0.0,
            is_active: false,
            is_premium: false,
        };
        const [countries, setCountries] = useState(null);
        const [dataCountries] = useState([]);
        const [countryDialog, setCountryDialog] = useState(false);
        const [deleteCountryDialog, setDeleteCountryDialog] = useState(false);
        const [country, setCountry] = useState(emptyCountry);
        const [submitted, setSubmitted] = useState(false);
        const [newCountry, setNewCountry] = useState(false);
        const [nameTaken , setNameTaken] = useState('');
        const [imageTaken , setImageTaken] = useState('');
        const [latitudePrevent , setLatitudePrevent] = useState('');
        const [longitudePrevent , setLongitudePrevent] = useState('');
        const toast = useRef(null);
        const dt = useRef(null);
        const input = useRef(null);
        const token = localStorage.getItem('token');
    //#endregion
  
    //#region  useEffect
        useEffect(() => {
            axios
            .get("api/dashboard/countries/all", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                response.data.forEach((index) => {
                    dataCountries.push({
                    id: index.id,
                    name: index.name,
                    img: index.img,
                    sort: index.sort,
                    latitude: index.latitude,
                    longitude: index.longitude,
                    is_premium: index.is_premium == 0 ? false : true,
                    is_active: index.is_active == 0 ? false : true,
                    });});
            setCountries(dataCountries);
            })
            .catch((error) => {
                console.log(error)
            });
        }, []);
    //#endregion
   
    //#region open dialog
        const openNew = () => {
            setCountry(emptyCountry);
            setSubmitted(false);
            setCountryDialog(true);
            setNewCountry(true);
        }
    //#endregion
  
    //#region hide dialogs
        const hideDialog = () => {
            setSubmitted(false);
            setCountryDialog(false);
        }
        const hideDeleteCountryDialog = () => {
            setDeleteCountryDialog(false);
        }
    //#endregion
  
    //#region crud
        const saveCountry = () => {
            setSubmitted(true);
            setNameTaken('')
            setImageTaken('')
            setLatitudePrevent('')
            setLongitudePrevent('')
            if (country.name.trim()) {
                let _countries = [...countries];
                let _country = {...country};

                if (country.id) {
                    axios
                    .put("api/dashboard/countries/update", _country, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    })
                    .then((response) => {
                        const index = findIndexById(country.id);
                        _countries[index] = _country;
                        setCountries(_countries);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 4000 });
                        if(country.name !== "" && country.img !== "")
                        {
                            setCountryDialog(false);
                            setCountry(emptyCountry);
                        }
                    })
                    .catch((error) => {
                        setNameTaken(error.response.data.errors.name)
                        setImageTaken(error.response.data.errors.img)
                        toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                    });
                }
                else {
                    axios
                    .post("api/dashboard/countries/add", _country, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        _country.id = response.data.id;
                        _countries.push(_country);
                        setCountries(_countries);
                        if(response.status === 201){
                            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 4000 });
                        }
                        if(country.name !== "" && country.img !== "")
                        {
                            setCountryDialog(false);
                            setCountry(emptyCountry);
                        }
                        })
                    .catch((error) => {
                        setNameTaken(error.response.data.errors.name)
                        setImageTaken(error.response.data.errors.img)
                        toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                    });
                }                
                           
            }
        }
        const editCountry = (country) => {
            setCountry({...country});
            setCountryDialog(true);
            setNewCountry(false);
            setLatitudePrevent('')
            setLongitudePrevent('')
        }
        const confirmDeleteCountry = (country) => {
            setCountry(country);
            setDeleteCountryDialog(true);
        }
        const deleteCountry = () => {
            axios
                .delete(`api/dashboard/countries/remove/${country.id}`, {
                    headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    let _countries = countries.filter(val => val.id !== country.id);
                    setCountries(_countries);
                    setDeleteCountryDialog(false);
                    setCountry(emptyCountry);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 3500 });
                })
                .catch((error) => {
                    toast.current.show({severity: 'error', summary: 'Error Message', detail: error.message});
                });
        }
        const findIndexById = (id) => {
            let index = -1;
            for (let i = 0; i < countries.length; i++) {
                if (countries[i].id === id) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    //#endregion
 
    //#region change inputs
        const onCheckboxChange = (e) => {
            let _country = {...country};
            _country[e.target.name] = e.checked;
            setCountry(_country);
        }
        const onInputChange = (e, name) => {           
            setLatitudePrevent('')
            setLongitudePrevent('')
            setImageTaken('')
            if(name === 'latitude')
            {   let value = e.value.toString().split(".")[0]        
                if(value.length > 2 &&  !value.includes('-') || value.length > 3 && value.includes('-')){
                    let _country = {...country};
                    _country['latitude'] = 0.0;
                    setCountry(_country);
                    setLatitudePrevent('Numeric value out of range')
                }                
                else{
                    const val = e.value ;
                    let _country = {...country};
                    _country['latitude'] = val;
                    setCountry(_country);
                }                
            } 
            else if(name === 'longitude')
            {   let value = e.value.toString().split(".")[0]       
                if(value.length > 3 &&  !value.includes('-') || value.length > 4 && value.includes('-') ){
                    let _country = {...country};
                    _country['longitude'] = 0.0;
                    setCountry(_country);           
                    setLongitudePrevent('Numeric value out of range')
                }                  
                else{
                    const val = e.value ;
                    let _country = {...country};
                    _country['longitude'] = val;
                    setCountry(_country);
                }            
            }  
            else{
                const val = (name === "name" | name === "img" )?  e.target.value : e.value ;
                let _country = {...country};
                _country[`${name}`] = val;
                setCountry(_country);
            }         
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
            return <div className={`custom-badge status-${rowData.is_premium}`}>{premium}</div>;
        }
        const activeStatus = (rowData) => {
            let active = rowData.is_active === false ? "false" : "true";
            return <div className={`custom-badge status-${rowData.is_active}`}>{active}</div>;
        }
    //#endregion
  
    //#region columns
        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-1" onClick={() => editCountry(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteCountry(rowData)} />
                </React.Fragment>
            );
        }    
        const cols = [
            {field: 'id', header: 'Id'},
            {field: 'name', header: 'Name'},
            {field: 'img', header: 'Image'},
            {field: 'sort', header: 'Sort'},
            {field: 'latitude', header: 'Latitude'},
            {field: 'longitude', header: 'Longitude'},
            {field: 'is_premium', header: 'Premium',status:premiumStatus},
            {field: 'is_active', header: 'Active',status:activeStatus},
            {field: 'operations' , status:actionBodyTemplate}
        ];
        let dynamicColumns = cols.map((col, i) => {
            input.current = col.field;
            return col.field === "operations"?
                        <Column ref={input} key={i} className='colume' field={col.field} body={col.status} style={{ wordWrap: "break-word" }}/> :
                        <Column ref={input} key={i} className='column' field={col.field} header={col.header}
                                sortable filter filterPlaceholder={`Search by ${col.header.toLowerCase()}`} body={col.status} style={{ wordWrap: "break-word" }}/>;
        });
    //#endregion
  
    //#region dialog footer
        const countryDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCountry} />
            </React.Fragment>
        );
        const deleteCountryDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCountryDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCountry} />
            </React.Fragment>
        );
    //#endregion
    
    //#region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Countries</h5>
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
                    <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm" ref={dt} value={countries}
                        dataKey="id" paginator rows={50} rowsPerPageOptions={[50, 100, 500, 1000]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} countries"
                        header={header} emptyMessage="No countries found.">
                        {dynamicColumns}
                    </DataTable>
                </Card>

                {/* dialog for add / update country  */}
                <Dialog visible={countryDialog} style={{ width: '450px' }} header={newCountry ===true ? "Add new country" : "Update country"} modal className="p-fluid" footer={countryDialogFooter} onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" name="name" value={country.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !country.name })} />
                        {submitted && !country.name && <small className="p-invalid">Name is required.</small>}
                        {submitted && <small className="p-invalid">{nameTaken}</small>}
                    </div>
                    <div className="p-field">
                    <label htmlFor="img">Image</label>
                        <InputText id="img" name="img" value={country.img} onChange={(e) => onInputChange(e, 'img')} required autoFocus className={classNames({ 'p-invalid': submitted && !country.img })} />
                        {submitted && !country.img && <small className="p-invalid">Image is required.</small>}
                        {submitted && <small className="p-invalid">{imageTaken}</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="sort">Sort</label>
                        <InputNumber id="sort" name="sort"  value={country.sort} min={0} onChange={(e) => onInputChange(e, 'sort')} />
                    </div>
                    <div className="p-field">
                        <div className="p-formgrid p-grid">
                            <div className="p-field p-col-6">
                                <label htmlFor="latitude">Latitude</label>
                                <InputNumber id="latitude" name="latitude" value={country.latitude} onChange={(e) => onInputChange(e, 'latitude')} mode="decimal" minFractionDigits={6} required autoFocus className={classNames({ 'p-invalid': latitudePrevent !== "" })} />
                                <small className="p-invalid">{latitudePrevent}</small>
                            </div>
                            <div className="p-field p-col-6">
                                <label htmlFor="longitude">Longitude</label>
                                <InputNumber id="longitude" name="longitude" value={country.longitude} onChange={(e) => onInputChange(e, 'longitude')} mode="decimal" minFractionDigits={6} required autoFocus className={classNames({ 'p-invalid': longitudePrevent !== "" })} />
                                <small className="p-invalid">{longitudePrevent}</small>
                            </div>
                        </div>
                    </div>
                    <div className="p-field">
                        <div className="p-formgrid p-grid">
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_premium" name="is_premium" onChange={onCheckboxChange} checked={country.is_premium} />
                                <label htmlFor="is_premium">Premium</label>
                            </div>
                            <div className="p-field-checkbox p-col-6">
                                <Checkbox inputId="is_active" name="is_active" onChange={onCheckboxChange} checked={country.is_active} />
                                <label htmlFor="is_active">Active</label>
                            </div>
                        </div>
                    </div>
                </Dialog>

                {/* dialog for delete country  */}
                <Dialog visible={deleteCountryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCountryDialogFooter} onHide={hideDeleteCountryDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {country && <span>Are you sure you want to delete  <b style={{color:"#D32F2F"}}>{country.name}</b> ?</span>}
                    </div>
                </Dialog>

            </div>
        )
    //#endregion

}
export default Countries;