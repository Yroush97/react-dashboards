import axios from "../axios"
import Moment from 'moment';
export default {   
    getTopServersConnections: () => {
        return axios.get(`api/dashboard/servers/statics?fields=name,connections_count`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },}).then((response) => response.data)
    },
    getServersDead: () => {
        return axios.get(`api/dashboard/servers/dead`, { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`} })
                .then((response) => response.data)
    },
    getOnlineNow: () => {
        return axios.get(`api/dashboard/sessions/time-range?from=${Moment().format('YYYY')}-01-01 00:00:00&to=${Moment().format('YYYY-MM-DD HH:mm:ss')}&get_count=1&only_active=1`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => response.data)                
    },
    getServersConnection: () => {
        return axios.get("api/dashboard/servers/all", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },})
                    .then((response) => response.data)
    },
    getTodaySessions: () => {
        return axios.get(`api/dashboard/sessions/time-range?from=${Moment().format('YYYY-MM-DD')} 00:00:00&to=${Moment().add(1,'days').format('YYYY-MM-DD')} 00:00:00&get_count=1`,
               { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}}).then((response) => response.data)
    },
    
}