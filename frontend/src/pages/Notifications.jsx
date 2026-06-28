import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getNotifications();
    }, []);

    async function getNotifications() {
        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/notifications",
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setNotifications(response.data);

        } catch (error) {
            console.log("NOTIFICATION ERROR =>", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5">

            <h1 className="text-2xl font-bold text-center mb-5">
                🔔 Notifications
            </h1>

            {notifications.length === 0 ? (

                <div className="text-center text-gray-500">
                    No notifications yet.
                </div>

            ) : (

                notifications.map((item) => (

                    <div
                        key={item._id}
                        className="bg-white p-4 rounded-xl shadow mb-3 max-w-xl mx-auto"
                    >
                        <div className="flex items-center gap-3">

                            <img
                                src={item.sender?.profilePic}
                                alt="profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <div>
                                <p className="font-semibold">
                                    {item.sender?.name}
                                </p>

                                <p className="text-gray-600">
                                    {item.type === "follow" && "started following you 👥"}
                                    {item.type === "like" && "liked your post ❤️"}
                                    {item.type === "comment" && "commented on your post 💬"}
                                </p>
                            </div>

                        </div>
                    </div>

                ))

            )}

        </div>
    );
}

export default Notifications;