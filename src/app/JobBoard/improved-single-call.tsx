import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 6;

// Define the JobDetail interface
interface JobDetail {
    by: string;
    id: number;
    score: number;
    time: number;
    title: string;
    type: string;
    url?: string;
}

export default function JobBoard() {
    const [allIds, setAllIds] = useState<number[]>([]);
    const [jobDetails, setJobDetails] = useState<JobDetail[]>([]);
    const [loading, setLoading] = useState(false);

    // Centralized Fetcher
    const fetchJobs = async (ids: number[], currentOffset: number) => {
        if (ids.length === 0) return;

        setLoading(true);
        const slice = ids.slice(currentOffset, currentOffset + ITEMS_PER_PAGE);

        try {
            const promises = slice.map(id =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
            );
            const newJobs: JobDetail[] = await Promise.all(promises);

            setJobDetails(prev => [...prev, ...newJobs]);
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    // The ONLY useEffect
    useEffect(() => {
        const startApp = async () => {
            const res = await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json");
            const ids: number[] = await res.json();
            setAllIds(ids);

            fetchJobs(ids, 0);
        };

        startApp();
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Job Board</h1>

            <div className="flex-1 overflow-y-auto space-y-4">
                {jobDetails.map((job) => (
                    <div 
                        key={job.id} 
                        className="p-4 border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                            {job.title}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            By <span className="font-medium">{job.by}</span> • {new Date(job.time * 1000).toLocaleDateString()}
                        </div>
                        {job.url && (
                            <a 
                                href={job.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                            >
                                View Job →
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {loading && (
                <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Loading...
                </div>
            )}

            {!loading && jobDetails.length < allIds.length && (
                <button 
                    onClick={() => fetchJobs(allIds, jobDetails.length)}
                    className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 w-full"
                >
                    Load More
                </button>
            )}

            {!loading && jobDetails.length === allIds.length && allIds.length > 0 && (
                <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                    No more jobs to load
                </div>
            )}
        </div>
    );
}