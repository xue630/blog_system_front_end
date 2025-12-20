import axios from "@/config/axios_config";

export async function getAnnouncement(){
    const response = await axios.get('common/anno');
    return response;
}

export async function postMessage(data) {
    const response = await axios.post('/tourist/message/send',data, {
        headers:{
            "Content-Type":'application/json'
        }
    }
    )
    return response;
}
