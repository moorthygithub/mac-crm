import { useApiMutation } from "@/hooks/useApiMutation";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ToggleAction = ({
  initialStatus,
  apiUrl,
  payloadKey = "services_request_status",
  activeValue = "Active",
  method = "patch",
  onSuccess,
}) => {
  const [status, setStatus] = useState(initialStatus);
  const { trigger, loading } = useApiMutation();

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleToggle = async (action) => {
    const formData = new FormData();
    formData.append(payloadKey, action);
    // formData.append("_method", "PATCH");

    try {
      const res = await trigger({
        url: apiUrl,
        method,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.code === 200 || res?.code === 201) {
        setStatus(action);
        onSuccess?.();

        toast.success(res.message, {
          description: `Status changed to ${action}`,
        });
      } else {
        toast.error(res?.message || "Unable to update status");
      }
    } catch (err) {
      toast.error(err?.message || "Unable to update status");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <RefreshCcw className="h-4 w-4 animate-spin text-blue-500" />}
      <span className="text-sm font-medium">
        <select
          name="services_request_status"
          onChange={(e) => handleToggle(e.target.value)}
          disabled={loading}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-2xl transition-colors
        ${
          status === activeValue
            ? "text-green-800 bg-green-100"
            : "text-red-800 bg-red-100"
        }`}
        >
          <option value="" className="text-black bg-white">
            {status}
          </option>
          <option value="Cancel" className="text-red-800 bg-red-100">
            Cancel
          </option>
          <option value="Approved" className="text-green-800 bg-green-100">
            Approved
          </option>
        </select>
      </span>
    </div>
  );
};

// const ToggleAction = ({
//   initialStatus,
//   apiUrl,
//   payloadKey = "services_request_status",
//   activeValue = "Approved", // Match the backend's expected string
//   method = "PUT", // Using PUT because your other component worked with it
//   onSuccess,
// }) => {
//   const [status, setStatus] = useState(initialStatus);
//   const { trigger, loading } = useApiMutation();

//   useEffect(() => {
//     setStatus(initialStatus);
//   }, [initialStatus]);

//   const handleToggle = async (actionValue) => {
//     if (!actionValue || actionValue === status) return;

//     // 1. Create the FormData object
//     const formData = new FormData();
//     formData.append(payloadKey, actionValue); // Key: services_request_status, Value: Approved
//     formData.append("_method", "PATCH"); // Method spoofing for your Laravel route

//     try {
//       // 2. Trigger the mutation
//       const res = await trigger({
//         url: apiUrl,
//         method: "POST", // Send as POST so the backend reads the multipart body
//         data: formData, // Pass the FormData object directly
//         // IMPORTANT: Do NOT manually set 'Content-Type'.
//         // Fetch/Query will automatically set it to 'multipart/form-data; boundary=...'
//       });

//       if (res?.code === 200 || res?.code === 201) {
//         setStatus(actionValue);
//         onSuccess?.();
//         toast.success(res.message);
//       }
//     } catch (err) {
//       // 3. This will show you exactly which field failed validation
//       console.error("Validation Error Details:", err.response?.data?.errors);
//       toast.error(
//         err.response?.data?.message || "Check your backend validation rules",
//       );
//     }
//   };
//   return (
//     <div className="flex items-center gap-2">
//       {loading && <RefreshCcw className="h-4 w-4 animate-spin text-blue-500" />}

//       <select
//         value={status}
//         onChange={(e) => handleToggle(e.target.value)}
//         disabled={loading}
//         className={`px-3 py-1 rounded-2xl text-sm font-medium border-none outline-none
//         ${
//           status === "Approved"
//             ? "text-green-800 bg-green-100"
//             : status === "Cancel"
//               ? "text-red-800 bg-red-100"
//               : "text-gray-800 bg-gray-100"
//         }`}
//       >
//         {/* Do not use {status} as a value for 'Pending' */}
//         <option value="Pending">Pending</option>
//         <option value="Cancel">Cancel</option>
//         <option value="Approved">Approved</option>
//       </select>
//     </div>
//   );
// };

export default ToggleAction;
