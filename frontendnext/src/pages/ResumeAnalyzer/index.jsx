import { client } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import axios from "axios";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from './styles.module.css'

function ResumeAnalyzer() {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await client.post(
        "/api/resume/analyze",
        formData
      );

      setFeedback(res.data.feedback);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

 return (
  <UserLayout>
    <DashboardLayout>

      <div className={styles.container}>
        <div className={styles.card}>
          
          <h2 className={styles.title}>AI Resume Analyzer</h2>

          <label className={styles.uploadBox}>
            Upload Resume (PDF)
            <input type="file" onChange={handleUpload} />
          </label>

          {loading && (
            <p className={styles.loading}>Analyzing your resume...</p>
          )}

          {feedback && (
            <div className={styles.feedbackCard}>
              <h3 className={styles.feedbackTitle}>AI Resume Analysis</h3>
              <div className={styles.markdown}>
                <ReactMarkdown>
                  {feedback}
                </ReactMarkdown>
              </div>

            </div>
          )}

        </div>
      </div>

    </DashboardLayout>
  </UserLayout>
);

}

export default ResumeAnalyzer;
