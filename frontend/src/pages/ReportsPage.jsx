import {
  FileText,
  Download,
  Sparkles,
} from "lucide-react";

import { jsPDF } from "jspdf";


function ReportsPage({ feedback }) {
  const total = feedback.length;

  const positive = feedback.filter(
    (item) => item.sentiment === "Positive"
  ).length;

  const negative = feedback.filter(
    (item) => item.sentiment === "Negative"
  ).length;

  const neutral = feedback.filter(
    (item) => item.sentiment === "Neutral"
  ).length;


  const positivePercent =
    total > 0
      ? Math.round((positive / total) * 100)
      : 0;

  const negativePercent =
    total > 0
      ? Math.round((negative / total) * 100)
      : 0;

  const neutralPercent =
    total > 0
      ? Math.round((neutral / total) * 100)
      : 0;


  // -------------------------
  // THEME ANALYSIS
  // -------------------------

  const themeCounts = feedback.reduce(
    (acc, item) => {
      const theme = item.theme || "General";

      acc[theme] = (acc[theme] || 0) + 1;

      return acc;
    },
    {}
  );


  const sortedThemes = Object.entries(
    themeCounts
  ).sort((a, b) => b[1] - a[1]);


  const topTheme =
    sortedThemes.length > 0
      ? sortedThemes[0][0]
      : "No data";


  // -------------------------
  // NEGATIVE ISSUES
  // -------------------------

  const negativeFeedback = feedback
    .filter(
      (item) =>
        item.sentiment === "Negative"
    )
    .slice(0, 5);


  // -------------------------
  // EXECUTIVE INSIGHT
  // -------------------------

  const executiveInsight =
    total > 0
      ? `LOOP analyzed ${total} customer feedback records. The most discussed customer theme is ${topTheme}. ${negative} feedback records currently require attention.`
      : "There is currently not enough customer feedback to generate an executive insight.";


  const recommendedAction =
    negative > 0
      ? `Review recurring negative feedback, especially issues related to ${topTheme}, and prioritize the most frequently reported customer problems.`
      : "Continue monitoring customer feedback and maintain current service quality.";


  // -------------------------
  // PDF DOWNLOAD
  // -------------------------

  const downloadReport = () => {
    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const leftMargin = 20;

    let y = 20;


    const checkPage = (space = 20) => {
      if (y + space > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };


    const addWrappedText = (
      text,
      x,
      maxWidth,
      fontSize = 11
    ) => {
      doc.setFontSize(fontSize);

      const lines =
        doc.splitTextToSize(
          text,
          maxWidth
        );

      checkPage(lines.length * 6);

      doc.text(lines, x, y);

      y += lines.length * 6;
    };


    // HEADER

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(22);

    doc.text(
      "PROJECT LOOP",
      leftMargin,
      y
    );

    y += 9;


    doc.setFontSize(16);

    doc.text(
      "Voice of Customer Report",
      leftMargin,
      y
    );

    y += 8;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      leftMargin,
      y
    );

    y += 6;


    doc.text(
      "AI-powered Customer Feedback Intelligence",
      leftMargin,
      y
    );

    y += 8;


    doc.line(
      leftMargin,
      y,
      pageWidth - leftMargin,
      y
    );

    y += 12;


    // EXECUTIVE SUMMARY

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Executive Summary",
      leftMargin,
      y
    );

    y += 8;


    doc.setFont(
      "helvetica",
      "normal"
    );

    addWrappedText(
      executiveInsight,
      leftMargin,
      pageWidth - 40
    );

    y += 8;


    // FEEDBACK OVERVIEW

    checkPage(45);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Feedback Overview",
      leftMargin,
      y
    );

    y += 9;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      `Total Feedback: ${total}`,
      leftMargin,
      y
    );

    y += 7;


    doc.text(
      `Positive: ${positive} (${positivePercent}%)`,
      leftMargin,
      y
    );

    y += 7;


    doc.text(
      `Neutral: ${neutral} (${neutralPercent}%)`,
      leftMargin,
      y
    );

    y += 7;


    doc.text(
      `Negative: ${negative} (${negativePercent}%)`,
      leftMargin,
      y
    );

    y += 12;


    // TOP CUSTOMER THEME

    checkPage(30);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Top Customer Theme",
      leftMargin,
      y
    );

    y += 8;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      topTheme,
      leftMargin,
      y
    );

    y += 12;


    // THEME BREAKDOWN

    checkPage(30);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Theme Breakdown",
      leftMargin,
      y
    );

    y += 9;


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);


    if (sortedThemes.length > 0) {
      sortedThemes.forEach(
        ([theme, count]) => {
          checkPage(10);

          doc.text(
            `${theme}: ${count} feedback record${
              count === 1 ? "" : "s"
            }`,
            leftMargin,
            y
          );

          y += 7;
        }
      );
    } else {
      doc.text(
        "No themes available.",
        leftMargin,
        y
      );

      y += 7;
    }


    y += 7;


    // KEY CUSTOMER ISSUES

    checkPage(30);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Key Customer Issues",
      leftMargin,
      y
    );

    y += 9;


    doc.setFont(
      "helvetica",
      "normal"
    );


    if (negativeFeedback.length > 0) {
      negativeFeedback.forEach(
        (item, index) => {
          checkPage(25);

          addWrappedText(
            `${index + 1}. ${
              item.content
            }`,
            leftMargin,
            pageWidth - 40,
            10
          );

          y += 3;
        }
      );
    } else {
      doc.setFontSize(11);

      doc.text(
        "No negative feedback detected.",
        leftMargin,
        y
      );

      y += 7;
    }


    y += 8;


    // RECOMMENDED ACTION

    checkPage(35);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(14);

    doc.text(
      "Recommended Action",
      leftMargin,
      y
    );

    y += 9;


    doc.setFont(
      "helvetica",
      "normal"
    );

    addWrappedText(
      recommendedAction,
      leftMargin,
      pageWidth - 40
    );


    // FOOTER

    const numberOfPages =
      doc.internal.getNumberOfPages();


    for (
      let page = 1;
      page <= numberOfPages;
      page++
    ) {
      doc.setPage(page);

      doc.setFontSize(9);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Project LOOP | Voice of Customer Intelligence | Page ${page} of ${numberOfPages}`,
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );
    }


    doc.save(
      "LOOP-Voice-of-Customer-Report.pdf"
    );
  };


  return (
    <section className="reports-page">
      <div className="reports-header">
        <div>
          <p className="eyebrow">
            VOICE OF CUSTOMER
          </p>

          <h1>Reports</h1>

          <p className="subtitle">
            Generate executive customer
            intelligence reports.
          </p>
        </div>


        <button
          className="primary-btn"
          onClick={downloadReport}
          disabled={total === 0}
        >
          <Download size={18} />

          Download PDF
        </button>
      </div>


      <div className="report-preview">
        <div className="report-title">
          <div className="report-icon">
            <FileText size={24} />
          </div>

          <div>
            <h2>
              Voice of Customer Report
            </h2>

            <p>
              Generated automatically by
              Project LOOP
            </p>
          </div>
        </div>


        <div className="report-metrics">
          <div>
            <span>Total Feedback</span>
            <strong>{total}</strong>
          </div>

          <div>
            <span>Positive</span>
            <strong>
              {positivePercent}%
            </strong>
          </div>

          <div>
            <span>Neutral</span>
            <strong>
              {neutralPercent}%
            </strong>
          </div>

          <div>
            <span>Negative</span>
            <strong>
              {negativePercent}%
            </strong>
          </div>
        </div>


        <div className="report-section">
          <h3>Top Customer Theme</h3>

          <p>{topTheme}</p>
        </div>


        <div className="report-section">
          <h3>Top Themes</h3>

          {sortedThemes.length > 0 ? (
            sortedThemes.map(
              ([theme, count]) => (
                <div
                  className="report-theme"
                  key={theme}
                >
                  <span>{theme}</span>

                  <strong>{count}</strong>
                </div>
              )
            )
          ) : (
            <p>No themes available.</p>
          )}
        </div>


        <div className="report-section insight-section">
          <div className="ai-badge">
            <Sparkles size={16} />

            AI Executive Insight
          </div>

          <p>{executiveInsight}</p>
        </div>


        <div className="report-section">
          <h3>Recommended Action</h3>

          <p>{recommendedAction}</p>
        </div>
      </div>
    </section>
  );
}


export default ReportsPage;