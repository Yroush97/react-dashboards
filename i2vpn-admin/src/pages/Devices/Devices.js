import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import axios from "../../axios"

const Devices = () => {

    // #region variables
        const [devices, setDevices] = useState([]);
        const [loading, setLoading] = useState(false);
        const token = localStorage.getItem('token');
        const input = useRef(null);
        const dt = useRef(null);
        const rows = 50;
    //#endregion
   
    // #region useEffect
        useEffect(() => {
            setLoading(true);            
            axios
            .get("api/dashboard/devices/all", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setDevices(response.data)
                setLoading(false);
            })
            .catch((error) => {
                console.log(error)
            });
        }, []);
    // #endregion
    
    //#region columns
        const cols = [
            { field: 'id', header: 'ID' },   
            { field: "user_id", header: "User ID" },
            { field: "user_name", header: "UserName" },
            { field: 'model', header: 'Model' },
            { field: 'mac', header: 'Mac' },
            { field: "app_version", header: "App Version" },
            { field: "os_name", header: "OS Name" },
        ];
        let dynamicColumns = cols.map((col, i) => {
            input.current = col.field;
            return <Column className='colume' ref={input} key={i} field={col.field} sortable={true} style={{ wordWrap: "break-word" }}
                        filter={true} header={col.header} filterPlaceholder= {`Search by ${col.header.toLowerCase()}`} />;
        });
    //#endregion

    // #region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Devices</h5>               
            </div>
        );
    //#endregion

    //#region datatable
        return (
            <div className="datatable-responsive-demo p-p-4 p-d-block p-mx-auto">
                <Card style={{padding:'1rem'}}>
                    <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows" ref={dt} value={devices} dataKey="id"
                        header={header} paginator rows={rows} rowsPerPageOptions={[50, 100, 500, 1000]} loading={loading} emptyMessage="No devices found."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} devices">                        
                        {dynamicColumns}
                    </DataTable>
                </Card>
            </div>
        );
    //#endregion

}
export default Devices;