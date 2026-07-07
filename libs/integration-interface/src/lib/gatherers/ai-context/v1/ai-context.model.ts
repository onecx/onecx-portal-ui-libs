export interface AiContextRequest {
    agent: {
        name: string;
    }
}

export interface AiContextResponse {
    productName: string;
    appId: string;
    appPath: string;
    context: string;
}