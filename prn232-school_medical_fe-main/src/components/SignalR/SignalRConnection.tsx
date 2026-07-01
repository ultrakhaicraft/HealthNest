import * as signalR from "@microsoft/signalr";


let connection: signalR.HubConnection | null = null;

export const getSignalRConnection = (): signalR.HubConnection => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7085/myHub',{
            accessTokenFactory: () => {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('authToken');
                return token ? token : '';
            }
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
    }

    return connection;
};

export const startSignalRConnection = async () : Promise<void> => {
    const connection = getSignalRConnection();
    try{
        await connection.start();
        console.log('SignalR Connected.');
    }catch(err){
        console.log('SignalR Connection Error: ', err);
        setTimeout(startSignalRConnection, 5000); // Retry connection after 5 seconds
    }
}

export const stopSignalRConnection = async () : Promise<void> => {
    if (connection) {
        try {
            if(connection && connection.state !== signalR.HubConnectionState.Disconnected) {
                await connection.stop();
            }
            console.log('SignalR Disconnected.');
        } catch (err) {
            console.log('SignalR Disconnection Error: ', err);
        }
    }
}