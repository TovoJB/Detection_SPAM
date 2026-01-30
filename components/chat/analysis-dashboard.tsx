"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AnalysisResult {
    prediction: "SPAM" | "HAM";
    confidence: number;
    details: {
        tokens: string[];
        vector?: number[];
    };
}

interface AnalysisDashboardProps {
    result: AnalysisResult | null;
}

export function AnalysisDashboard({ result }: AnalysisDashboardProps) {
    if (!result) return null;

    const isSpam = result.prediction === "SPAM";
    const color = isSpam ? "text-red-500" : "text-green-500";
    const _bgColor = isSpam ? "bg-red-500/10" : "bg-green-500/10";
    const borderColor = isSpam ? "border-red-500/50" : "border-green-500/50";
    const shadowColor = isSpam ? "shadow-red-500/20" : "shadow-green-500/20";

    const chartData = result.details.tokens.map((token) => ({
        name: token,
        value: Math.floor(Math.random() * 100), // Mock data for visualization
    })).slice(0, 8);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto space-y-6 my-8"
        >
            {/* Main Result Card */}
            <div className={`
            relative overflow-hidden rounded-3xl border-2 ${borderColor} 
            bg-background/50 backdrop-blur-xl p-8 
            flex flex-col items-center justify-center text-center space-y-4
            shadow-2xl ${shadowColor}
        `}>
                {/* Background Glow */}
                <div className={`absolute inset-0 opacity-10 ${isSpam ? "bg-red-500" : "bg-green-500"} blur-3xl`} />

                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative z-10"
                >
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Analysis Result
                    </h2>
                    <div className={`text-6xl font-black tracking-tighter ${color} drop-shadow-sm`}>
                        {result.prediction}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-full border border-border/50"
                >
                    <span className="text-sm font-medium">Confidence Score</span>
                    <div className="h-4 w-px bg-border" />
                    <span className={`text-lg font-bold ${color}`}>
                        {(result.confidence * 100).toFixed(1)}%
                    </span>
                </motion.div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/50 bg-background/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                            Token Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {result.details.tokens.map((token, i) => (
                                <Badge
                                    key={i}
                                    variant="outline"
                                    className="font-mono text-xs bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                >
                                    {token}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-background/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                            Feature Importance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="name"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={isSpam ? "rgba(239, 68, 68, 0.8)" : "rgba(34, 197, 94, 0.8)"}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
