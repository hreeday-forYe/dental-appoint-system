// import {
//   CreditCard,
//   CheckCircle2,
//   XCircle,
//   Loader2,
//   ArrowLeft,
// } from "lucide-react";
// import {
//   useInitiatePaymentMutation,
//   useCompletePaymentQuery,
// } from "@/app/slices/appointmentApiSlice";
// import { useForm } from "react-hook-form";
// import { toast, ToastContainer } from "react-toastify";
// import { useEffect, useState } from "react";
// import "react-toastify/dist/ReactToastify.css";

// const PaymentForm = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       amount: "",
//       purchaseOrderId: "",
//       purchaseOrderName: "",
//     },
//   });

//   const [payment, { isLoading }] = useInitiatePaymentMutation();
//   const [paymentResult, setPaymentResult] = useState(null);
//   const [pidx, setPidx] = useState(null);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

//   // Check for pidx in URL on page load
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const pidxFromUrl = urlParams.get("pidx");
//     if (pidxFromUrl) {
//       setPidx(pidxFromUrl);
//     }
//   }, []);

//   // Use RTK Query to verify payment when pidx is available
//   const {
//     data: paymentData,
//     isLoading: verifyLoading,
//     error: verifyError,
//   } = useCompletePaymentQuery(pidx, {
//     skip: !pidx,
//   });

//   useEffect(() => {
//     if (paymentData) {
//       setPaymentResult(paymentData);
//       if (paymentData.success) {
//         setShowSuccessPopup(true);
//         toast.success("Payment Verified Successfully");
//       } else {
//         toast.error(paymentData.message || "Payment Verification Failed");
//       }
//     }
//     if (verifyError) {
//       setPaymentResult({
//         success: false,
//         message: verifyError?.data?.message || "Verification failed",
//       });
//       toast.error(verifyError?.data?.message || "Verification failed");
//     }
//   }, [paymentData, verifyError]);

//   // Initiate Payment
//   const onSubmit = async (data) => {
//     try {
//       const res = await payment(data).unwrap();
//       if (res.success) {
//         window.location.href = res?.payment_url;
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Payment Initiation Failed");
//     }
//   };

//   const resetForm = () => {
//     setPaymentResult(null);
//     setPidx(null);
//     setShowSuccessPopup(false);
//     reset();
//     window.history.pushState({}, document.title, "/my-appointments");
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="flex items-center mb-6">
//         <CreditCard className="text-2xl text-indigo-600 mr-2" />
//         <h2 className="text-2xl font-bold text-gray-800">
//           Khalti Payment Gateway
//         </h2>
//       </div>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       {/* Payment Initiation Form */}
//       {!paymentResult && (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label
//               htmlFor="amount"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Amount (NPR)
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 id="amount"
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                   errors.amount ? "border-red-500" : "border-gray-300"
//                 }`}
//                 {...register("amount", {
//                   required: "Amount is required",
//                   min: { value: 10, message: "Minimum amount is 10 NPR" },
//                 })}
//                 placeholder="e.g., 1000"
//               />
//               {errors.amount && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.amount.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="purchaseOrderId"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Order ID
//             </label>
//             <input
//               type="text"
//               id="purchaseOrderId"
//               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                 errors.purchaseOrderId ? "border-red-500" : "border-gray-300"
//               }`}
//               {...register("purchaseOrderId", {
//                 required: "Order ID is required",
//               })}
//               placeholder="e.g., order123"
//             />
//             {errors.purchaseOrderId && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.purchaseOrderId.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="purchaseOrderName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Order Name
//             </label>
//             <input
//               type="text"
//               id="purchaseOrderName"
//               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                 errors.purchaseOrderName ? "border-red-500" : "border-gray-300"
//               }`}
//               {...register("purchaseOrderName", {
//                 required: "Order name is required",
//               })}
//               placeholder="e.g., Consultation Fee"
//             />
//             {errors.purchaseOrderName && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.purchaseOrderName.message}
//               </p>
//             )}
//           </div>

//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                 isLoading
//                   ? "bg-indigo-400"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="animate-spin mr-2" />
//                   Processing...
//                 </>
//               ) : (
//                 "Pay with Khalti"
//               )}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Payment Result Display */}
//       {verifyLoading && (
//         <div className="text-center py-8">
//           <Loader2 className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
//           <p className="text-lg font-medium text-gray-700">
//             Verifying your payment...
//           </p>
//           <p className="text-gray-500">
//             Please wait while we confirm your transaction
//           </p>
//         </div>
//       )}

//       {paymentResult && !showSuccessPopup && (
//         <div className="payment-result space-y-4">
//           <div
//             className={`p-4 rounded-lg ${
//               paymentResult.success
//                 ? "bg-green-50 border border-green-200"
//                 : "bg-red-50 border border-red-200"
//             }`}
//           >
//             <div className="flex items-start">
//               {paymentResult.success ? (
//                 <CheckCircle2 className="text-2xl text-green-500 mr-3 mt-1" />
//               ) : (
//                 <XCircle className="text-2xl text-red-500 mr-3 mt-1" />
//               )}
//               <div>
//                 <h3 className="text-lg font-medium">
//                   {paymentResult.success
//                     ? "Payment Successful!"
//                     : "Payment Failed"}
//                 </h3>
//                 <p className="text-gray-700">{paymentResult.message}</p>
//               </div>
//             </div>
//           </div>

//           {paymentResult.paymentInfo && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-medium text-gray-700 mb-2">
//                 Transaction Details:
//               </h4>
//               <div className="space-y-1 text-sm text-gray-600">
//                 {Object.entries(paymentResult.paymentInfo).map(
//                   ([key, value]) => (
//                     <div key={key} className="flex justify-between">
//                       <span className="font-medium capitalize">
//                         {key.replace(/([A-Z])/g, " $1").trim()}:
//                       </span>
//                       <span>{value}</span>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           )}

//           <button
//             onClick={resetForm}
//             className="w-full mt-6 flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             <ArrowLeft className="mr-2" />
//             Make Another Payment
//           </button>
//         </div>
//       )}

//       {/* Success Popup */}
//       {showSuccessPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//                 <CheckCircle2 className="h-6 w-6 text-green-600" />
//               </div>
//               <h3 className="mt-3 text-lg font-medium text-gray-900">
//                 Payment Successful!
//               </h3>
//               <div className="mt-2 text-sm text-gray-500">
//                 <p>Your payment has been processed successfully.</p>

//                 {paymentResult?.paymentInfo && (
//                   <div className="mt-4 bg-gray-50 p-3 rounded-lg text-left">
//                     <h4 className="font-medium text-gray-700 mb-2">
//                       Transaction Details:
//                     </h4>
//                     <div className="space-y-1">
//                       <p className="flex justify-between">
//                         <span className="font-medium">Amount:</span>
//                         <span>NPR {paymentResult.paymentInfo.amount}</span>
//                       </p>
//                       <p className="flex justify-between">
//                         <span className="font-medium">Transaction ID:</span>
//                         <span className="font-mono">
//                           {paymentResult.paymentInfo.transactionId}
//                         </span>
//                       </p>
//                       {paymentResult.paymentInfo.referenceId && (
//                         <p className="flex justify-between">
//                           <span className="font-medium">Reference ID:</span>
//                           <span className="font-mono">
//                             {paymentResult.paymentInfo.referenceId}
//                           </span>
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="mt-5">
//               <button
//                 onClick={resetForm}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentForm;
