// import NormalButton from "./NormalButton";
// import React, {useState} from "react";

// const [isClaimed, setisClaimed] = useState(false);

// const [showModal, setShowModal] = useState(true);

// const 
// export const ClaimModal = (isClaimed: boolean) =>{
//     return(
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <div className="mb-4">
//               <h2 className="text-xl font-semibold text-gray-900 mb-3">
//                 {isClaimed ? 'Business Already Claimed' : 'Claim This Business'}
//               </h2>
              
//               <p className="text-gray-700">
//                 {isClaimed
//                   ? 'Mechanic is already claimed. If you believe something is wrong please contact us at JAC@gmail.com'
//                   : 'Please contact us at JAC@gmail.com to claim this business with the necessary business information'}
//               </p>
//             </div>

//             <div className="flex justify-end">
//               <NormalButton onClick={() => setShowModal(false)}>
//                 Close
//               </NormalButton>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }