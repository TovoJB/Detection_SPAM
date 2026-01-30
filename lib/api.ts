import axios from "axios";
import { AnalysisResult } from "@/components/chat/analysis-dashboard";

// Use relative path because Next.js Rewrites (proxy) will handle redirection to backend
const API_URL = "/api";

export const api = {
    analyzeMessage: async (text: string): Promise<AnalysisResult> => {
        try {
            const response = await axios.post(`${API_URL}/predict`, { text });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            // Fallback/Mock just in case API is down so UI doesn't break
            return {
                prediction: "HAM",
                confidence: 0.0, // Indicates error/fallback
                details: {
                    tokens: ["Error", "connecting", "to", "backend"],
                    vector: []
                }
            };
        }
    }
};
