import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

// HOC to handle code rendering
const withCodeHandling = (WrappedComponent: React.ComponentType<any>) => {

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            toast({
                title: "Success",
                description: "Code copied to clipboard!",
            });
        });
    };
    return (props: any) => {
        const renderCode: React.FC<{ inline: boolean; className?: string; children: React.ReactNode }> = ({
            inline,
            className,
            children,
            ...props
        }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";
            const codeContent = String(children).replace(/\n$/, "");

            if (!inline && match) {
                return (
                    <div className="relative bg-gray-900 text-white rounded-lg my-4">
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded-t-lg">
                            <span className="font-semibold">{language}</span>
                            <button
                                onClick={() => handleCopy(codeContent)}
                                className="text-sm bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                            >
                                Copy Code
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={materialDark}
                            language={language}
                            PreTag="div"
                            {...props}
                        >
                            {codeContent}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            return (
                <code
                    className={`bg-primary text-primary-foreground text-sm px-1 py-0.5 rounded ${inline ? "inline-block" : ""}`}
                    {...props}
                >
                    {children}
                </code>
            );
        };

        return <WrappedComponent {...props} renderCode={renderCode} />;
    };
};


interface MarkdownRendererProps {
    content: string;
    renderCode: (props: {
        inline: boolean;
        className?: string;
        children: React.ReactNode;
    }) => React.ReactNode;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    renderCode,
}) => {
    return (
        <div className="prose prose-lg max-w-full">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ node, ...props }) => (
                        <>
                            <p className="text-base" {...props} />
                            <br />
                        </>
                    ),
                    h3: ({ node, ...props }) => (
                        <>
                            <br />
                            <h3 className="text-2xl font-bold" {...props} />
                            <hr className="border-t-2 border-gray-300 my-2" />
                        </>
                    ),
                    a: ({ node, ...props }) => {
                        const href = props.href || "";
                        if (href.startsWith("/") || href.startsWith("#")) {
                            return (
                                <Link href={href} className="text-blue-600 hover:underline">
                                    {props.children}
                                </Link>
                            );
                        }
                        return (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {props.children}
                            </a>
                        );
                    },
                    code: ({ inline, className, children, ...props }: any) => <>{renderCode({ inline, className, children, ...props })}</>, // Use the renderCode function passed from the HOC
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 my-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 my-4" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong className="font-bold" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <>
                            <br />
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200" {...props} />
                            </div>
                            <br />
                        </>
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-6 py-3 bg-gray-600 text-left text-xs font-medium text-gray-200 uppercase tracking-wider border border-gray-300" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default withCodeHandling(MarkdownRenderer);
