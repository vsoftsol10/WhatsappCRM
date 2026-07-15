// import { useEffect, useState } from "react";
// import useDealStore from "../../store/dealStore";

// export default function DealActivity({ dealId }) {
//   const {
//     activities,
//     isLoading,
//     fetchActivities,
//     addActivity,
//   } = useDealStore();

//   const [type, setType] = useState("Call");
//   const [note, setNote] = useState("");

//   // useEffect(() => {
//   //   if (dealId) {
//   //     fetchActivities(dealId);
//   //   }
//   // }, [dealId, fetchActivities]);

//   // useEffect(() => {
//   //   if (!dealId) return;

//   //   const load = async () => {
//   //     try {
//   //       await fetchActivities(dealId);
//   //     } catch (err) {
//   //       console.error(err);
//   //     } 
//   //   };

//   //   load();
//   // }, [dealId, fetchActivities]);

//   useEffect(() => {
//     if (dealId) {
//       fetchActivities(dealId);
//     }
//   }, [dealId]);

//   const handleAddActivity = async () => {
//     if (!note.trim()) return;

//     try {
//       await addActivity(dealId, {
//         type,
//         note,
//       });

//       setNote("");
//       setType("Call");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       {/* ADD ACTIVITY */}
//       <div className="flex gap-2 mb-5">
//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           className="border px-2 py-1 rounded"
//         >
//           <option value="Call">Call</option>
//           <option value="Email">Email</option>
//           <option value="Note">Note</option>
//         </select>

//         <input
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           placeholder="Add activity note..."
//           className="border flex-1 px-3 py-1 rounded"
//         />

//         <button
//           onClick={handleAddActivity}
//           className="bg-yellow-400 px-4 rounded font-semibold"
//         >
//           Add
//         </button>
//       </div>

//       {/* TIMELINE */}
//       {isLoading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : (
//         <div className="relative pl-6">
//           {/* LINE */}
//           <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-200" />

//           {activities.length === 0 ? (
//             <p className="text-gray-400 text-sm">
//               No activities yet
//             </p>
//           ) : (
//             activities.map((act) => (
//               <div
//                 key={act.id}
//                 className="mb-6 relative"
//               >
//                 {/* DOT */}
//                 <div className="absolute left-[-6px] top-1 w-3 h-3 bg-yellow-400 rounded-full" />

//                 <div className="ml-4">
//                   <div className="font-semibold text-gray-800">
//                     {act.type}
//                   </div>

//                   <div className="text-gray-600 text-sm">
//                     {act.note}
//                   </div>

//                   <div className="text-xs text-gray-400 mt-1">
//                     {new Date(
//                       act.createdAt
//                     ).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import useDealStore from "../../store/dealStore";

export default function DealActivity({ dealId }) {
  const { activities, fetchActivities, addActivity } =
    useDealStore();

  const [type, setType] = useState("Call");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH ACTIVITIES
  // useEffect(() => {
  //   if (!dealId) return;

  //   const load = async () => {
  //     setLoading(true);
  //     try {
  //       await fetchActivities(dealId);
  //     } catch (err) {
  //       console.error("Fetch activities error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   load();
  // }, [dealId, fetchActivities]);

  useEffect(() => {
  if (!dealId) return;

  console.log("useEffect fired");

  const load = async () => {
    console.log("Loading activities...");
    setLoading(true);

    try {
      await fetchActivities(dealId);
      console.log("Activities loaded");
    } catch (err) {
      console.error(err);
    } finally {
      console.log("Loading finished");
      setLoading(false);
    }
  };

  load();
}, [dealId]);

  // ADD ACTIVITY
  const handleAddActivity = async () => {
    if (!note.trim()) return;

    try {
      await addActivity(dealId, {
        type,
        note,
      });

      setNote("");
      setType("Call");

      // refresh list
      await fetchActivities(dealId);
    } catch (err) {
      console.error("Add activity error:", err);
    }
  };

  return (
    <div>
      {/* ADD ACTIVITY FORM */}
      <div className="flex gap-2 mb-5">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="Call">Call</option>
          <option value="Email">Email</option>
          <option value="Note">Note</option>
        </select>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add activity note..."
          className="border flex-1 px-3 py-1 rounded"
        />

        <button
          onClick={handleAddActivity}
          className="bg-yellow-400 px-4 rounded font-semibold"
        >
          Add
        </button>
      </div>

      {/* TIMELINE */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="relative pl-6">
          {/* vertical line */}
          <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-200" />

          {activities.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No activities yet
            </p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="mb-6 relative">
                {/* dot */}
                <div className="absolute left-[-6px] top-1 w-3 h-3 bg-yellow-400 rounded-full" />

                <div className="ml-4">
                  <div className="font-semibold text-gray-800">
                    {act.type}
                  </div>

                  <div className="text-gray-600 text-sm">
                    {act.note}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(act.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}