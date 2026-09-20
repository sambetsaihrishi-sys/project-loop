import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

function TeamPage() {
  const token = localStorage.getItem("loop_token");

  const [members, setMembers] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [message, setMessage] = useState("");

  const loadTeam = async () => {
    try {
      setLoading(true);

      const [membersResponse, workspaceResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/workspace/members`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            `${API_URL}/workspace/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      setMembers(membersResponse.data);
      setWorkspace(workspaceResponse.data);
    } catch (error) {
      console.error("Unable to load team:", error);
      setMessage("Unable to load workspace members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter an email address.");
      return;
    }

    try {
      setMessage("");

      const response = await axios.post(
        `${API_URL}/workspace/members`,
        {
          email: email.trim(),
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setEmail("");
      setRole("viewer");

      await loadTeam();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to add member."
      );
    }
  };

  const formatRole = (roleName) => {
    if (!roleName) return "Viewer";

    return roleName
      .replace("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  return (
    <section className="team-page">
      <div className="team-header">
        <div>
          <p className="eyebrow">WORKSPACE</p>

          <h1>Team Management</h1>

          <p className="subtitle">
            Manage workspace members and role-based
            permissions.
          </p>
        </div>

        {workspace && (
          <div className="team-workspace-badge">
            <strong>{workspace.name}</strong>
            <span>{formatRole(workspace.role)}</span>
          </div>
        )}
      </div>

      <div className="team-grid">
        {/* MEMBERS */}
        <div className="panel team-members-card">
          <div className="panel-heading">
            <div>
              <h2>Workspace Members</h2>
              <p>
                {members.length} active workspace{" "}
                {members.length === 1
                  ? "member"
                  : "members"}
              </p>
            </div>
          </div>

          {loading ? (
            <p>Loading team...</p>
          ) : members.length === 0 ? (
            <p>No workspace members found.</p>
          ) : (
            <div className="team-member-list">
              {members.map((member) => (
                <div
                  className="team-member"
                  key={member.id}
                >
                  <div className="member-avatar">
                    {member.name
                      ?.substring(0, 2)
                      .toUpperCase() || "US"}
                  </div>

                  <div className="member-info">
                    <strong>{member.name}</strong>
                    <span>{member.email}</span>
                  </div>

                  <span className="member-role">
                    {formatRole(member.role)}
                  </span>

                  <span
                    className={`member-status ${
                      member.status === "Active"
                        ? "active"
                        : ""
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD MEMBER */}
        <div className="panel add-member-card">
          <h2>Add Team Member</h2>

          <p>
            Add an existing LOOP user to this workspace
            and assign a role.
          </p>

          {workspace?.role === "admin" ? (
            <form onSubmit={handleAddMember}>
              <label>User Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="member@example.com"
                required
              />

              <label>Workspace Role</label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >
                <option value="viewer">
                  Viewer
                </option>

                <option value="support_agent">
                  Support Agent
                </option>

                <option value="product_manager">
                  Product Manager
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

              <button
                type="submit"
                className="primary-btn"
              >
                Add Member
              </button>
            </form>
          ) : (
            <p>
              Only workspace administrators can add
              members.
            </p>
          )}

          {message && (
            <p className="team-message">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* ROLE INFORMATION */}
      <div className="panel role-permissions-card">
        <div className="panel-heading">
          <div>
            <h2>Role Permissions</h2>
            <p>
              Role-based access control for LOOP
              workspaces.
            </p>
          </div>
        </div>

        <div className="role-grid">
          <div className="role-card">
            <strong>Admin</strong>
            <p>
              Full workspace access and team management.
            </p>
          </div>

          <div className="role-card">
            <strong>Product Manager</strong>
            <p>
              Review feedback, analytics, insights and
              reports.
            </p>
          </div>

          <div className="role-card">
            <strong>Support Agent</strong>
            <p>
              Add and review customer feedback.
            </p>
          </div>

          <div className="role-card">
            <strong>Viewer</strong>
            <p>
              Read-only access to workspace insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamPage;