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
        <div style={{ marginLeft: level * 16 }}>
            <div
                style={{ cursor: hasChildren ? "pointer" : "default" }}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {hasChildren ? (isOpen ? "📂" : "📁") : "📄"} {node.name}
            </div>


            {hasChildren && isOpen && (
                <div>
                    {node?.children?.map((child: FileNodeType) => (
                        <FileNode key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileExplorer() {
    return <>
        {
            data.map((node: FileNodeType, index: number) =>
                <FileNode key={index} node={node} />
            )
        }
    </>
}
