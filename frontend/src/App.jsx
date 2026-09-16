import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  Sparkles,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import axios from "axios";

import "./App.css";
import Login from "./pages/Login";
import FeedbackPage from "./pages/FeedbackPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AskLoopPage from "./pages/AskLoopPage";
import ReportsPage from "./pages/ReportsPage";
import TeamPage from "./pages/TeamPage";


function App() {
  const [active, setActive] = useState("Overview");
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [workspace, setWorkspace] = useState(null);

  const token = localStorage.getItem("loop_token");


  // ------------------------------------------------
  // REAL DASHBOARD CALCULATIONS
  // ------------------------------------------------

  const totalFeedback = feedback.length;

  const positiveCount = feedback.filter(
    (item) => item.sentiment === "Positive"
  ).length;

  const negativeCount = feedback.filter(
    (item) => item.sentiment === "Negative"
  ).length;

  const neutralCount = feedback.filter(
    (item) => item.sentiment === "Neutral"
  ).length;


  const positivePercent =
    totalFeedback > 0
      ? Math.round((positiveCount / totalFeedback) * 100)
      : 0;

  const negativePercent =
    totalFeedback > 0
      ? Math.round((negativeCount / totalFeedback) * 100)
      : 0;

  const neutralPercent =
    totalFeedback > 0
      ? Math.round((neutralCount / totalFeedback) * 100)
      : 0;


  // ------------------------------------------------
  // TOP THEMES
  // ------------------------------------------------

  const themeCounts = feedback.reduce((acc, item) => {
    const theme = item.theme || "General";

    acc[theme] = (acc[theme] || 0) + 1;

    return acc;
  }, {});


  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme, count]) => ({
      theme,
      count,
      percent:
        totalFeedback > 0
          ? Math.round((count / totalFeedback) * 100)
          : 0,
    }));


  // ------------------------------------------------
  // LOAD USER + FEEDBACK
  // ------------------------------------------------

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const userResponse = await axios.get(
          "http://127.0.0.1:8001/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(userResponse.data);

        const workspaceResponse = await axios.get(
  "http://127.0.0.1:8001/workspace/me",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

setWorkspace(workspaceResponse.data);


        const feedbackResponse = await axios.get(
          "http://127.0.0.1:8001/feedback/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFeedback(feedbackResponse.data);

      } catch (error) {
        console.error("Unable to load LOOP data:", error);

        localStorage.removeItem("loop_token");

        window.location.reload();
      }
    };

    loadData();

  }, [token]);


  // ------------------------------------------------
  // LOGIN
  // ------------------------------------------------

  if (!token) {
    return <Login />;
  }


  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("loop_token");

    window.location.reload();
  };


  // ------------------------------------------------
  // SIDEBAR
  // ------------------------------------------------

  const menuItems = [
    {
      name: "Overview",
      icon: LayoutDashboard,
    },
    {
      name: "Feedback",
      icon: MessageSquareText,
    },
    {
      name: "Analytics",
      icon: BarChart3,
    },
    {
      name: "Ask LOOP",
      icon: Sparkles,
    },
    {
      name: "Reports",
      icon: FileText,
    },
    {
      name: "Team",
      icon: Users,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];


  return (
    <div className="app-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            L
          </div>

          <div>
            <h2>LOOP</h2>
            <span>Feedback Intelligence</span>
          </div>

        </div>


        <nav className="nav-menu">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  active === item.name ? "active" : ""
                }`}
                onClick={() => setActive(item.name)}
              >

                <Icon size={20} />

                <span>
                  {item.name}
                </span>

              </button>
            );
          })}

        </nav>


        <div className="sidebar-footer">

          <div className="workspace-card">

            <div className="workspace-logo">
  {workspace?.name
    ? workspace.name.substring(0, 2).toUpperCase()
    : "LO"}
</div>

            <div>
              <strong>
  {workspace?.name || "Loading workspace..."}
</strong>

<span>
  {workspace?.role || "member"}
</span>
            </div>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="search-box">

            <Search size={18} />

            <input
              placeholder="Search feedback, themes, reports..."
            />

          </div>


          <div className="top-actions">

            <button className="icon-btn">
              <Bell size={20} />
            </button>


            <div className="profile">

              <div className="avatar">

                {user?.name
                  ? user.name
                      .substring(0, 2)
                      .toUpperCase()
                  : "LO"}

              </div>


              <div>

                <strong>
                  {user?.name || "Loading..."}
                </strong>

                <span>
                  {user?.role || "Member"}
                </span>

              </div>

            </div>


            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>


        {/* ================================================= */}
        {/* OVERVIEW */}
        {/* ================================================= */}

        {active === "Overview" && (

          <section className="dashboard">

            {/* HERO */}

            <div className="hero-row">

              <div>

                <p className="eyebrow">
                  CUSTOMER INTELLIGENCE
                </p>

                <h1>
                  Good afternoon 👋
                </h1>

                <p className="subtitle">
                  Here’s what your customers are saying right now.
                </p>

              </div>


              <button
                className="primary-btn"
                onClick={() => setActive("Ask LOOP")}
              >

                <Sparkles size={18} />

                Ask LOOP

              </button>

            </div>


            {/* STATS */}

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Total Feedback
                  </span>

                  <MessageSquareText size={20} />

                </div>

                <h3>
                  {totalFeedback}
                </h3>

                <p className="positive-text">

                  <ArrowUpRight size={16} />

                  Live customer records

                </p>

              </div>


              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Positive Sentiment
                  </span>

                  <CheckCircle2 size={20} />

                </div>

                <h3>
                  {positivePercent}%
                </h3>

                <p className="positive-text">

                  {positiveCount} positive feedback

                </p>

              </div>


              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Negative Sentiment
                  </span>

                  <AlertTriangle size={20} />

                </div>

                <h3>
                  {negativePercent}%
                </h3>

                <p className="danger-text">
                  {negativeCount} need attention
                </p>

              </div>


              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Neutral Sentiment
                  </span>

                  <Clock3 size={20} />

                </div>

                <h3>
                  {neutralPercent}%
                </h3>

                <p className="positive-text">
                  {neutralCount} neutral feedback
                </p>

              </div>

            </div>


            {/* SENTIMENT + ISSUES */}

            <div className="content-grid">

              {/* SENTIMENT PANEL */}

              <div className="panel sentiment-panel">

                <div className="panel-heading">

                  <div>

                    <h2>
                      Sentiment Overview
                    </h2>

                    <p>
                      Customer sentiment across all channels
                    </p>

                  </div>


                  <button className="ghost-btn">
                    All Feedback
                  </button>

                </div>


                <div className="sentiment-chart">

                  <div className="sentiment-ring">

                    <div className="ring-inner">

                      <strong>
                        {positivePercent}%
                      </strong>

                      <span>
                        Positive
                      </span>

                    </div>

                  </div>


                  <div className="legend">

                    <div>

                      <span className="legend-dot positive-dot"></span>

                      <div>

                        <strong>
                          {positivePercent}%
                        </strong>

                        <p>
                          Positive
                        </p>

                      </div>

                    </div>


                    <div>

                      <span className="legend-dot neutral-dot"></span>

                      <div>

                        <strong>
                          {neutralPercent}%
                        </strong>

                        <p>
                          Neutral
                        </p>

                      </div>

                    </div>


                    <div>

                      <span className="legend-dot negative-dot"></span>

                      <div>

                        <strong>
                          {negativePercent}%
                        </strong>

                        <p>
                          Negative
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* EMERGING ISSUES */}

              <div className="panel">

                <div className="panel-heading">

                  <div>

                    <h2>
                      Emerging Issues
                    </h2>

                    <p>
                      AI-detected customer concerns
                    </p>

                  </div>

                </div>


                <div className="issue-list">

                  {topThemes.length > 0 ? (

                    topThemes.map((item, index) => (

                      <div
                        className="issue-item"
                        key={item.theme}
                      >

                        <div
                          className={`issue-icon ${
                            index === 0
                              ? "critical"
                              : index === 1
                              ? "warning"
                              : "normal"
                          }`}
                        >
                          {index < 2 ? "!" : "i"}
                        </div>


                        <div className="issue-text">

                          <strong>
                            {item.theme}
                          </strong>

                          <span>
                            {item.count} mentions
                          </span>

                        </div>


                        <span className="trend-up">
                          {item.percent}%
                        </span>

                      </div>

                    ))

                  ) : (

                    <p>
                      Add customer feedback to detect emerging issues.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* THEMES + AI INSIGHT */}

            <div className="content-grid bottom-grid">

              {/* TOP THEMES */}

              <div className="panel">

                <div className="panel-heading">

                  <div>

                    <h2>
                      Top Themes
                    </h2>

                    <p>
                      Most discussed customer topics
                    </p>

                  </div>

                </div>


                <div className="theme-list">

                  {topThemes.length > 0 ? (

                    topThemes.map((item) => (

                      <div
                        className="theme-row"
                        key={item.theme}
                      >

                        <span>
                          {item.theme}
                        </span>


                        <div className="progress-track">

                          <div
                            className="progress-bar"
                            style={{
                              width: `${item.percent}%`,
                            }}
                          ></div>

                        </div>


                        <strong>
                          {item.percent}%
                        </strong>

                      </div>

                    ))

                  ) : (

                    <p>
                      No feedback themes available yet.
                    </p>

                  )}

                </div>

              </div>


              {/* AI INSIGHT */}

              <div className="panel ai-panel">

                <div className="ai-badge">

                  <Sparkles size={17} />

                  AI Insight

                </div>


                <h2>

                  {topThemes.length > 0
                    ? `${topThemes[0].theme} is currently the most discussed customer topic.`
                    : "LOOP is ready to analyze customer feedback."}

                </h2>


                <p>

                  {totalFeedback > 0
                    ? `LOOP analyzed ${totalFeedback} feedback records. ${negativeCount} are negative, ${positiveCount} are positive and ${neutralCount} are neutral.`
                    : "Add customer feedback to generate automatic insights."}

                </p>


                <div className="recommendation">

                  <strong>
                    Recommended Action
                  </strong>

                  <span>

                    {negativeCount > 0
                      ? "Review negative customer feedback and prioritize recurring issues."
                      : "Continue collecting customer feedback to identify meaningful trends."}

                  </span>

                </div>


                <button
                  className="secondary-btn"
                  onClick={() => setActive("Ask LOOP")}
                >

                  Ask LOOP

                  <ArrowUpRight size={17} />

                </button>

              </div>

            </div>

          </section>

        )}


        {/* ================================================= */}
        {/* FEEDBACK */}
        {/* ================================================= */}

        {active === "Feedback" && (
          <FeedbackPage />
        )}


        {/* ================================================= */}
        {/* ANALYTICS */}
        {/* ================================================= */}

        {active === "Analytics" && (

          <AnalyticsPage
            feedback={feedback}
          />

        )}


        {/* ================================================= */}
        {/* ASK LOOP */}
        {/* ================================================= */}

        {active === "Ask LOOP" && (

          <AskLoopPage
            feedback={feedback}
          />

        )}


        {/* ================================================= */}
        {/* REPORTS PLACEHOLDER */}
        {/* ================================================= */}

        {/* ================================================= */}
{/* REPORTS */}
{/* ================================================= */}

{active === "Reports" && (
  <ReportsPage feedback={feedback} />
)}


        {/* ================================================= */}
        {/* TEAM PLACEHOLDER */}
        {/* ================================================= */}

        {active === "Team" && (
  <TeamPage />
)}


        {/* ================================================= */}
        {/* SETTINGS PLACEHOLDER */}
        {/* ================================================= */}

        {active === "Settings" && (

          <section className="dashboard">

            <div className="hero-row">

              <div>

                <p className="eyebrow">
                  WORKSPACE SETTINGS
                </p>

                <h1>
                  Settings
                </h1>

                <p className="subtitle">
                  Configure your LOOP workspace.
                </p>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}


export default App;