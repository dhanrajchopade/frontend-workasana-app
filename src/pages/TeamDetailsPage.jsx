import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddMemberModal from "../components/AddMemberModal";

const TeamDetails = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        
         const token = localStorage.getItem("adminToken");
        const res = await fetch("https://carbon-taskmanager-backend.vercel.app/teams", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        

        if (!res.ok) throw new Error("Failed to fetch teams");
        const data = await res.json();
        setTeams(data.teams || data); // support both {teams:[]} or [] response
      } catch (err) {
        console.error("Error:", err);
      }
         

    };
    fetchTeams();
  }, []);
 
  // Add member to a team
  const handleAddMember = async (memberName) => {
    if (!selectedTeamId) return;
    try {
   const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://carbon-taskmanager-backend.vercel.app/teams/${selectedTeamId}/members`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: memberName,
          initials: memberName.slice(0, 2).toUpperCase(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add member");
      const newMember = await res.json();
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === selectedTeamId
            ? { ...team, members: [...(team.members || []), newMember] }
            : team
        )
      );
    } catch (err) {
      console.error("Add Member Error:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 mb-4"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-6">All Teams</h1>

      {teams.length === 0 ? (
        <div>No teams found.</div>
      ) : (
        teams.map((team) => (
          <div key={team._id} className="mb-8 border-b pb-4">
            <h2 className="text-lg font-bold">{team.name}</h2>
            <p className="text-gray-500 mb-2">{team.description}</p>
            <h3 className="text-sm text-gray-500">MEMBERS</h3>
            <ul className="mt-2 space-y-2">
              {(team.members || []).map((member, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {member.initials}
                  </div>
                  <span className="text-sm">{member.name}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setSelectedTeamId(team._id);
                setShowModal(true);
              }}
              className="mt-2 px-4 py-1 text-sm bg-blue-600 text-white rounded"
            >
              + Member
            </button>
          </div>
        ))
      )}

      {showModal && (
        <AddMemberModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
};

export default TeamDetails;