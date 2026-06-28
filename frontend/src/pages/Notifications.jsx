import { useEffect, useState } from "react";
import axios from "axios";

function Notifications(){
    
    const [notifications, setNotifications] = useState([]);

    useEffect(()=>{
        getNotifications();
    },[]);

    async function getNotifications(){
        try{

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/notifications",
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            setNotifications(response.data);

        }catch (error){
            console.log("NOTIFICATION ERROR =>", error);
        }
    }

    return(

        <div className="">

            <h1 className="">
               🔔 Notifications
            </h1>

            {notifications.length === 0 ? (
                <p>No notification yet😔</p>
            ) : (
                notifications.map((notification)=>(
                    <div 
                    key={notification._id}
                    className=""
                    >
                        <p>
                            <b>{notification.sender?.name}</b>{""}
                            {notification.type}your post
                        </p>
                        </div>
                ))
            )
        }
        </div>

    );
}

export default Notifications;