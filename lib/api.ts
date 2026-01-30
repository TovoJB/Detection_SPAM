import axios from "axios";
import { AnalysisResult } from "@/components/chat/analysis-dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
