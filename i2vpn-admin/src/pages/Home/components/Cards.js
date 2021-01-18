import React, {useState,useEffect} from 'react'
import { Card } from 'primereact/card';
import chart from "../../../assets/images/card.png";
import API from "../../../shared/api"
import "./Cards.css"
const Cards = () => {

    //#region variables 
        const [serversConnectionsCount, setserversConnectionsCount] = useState([]);
        const [todaySessions, setTodaySessions] = useState(null);
        const [onlineNow, setOnlineNow] = useState(null);
    //#endregion
    
    //#region useEffect
        useEffect(() => {       
            API.getTodaySessions().then(data => setTodaySessions(data))
            API.getOnlineNow().then(data => setOnlineNow(data))
            API.getServersConnection().then(data => {
                let sum =0;
                data.map(element => {
                    if(element.is_active === 1)sum = sum + element.connections_count
                }); setserversConnectionsCount(sum) })                
            const Interval = setInterval(() => {
                API.getTodaySessions().then(data => setTodaySessions(data))
                API.getOnlineNow().then(data => setOnlineNow(data))
                API.getServersConnection().then(data => {
                let sum =0;
                data.map(element => {
                    if(element.is_active === 1)sum = sum + element.connections_count
                }); setserversConnectionsCount(sum) })
            } , 5000)
            return () => {clearInterval(Interval);}
    }, []); 
    //#endregion

    //#region content cards
        const content=[
            { title: "Online now", value: onlineNow },
            { title: "Servers connections", value: serversConnectionsCount },
            { title: "Today sessions", value: todaySessions },
        ]
        let cards = content.map((card) => {
            return (
                <div className="p-field p-col-4" key={card.title}>
                    <Card title={card.title}>
                        <div className="p-grid">
                            <div className="p-col"><h1>{card.value}</h1></div>
                            <div className="p-col"><img className="img-card" src={chart}alt="chart"/></div>
                        </div>  
                    </Card> 
                </div>
            )});
    //#endregion

    //#region cards
       return ( cards )
    //#endregion

}
export default Cards;