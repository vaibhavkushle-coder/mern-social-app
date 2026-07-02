import { useState, useEffect } from "react";
import axios from "axios";

function Chat(){
     
    const [conversations, setConversations] = useState([]);

    useEffect(()=>{
        getConversations();
    },[]);

    async function getconversations(){
        try{

        }catch(error){
            console.error(error);
        }
    }

    return(
        <div>h</div>
    )
}
export default Chat;