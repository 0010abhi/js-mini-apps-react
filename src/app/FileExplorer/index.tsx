import React, { useState } from 'react';
import data from './data';
import type { FileNode as FileNodeType } from './data';

interface FileNodeProps {
    node: FileNodeType;
    level?: number;
}

function FileNode({ node, level = 0 }: FileNodeProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = Array.isArray(node.children);

    return (
        <div className="select-none">
            <div
                className={`pl-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    hasChildren ? 'cursor-pointer' : 'cursor-default'
                }`}
                style={{ marginLeft: `${level * 16}px` }}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                <span className="mr-2">
                    {hasChildren ? (isOpen ? '📂' : '📁') : '📄'}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                    {node.name}
                </span>
            </div>

            {hasChildren && isOpen && (
                <div className="border-l-2 border-gray-300 dark:border-gray-600 ml-2">
                    {node?.children?.map((child: FileNodeType) => (
                        <FileNode key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileExplorer() {
    return (
        <div className="w-full h-full overflow-y-auto p-4">
            <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">File Explorer</h2>
            <div className="space-y-1">
                {data.map((node: FileNodeType, index: number) => (
                    <FileNode key={index} node={node} />
                ))}
            </div>
        </div>
    );
}
