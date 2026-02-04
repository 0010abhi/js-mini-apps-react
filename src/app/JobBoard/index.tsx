import { useState, useEffect } from "react";

export default function JobBoard() {
  const [jobs, setJobs] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loadMore, setLoadMore] = useState(null);

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
        console.err(">>> job fetch catch err", err);
      });
  }, []);

  async function getJobDetails() {
    console.log(">>> job Details");
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
      const res = [];
      jobDetailsResponse1.map(async (jobDetailsRes) => {
        const res1 = await jobDetailsRes;
        res.push(res1);
      });
      // .then((sucRes) => {
      //   console.log("sucRes detauil", sucRes);
      //   return sucRes;
      // });
      setJobDetails(res);
      setOffset(tempOffset);
      console.log("jobDetailsResponse1", res);
    } catch (err) {
      console.err(">>> jobDetailsPromise fetch catch err", err);
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
      {jobDetails?.map((jobDetail) => {
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
