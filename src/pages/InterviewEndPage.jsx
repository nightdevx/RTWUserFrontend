const InterviewEndPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-200">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-800">
          Interview Completed
        </h1>
        <p className="text-lg mb-6 text-gray-600">
          Your interview has been successfully completed. The results will be
          shared with you as soon as possible.
        </p>
      </div>
    </div>
  );
};

export default InterviewEndPage;
