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
        <div style={{ padding: "2rem" }}>
            <h1>Job Board</h1>

            {jobDetails.map((job) => (
                <div key={job.id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    <div>{job.title}</div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        By {job.by} • {new Date(job.time * 1000).toLocaleDateString()}
                    </div>
                    {job.url && (
                        <div>
                            <a href={job.url} target="_blank" rel="noreferrer">Link</a>
                        </div>
                    )}
                </div>
            ))}

            {loading && <p>Loading...</p>}

            {!loading && jobDetails.length < allIds.length && (
                <button onClick={() => fetchJobs(allIds, jobDetails.length)}>
                    Load More
                </button>
            )}
        </div>
    );
}