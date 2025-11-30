import axios from "@/config/axios_config";

export async function getAnnouncement(){
    const response = await axios.get('common/anno');
    return response;
}
