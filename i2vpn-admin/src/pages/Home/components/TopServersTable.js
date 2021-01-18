import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import API from "../../../shared/api"
const TopServersTable = () => {

    //#region variables
        const [topServersConnections, setTopServersConnections] = useState([]);
    //#endregion

    //#region useEffect
        useEffect(()=>{   
            API.getTopServersConnections().then(data => setTopServersConnections(data))
            const interval = setInterval(() => API.getTopServersConnections().then(data => setTopServersConnections(data)) , 5000)
            return () => {clearInterval(interval);}           
        },[])
    //#endregion
  
   //#region table
        return (
            <Card title="Top servers connections" style={{maxWidth:"550px", padding:"1rem"}}>
                <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm" value={topServersConnections} paginator rows={5} rowsPerPageOptions={[5,10]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} servers">
                    <Column field="name" header="Name"></Column>   
                    <Column field="connections_count" header="Connections"></Column>
                </DataTable>
            </Card>
        )
    //#endregion

}
export default TopServersTable