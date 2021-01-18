import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from "primereact/card";
import Moment from 'moment';
import axios from "../../axios";

const Sessions = () => {

    // #region variables
        const [sessions, setSessions] = useState([]);
        const [sortOrder, setSortOrder] = useState(1);
        const [sortField, setSortField] = useState('');
        const [totalRecords, setTotalRecords] = useState(0);
        const [first, setFirst] = useState(0);
        const [rows, setRows] = useState(50);
        const [page, setPage] = useState(1);
        const [loading, setLoading] = useState(false);
        const token = localStorage.getItem('token');
        const input = useRef('');
    //#endregion

    // #region useEffect
        useEffect(() => {
            setLoading(true);
            axios.get(`api/dashboard/sessions/time-range?page=${page}&records_number=${rows}&from=${Moment().format('YYYY')}-01-01 00:00:00&to=${Moment().format('YYYY-MM-DD hh:mm:ss')}`, {
                headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setSessions(response.data.data);
                    setTotalRecords(response.data.total);
                    setLoading(false);
                })
                ;
        }, [page,rows]);
    // #endregion
   
    // #region lazy loading    
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
        const onFilter = (event)=> {

            if(event.target.value !== "")
            {
            let to = Moment().format('YYYY-MM-DD hh:mm:ss').toString();
            axios.get(`api/dashboard/sessions/time-range?page=${page}&records_number=${rows}&from=2020-01-01 00:00:00&to=${to}&${event.target.name}=${event.target.value}`, {
                headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setSessions(response.data.data);
                });
            }
            else{
                let to = Moment().format('YYYY-MM-DD hh:mm:ss').toString();
                axios.get(`api/dashboard/sessions/time-range?page=${page}&records_number=${rows}&from=2020-01-01 00:00:00&to=${to}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((response) => {
                        setSessions(response.data.data);
                    });        
            }
        }
        let modelFilter = (val,placeholder) => {
            return (
            <input name={val} placeholder={placeholder}            
                className="p-inputtext p-component p-column-filter"
                onChange={onFilter}
            />
            );
        };
        const onSort = (event) => {
            setSortField(event.sortField);
            setSortOrder(event.sortOrder);
            if (event.sortOrder == 1) {          
                let reverse = sessions.sort((a, b) => {
                    if (a[event.sortField] == null) return 1;
                    if (b[event.sortField] == null) return -1;

                    if (a[event.sortField] < b[event.sortField]) return -1;
                    if (a[event.sortField] > b[event.sortField]) return 1;
                });
                setSessions(reverse);
            } 
            else if (event.sortOrder !== 1) {
            
                let normal = sessions.sort((a, b) => {
                    if (a[event.sortField] == null) return 1;
                    if (b[event.sortField] == null) return -1;
            
                    if (a[event.sortField] < b[event.sortField]) return 1;
                    if (a[event.sortField] > b[event.sortField]) return -1;
                });
                setSessions(normal);
            }       
        }   
    //#endregion

    // #region columns
        const cols = [
            { field: 'id', header: 'ID' },
            { field: 'user_id', header: 'User ID' },
            { field: 'user_email', header: 'User Email' },
            { field: 'server_id', header: 'Server ID' },
            { field: 'server_name', header: 'Server Name' },
            { field: 'trusted_ip', header: 'Trusted IP' },
            { field: 'trusted_port', header: 'Trusted port' },
            { field: 'remote_ip', header: 'Remote IP' },
            { field: 'remote_port', header: 'Remote Port' },
            { field: 'start_time', header: 'Start Time' },
            { field: 'end_time', header: 'End Time' },
            { field: 'sent_data', header: 'Sent Data' },
            { field: 'received_data', header: 'Received Data' },        
        ]
        let dynamicColumns = cols.map((col, i) => {
            input.current = col.field;
            return <Column ref={input} key={i} field={col.field} header={col.header} filter={true} sortable={true}
                    sortFunction={onSort} sortField={col.field} filterPlaceholder= {`Search by ${col.header}`} style={{ wordWrap: "break-word" }}
                    filterMatchMode="contains" filterElement={modelFilter(col.field,`Search by ${col.header.toLowerCase()}`)} />
        }) 
    //#endregion
 
     // #region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Sessions</h5>            
            </div>
        );
    //#endregion

    // #region datatable
        return (
            <div className="datatable-responsive-demo p-p-4 p-d-block p-mx-auto">
                <Card style={{ padding: "1rem" }}>
                    <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows p-datatable-sm" resizableColumns columnResizeMode="expand"
                    value={sessions} lazy first={first} sortField={sortField} sortOrder={sortOrder} onPage={onPage} loading={loading} 
                    dataKey="id" paginator rows={rows} rowsPerPageOptions={[50, 100, 500, 1000]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions"
                    emptyMessage="No sessions found." totalRecords={totalRecords} header={header} onSort={onSort}>
                        {dynamicColumns}
                    </DataTable>
                </Card>
            </div>    
        )
    //#endregion    

}
export default Sessions;