import { ElMessage, ElNotification} from "element-plus";

// 消息框
export function message(type,msg){
    ElMessage({
        type:type,//success，error，info，warning
        message:msg,
        showClose:true,
        duration:3000,
    })
}

export function notifyMessage(type,msg){
    ElNotification({
        type:type,//success，error，info，warning
        message:msg,
        title:'留言消息',
        duration:3000,
        position:'top-right'
    })
}