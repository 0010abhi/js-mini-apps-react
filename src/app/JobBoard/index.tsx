import { useState, useEffect } from "react";

export default function JobBoard() {
  const [jobs, setJobs] = useState<number[] | null>(null);
  const [jobDetails, setJobDetails] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
      .then((res) => res.json())
      .then(
        (sucRes) => {
          console.log(">> sucRes", sucRes);
          setJobs(sucRes);
        },
        (errRes) => {
          console.log(">> errRes", errRes);
        },
      )
      .catch((err) => {
        console.error(">>> job fetch catch err", err);
      });
  }, []);

  async function getJobDetails() {
    console.log(">>> job Details");
    if (!jobs || jobs.length === 0) return;
    
    let promisAllArr = [];
    let tempOffset = offset + 6 < jobs.length ? offset + 6 : jobs.length;
    try {
      for (let i = offset; i < tempOffset; i++) {
        promisAllArr.push(
          fetch(
            "https://hacker-news.firebaseio.com/v0/item/" + jobs[i] + ".json",
          ),
        );
      }

      const jobDetailsResponse = await Promise.all(promisAllArr);
      console.log("jobDetailsResponse", jobDetailsResponse);
      const jobDetailsResponse1 = jobDetailsResponse.map((response) =>
        response.json(),
      );
      const res: any[] = [];
      jobDetailsResponse1.map(async (jobDetailsRes) => {
        const res1 = await jobDetailsRes;
        res.push(res1);
      });
      setJobDetails(res);
      setOffset(tempOffset);
      console.log("jobDetailsResponse1", res);
    } catch (err) {
      console.error(">>> jobDetailsPromise fetch catch err", err);
    }
  }

  useEffect(() => {
    console.log(">>> jobs", jobs);
    if (jobs && jobs.length > 0) {
      getJobDetails();
    }
  }, [jobs]);

  return (
    <div>
      {jobDetails && jobDetails.map((jobDetail: any) => {
        return (
          <>
            <div>{jobDetail.title}</div>
            <div>By{jobDetail.by}</div>
          </>
        );
      })}
    </div>
  );
}
