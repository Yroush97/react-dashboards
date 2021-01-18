import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import axios from "../../axios";

const Feedbacks = () => {

    //#region variables
        const [feedbacks, setFeedbacks] = useState([]);    
        const [loading, setLoading] = useState(false);
        const [first, setFirst] = useState(0);
        const [totalRecords, setTotalRecords] = useState(0);
        const [sortOrder, setSortOrder] = useState(-1);
        const [sortField, setSortField] = useState(null);
        const token = localStorage.getItem('token');
        const [rows, setRows] = useState(50);
        const [page, setPage] = useState(1);
        const input = useRef(null);
        const dt = useRef(null);
    //#endregion
   
    //#region useEffect
        useEffect(() => {
            setLoading(true);
            axios
            .get(`api/dashboard/feedback/all?page=${page}&records_number=${rows}`, {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log(response)
                setTotalRecords(response.data.total);
                setFeedbacks(response.data.data)   
                setLoading(false);   
            })
            .catch((error) => {
                console.log(error)
            });

        }, [page,rows]);
    //#endregion

    // #region lazy loading
        const onPage = (event) => {
            setLoading(true);
            setTimeout(() => {
                const { first: _first, rows } = event;
                setFirst(_first);
                setPage(event.page + 1);
                setRows(event.rows)
                setLoading(false);
            }, 500);
        }
        const onFilter = (event)=> {
            if(event.target.value !== "")
            {
                axios
                .get(
                `api/dashboard/feedback/all?page=${page}&records_number=${rows}&${event.target.name}=${event.target.value}`,
                { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => 
                {
                    setFeedbacks(response.data.data)
                })
            }
            else{
                axios
                .get(
                `api/dashboard/feedback/all?page=${page}&records_number=${rows}`,
                { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => 
                {
                    setFeedbacks(response.data.data)
                })
            }
        }    
        let modelFilter = (val,placeholder) => {
            return (
            <input className="p-inputtext p-component p-column-filter"
                    name={val} placeholder={placeholder} onChange={onFilter} />
            );
        };
        const onSort = (event) => {
            
            setSortOrder(event.sortOrder);
            setSortField(event.sortField);
        
            if (event.sortOrder === 1) {          
            let reverse = feedbacks.sort((a, b) => {
                if (a[event.sortField] == null) return 1;
                if (b[event.sortField] == null) return -1;
        
                if (a[event.sortField] < b[event.sortField]) return -1;
                if (a[event.sortField] > b[event.sortField]) return 1;
            });
            setFeedbacks(reverse);
            } 
            else if (event.sortOrder === -1) {
            
            let normal = feedbacks.sort((a, b) => {
                if (a[event.sortField] == null) return 1;
                if (b[event.sortField] == null) return -1;
        
                if (a[event.sortField] < b[event.sortField]) return 1;
                if (a[event.sortField] > b[event.sortField]) return -1;
            });
            setFeedbacks(normal);
            }       
        }
   // #endregion 
   
    // #region columns
        let cols = [
            {field: 'id', header: 'Id'},
            {field: 'email', header: 'Email'},
            {field: 'name', header: 'Name'},
            {field: 'content', header: 'Content'}
        ];

        let dynamicColumns = cols.map((col, i) => {
            input.current = col.field;
            return <Column ref={input} key={i} className='colume' style={{ wordWrap: "break-word" }}
                    field={col.field} header={col.header} sortable filter filterMatchMode="contains"
                    filterElement={modelFilter(col.field , `Search by ${col.header.toLowerCase()}`)} />;
        });
    //#endregion

    // #region datatable header
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Feedbacks</h5>           
            </div>
        );
    //#endregion

    //#region datatable
        return (
            <div className="datatable-responsive-demo p-p-4 p-d-block p-mx-auto">          
                <Card style={{padding:"1rem"}}>
                    <DataTable className="p-datatable-responsive-demo p-datatable-hoverable-rows" ref={dt} dataKey="id" header={header}
                        paginator rows={50} value={feedbacks} totalRecords={totalRecords} loading={loading} onSort={onSort} sortOrder={sortOrder}
                        sortField={sortField}  onPage={onPage} emptyMessage="no feedbacks found" rowsPerPageOptions={[50, 100, 500, 1000]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} feedbacks" >
                        {dynamicColumns}
                    </DataTable>
                </Card>           
            </div>
        );
    //#endregion

}
export default Feedbacks;