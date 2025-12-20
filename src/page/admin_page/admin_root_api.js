import axios from '@/config/axios_config'


export async function logout(){
    const response = await axios.post('/admin/user/logout',null,
    {
        headers:{
            "Content-Type":'application/json'
        }
    });
    return response;
}

export async function postAnno(UpdateAnnoDTO) {
    const response = await axios.post('/admin/user/anno', UpdateAnnoDTO, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;

}

export async function getMessageCount(){
    const response = await axios.get('/admin/message/newCount');
    return response;
}

export async function getAllMessages(){
    const response = await axios.get('/admin/message');
    return response;
}

export async function getNewMessages(){
    const response = await axios.get('/admin/message/new');
    return response;
}

export async function updateMessageStatus(id, status) {
    const response = await axios.put('/admin/message', null, {
        params: {
            id: id,
            status: status
        }
    });
    return response;
}