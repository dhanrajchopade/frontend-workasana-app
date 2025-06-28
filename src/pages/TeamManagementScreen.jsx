 
import useFetch from "../useFetch";  
import CreateNewTeam from "../components/CreateNewTeamModal"
import { useState } from "react";
const TeamCards = () => {
  // Call your GET teams API
  const { data, loading, error } = useFetch("https://carbon-taskmanager-backend.vercel.app/teams");
const [createnewTeam, setcreatenewTeam] = useState(false)
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || data.length === 0) return <div>No teams found.</div>;

 
 

  return (
<div className="container mt-5">
 <div className="d-flex align-items-center justify-content-between mb-4">
  <h1 className="text-2xl font-semibold m-0">All Teams</h1>
  <button className="btn btn-primary"  onClick={() => setcreatenewTeam(true)}>
    + Add Team
  </button>
</div>
   <div className="row">
      {data.map(team => (
     
             <div className="col-md-3 mb-4" >
         <div className="card h-100 shadow bg-light">
          <div className="card-body">
            <h5 className="card-title">{team.name}</h5>
<strong>Members:</strong>
              <ul className="mb-0">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member, i) => (
                    <li key={member._id || i}>{member.name}</li>
                  ))
                ) : (
                  <li>No members</li>
                )}
              </ul>
          </div>
        </div>
          </div> 
      ))}
    </div>
   {/* // Modals */}

<CreateNewTeam 
  show={createnewTeam}
  onClose={() => setcreatenewTeam(false)}
/>
    </div>

   
  );
};

export default TeamCards;