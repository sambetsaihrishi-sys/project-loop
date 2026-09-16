import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function AnalyticsPage({ feedback }) {
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

  const sentimentData = [
    { name: "Positive", value: positive },
    { name: "Neutral", value: neutral },
    { name: "Negative", value: negative },
  ];

  const themeCounts = feedback.reduce((acc, item) => {
    const theme = item.theme || "General";
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});

  const themeData = Object.entries(themeCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <section className="analytics-page">
      <div className="analytics-header">
        <div>
          <p className="eyebrow">CUSTOMER INTELLIGENCE</p>
          <h1>Analytics</h1>
          <p className="subtitle">
            Understand sentiment and recurring customer themes.
          </p>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="panel analytics-stat">
          <span>Total Feedback</span>
          <strong>{total}</strong>
        </div>

        <div className="panel analytics-stat">
          <span>Positive</span>
          <strong>{positive}</strong>
        </div>

        <div className="panel analytics-stat">
          <span>Neutral</span>
          <strong>{neutral}</strong>
        </div>

        <div className="panel analytics-stat">
          <span>Negative</span>
          <strong>{negative}</strong>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="panel analytics-chart">
          <h2>Sentiment Distribution</h2>
          <p>Overall customer sentiment</p>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel analytics-chart">
          <h2>Top Themes</h2>
          <p>Most common customer topics</p>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={themeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPage;