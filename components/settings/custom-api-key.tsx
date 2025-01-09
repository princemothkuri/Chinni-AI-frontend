"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Info, Eye, EyeOff } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export function CustomApiKey() {
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const { toast } = useToast();

    const { authToken, isLoggedIn } = useSelector(
        (state: RootState) => state.chinniMain
    );

    const handleSave = async () => {
        const trimmedApiKey = apiKey.trim();

        if (!trimmedApiKey.startsWith("sk-")) {
            toast({
                title: "Invalid API Key",
                description: "API key must start with 'sk-'",
                variant: "destructive",
            });
            return;
        }

        if (/\s/.test(trimmedApiKey)) {
            toast({
                title: "Invalid API Key",
                description: "API key must not contain spaces",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/set-api-key`, { OpenAI_Api_Key: trimmedApiKey },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            if (response.status === 200) {
                setShowApiKey(false);
                toast({
                    title: "Success",
                    description: "API key saved successfully"
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to save API key",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save API key",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchApiKey = async () => {
        if (!isLoggedIn) return;
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/get-api-key`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.status === 200) {
                setApiKey(response.data.api_key);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch API key",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchApiKey();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-2">
                <Label htmlFor="api-key" className="text-lg font-medium">
                    OpenAI API Key
                </Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            className="max-w-sm bg-card/50 backdrop-blur-sm border-2"
                        >
                            <p>
                                To get your API key, visit the{" "}
                                <a
                                    href="https://platform.openai.com/account/api-keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    OpenAI API key documentation
                                </a>.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="relative">
                <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key here..."
                    className="min-h-[40px] w-full pl-3 pr-12 py-2 border-2 focus:ring-2 focus:ring-primary/50"
                />
                <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                    {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>

            <Button
                onClick={handleSave}
                className="w-full relative group overflow-hidden"
                disabled={loading}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 group-hover:opacity-100 opacity-0 transition-opacity"
                    animate={{
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                />
                <span className="relative">Save Changes</span>
            </Button>
        </motion.div>
    );
}