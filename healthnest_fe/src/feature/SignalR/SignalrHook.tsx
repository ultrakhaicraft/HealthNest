import { useEffect } from "react";
import { getSignalRConnection, startSignalRConnection } from "./SignalRConnection";


export const useSignalREvent = <T=any> (eventName: string, handler: (data: T) => void) => {
    useEffect(() => {
        const connection = getSignalRConnection();

        startSignalRConnection();

        connection.on(eventName, handler);

        return()=>{
            connection.off(eventName, handler);
        };
        
    }, [eventName, handler]);
}