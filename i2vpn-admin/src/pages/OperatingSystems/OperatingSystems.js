import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import axios from "../../axios"

const OperatingSystems = () => {

    //#region variables
        const [operatingSystems, setOperatingSystems] = useState([]);
        const token = localStorage.getItem('token');
        const [loading, setLoading] = useState(false);
        const input = useRef(null);
        const dt = useRef(null);
        const rows = 50;
    //#endregion

    // #region useEffect
        useEffect(() => {
            setLoading(true);            
            axios
            .get("api/dashboard/operating-systems/all", {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setOperatingSystems(response.data)
                setLoading(false);
            })
            .catch((error) => {
                console.log(error)
            });
        }, []);
    //#endregion
  
    // #region columns
        const cols=[
            {field:'id',header:'ID'},
            {field:'name',header:'Name'},
            {field:'version',header:'Version'},
            {field:'type',header:'Type'},
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
                <h5 className="p-m-0">Manage Operating Systems</h5>            
            </div>
        );
    //#endregion

    //#region datatable
        return (
            <div className="datatable-responsive-demo p-p-4 p-d-block p-mx-auto">
                <Card style={{padding:'1rem'}}>
                    <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows" ref={dt} value={operatingSystems}
                        dataKey="id" resizableColumns columnResizeMode="expand" header={header} paginator rows={rows}
                        rowsPerPageOptions={[50, 100, 500, 1000]}
                        loading={loading} emptyMessage="No operating systems found."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} operating systems">                        
                        {dynamicColumns}
                    </DataTable>
                </Card>
            </div>
        );
    //#endregion
}
export default OperatingSystems;