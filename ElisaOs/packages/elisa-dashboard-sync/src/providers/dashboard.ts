import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

const DASHBOARD_CONFIG = {
    apiUrl: "http://localhost:3000/eliza/4567e123-e89b-12d3-a456-426614174000",
    apiToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImV4ZW1wbGVVc2VyIiwiaWF0IjoxNzM5NjEzOTUxLCJleHAiOjE3Mzk2MTc1NTF9.fdFdHM7Eiy0E5CdKVwiqw-YFS7foE_Sk04nn2W4beMo"
};

export const dashboardProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        return JSON.stringify(DASHBOARD_CONFIG);
    }
};

export default dashboardProvider; 