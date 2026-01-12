import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 6;

// Define the JobDetail interface based on the provided JSON
interface JobDetail {
    by: string;
    id: number;
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
}

export default function JobBoard() {
    const [jobIds, setJobIds] = useState<number[]>([]);
    const [jobDetails, setJobDetails] = useState<JobDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    // 1. Fetch the initial list of Job IDs
    useEffect(() => {
        fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
            .then((res) => res.json())
            .then((ids) => setJobIds(ids))
            .catch((err) => console.error("Initial fetch error:", err));
    }, []);

    // 2. Fetch details for a slice of IDs
    async function fetchJobs(idsToFetch: number[]) {
        setLoading(true);
        try {
            const promises = idsToFetch.map((id) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json() as Promise<JobDetail>)
            );

            const newJobs = await Promise.all(promises);

            // Append new jobs to the previous list
            setJobDetails((prev) => [...prev, ...newJobs]);
            setOffset((prev) => prev + ITEMS_PER_PAGE);
        } catch (err) {
            console.error("Error fetching job details:", err);
        } finally {
            setLoading(false);
        }
    }

    // 3. Trigger initial load once IDs are available
    useEffect(() => {
        if (jobIds.length > 0 && jobDetails.length === 0) {
            const firstBatch = jobIds.slice(0, ITEMS_PER_PAGE);
            fetchJobs(firstBatch);
        }
    }, [jobIds]);

    const handleLoadMore = () => {
        const nextBatch = jobIds.slice(offset, offset + ITEMS_PER_PAGE);
        fetchJobs(nextBatch);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Hacker News Job Board</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {jobDetails.map((job, index) => (
                    <div key={index} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
                        <h3 style={{ margin: "0 0 5px 0" }}>
                            <a href={job.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#111' }}>
                                {job.title}
                            </a>
                        </h3>
                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                            By {job.by} • {new Date(job.time * 1000).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {loading && <p>Loading jobs...</p>}

            {jobIds.length > offset && !loading && (
                <button
                    onClick={handleLoadMore}
                    style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
                >
                    Load More Jobs
                </button>
            )}
        </div>
    );
}