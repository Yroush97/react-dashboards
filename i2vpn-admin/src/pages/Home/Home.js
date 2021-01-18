import React from 'react'
import Cards from "./components/Cards";
import TopServersTable from "./components/TopServersTable"
import DeadServersTable from "./components/DeadServersTable"

const Home = () => {        
    //#region cards & tables
      return (  
        <>     
          <div className="p-field p-p-4 p-mx-auto" style={{maxWidth:"1200px"}}>            
              <div className="p-formgrid p-grid">
                <Cards />
              </div>
          </div>
          <div className="p-field p-mb-lg-2 p-p-4 p-mx-auto" style={{maxWidth:"1200px"}}>     
                  <div className="p-formgrid p-grid">
                      <div className="datatable-responsive-demo p-field">
                          <TopServersTable />
                      </div>  
                      <div className="datatable-responsive-demo p-field p-ml-2">
                        <DeadServersTable />
                      </div>
                  </div>
          </div>
        </>        
         
      )
    //#endregion
}
export default Home
