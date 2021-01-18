import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import API from "../../../shared/api"
const DeadServersTable = () => {

    //#region variables
        const [serversDead, setserversDead] = useState([]);
    //#endregion

    //#region useEffect
        useEffect(()=>{           
            API.getServersDead().then(data => setserversDead(data))
            const interval = setInterval(() => API.getServersDead().then(data => setserversDead(data)) , 5000)
            return () => {clearInterval(interval);}   
        },[])
    //#endregion

    //#region table
        return (
            <Card title="Dead servers" style={{maxWidth:"550px", padding:"1rem"}}>
                <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm" value={serversDead} paginator rows={5} rowsPerPageOptions={[5,10 , 15 , 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dead servers">
                    <Column field="id" header="ID"></Column>   
                    <Column field="name" header="Name"></Column>
                </DataTable>
            </Card>
        )
    //#endregion

}
export default DeadServersTable