import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Components
import { ApplicationFormPopup } from "../components/popups/ApplicationFormPopup";
import InfoPopup from "../components/popups/InfoPopup";
import WebcamStreamCapture from "../components/WebcamRecord";
import Timer from "../components/Timer";
import QuestionCounter from "../components/QuestionCounter";
import Spinner from "../components/Spinner";
//Stores
import useVideoStore from "../store/video.store";
import useApplicationsStore from "../store/applications.store";
import useInterviewStore from "../store/interview.store";

const InterviewPage = () => {
  const navigate = useNavigate();
  const { title } = useParams();

  // Stores
  const { addVideo } = useVideoStore();
  const { updateApplication } = useApplicationsStore();
  const { interview, fetchInterviewByName, error, loading } =
    useInterviewStore();

  // States
  const [applicationId, setApplicationId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(true);
  const [isApplicationFormPopupOpen, setIsApplicationFormPopupOpen] =
    useState(true);
  const [setPermissionsGranted] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const [timerReset, setTimerReset] = useState(false);
  const [isWebcamPopupOpen, setIsWebcamPopupOpen] = useState(true);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    fetchInterviewByName(title);
  }, [fetchInterviewByName, title]);

  useEffect(() => {
    if (!loading && (error || interview?.isActive === false)) {
      navigate("/not-found");
    }
  }, [error, loading, interview, navigate]);

  useEffect(() => {
    if (interview) {
      const time = interview.packages.reduce((totalTime, pkg) => {
        const packageTime = pkg.questions.reduce(
          (pkgTotal, q) => pkgTotal + q.questionTime,
          0
        );
        return totalTime + packageTime;
      }, 0);
      setInterviewTime(time);

      const allQuestions = interview.packages.flatMap((pkg) => pkg.questions);
      setQuestions(allQuestions);
    }
  }, [interview]);

  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      setCurrentQuestionTime(questions[currentQuestionIndex].questionTime);
      setTimerReset((prev) => !prev);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (questions.length > 0) {
      const newProgress = ((currentQuestionIndex + 1) / questions.length) * 100;
      setProgress(newProgress);
    }
  }, [currentQuestionIndex, questions]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleEndInterview();
    }
  };

  const handleCloseInfoPopup = () => {
    setIsInfoPopupOpen(false);
    setIsApplicationFormPopupOpen(true);
  };

  const handleCloseApplicationFormPopup = () => {
    setIsApplicationFormPopupOpen(false);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(() => setPermissionsGranted(true))
      .catch((err) => {
        console.error("Permission denied:", err);
        alert("Lütfen kamera ve mikrofon izinlerini verin.");
      });
  };

  const handleStartInterview = () => {
    console.log("Interview başlatılıyor...");
    setIsWebcamPopupOpen(false);
    setIsRecording(true);
  };

  const handleEndInterview = () => {
    console.log("Interview sona erdiriliyor...");
    setIsRecording(false);
  };

  const savingVideo = async (file) => {
    setIsEnded(true);
    try {
      const videoId = await addVideo(file);
      const resolvedID = await applicationId;
      await updateApplication(resolvedID, { videoUrl: videoId });
    } catch (error) {
      console.error("Error uploading video or updating application:", error);
    } finally {
      navigate("/interview/ending");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (isEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner />
        <p className="text-white mt-4">Recording your interview...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-900">
      {/* Eğer InfoPopup açık ise yalnızca InfoPopup gösterilecek */}
      {isInfoPopupOpen ? (
        <InfoPopup onClose={handleCloseInfoPopup} interview={interview} />
      ) : (
        <>
          {/* Webcam ve diğer bileşenler InfoPopup kapandıktan sonra gösterilir */}
          <div
            className={`${
              isWebcamPopupOpen
                ? "xs:w-full xs:min-h-[600px] sm:w-full sm:h-full md:w-1/2 md:h-full object-cover 3xl:w-4/5 3xl:h-full 3xl:bottom-20 m-auto rounded-xl"
                : "shadow-3xl shadow-black 3xl:rounded-lg md:w-1/2 md:h-full object-cover 3xl:w-4/5 3xl:h-full 3xl:bottom-20 m-auto "
            } flex items-center justify-center relative transition-all duration-500`}
          >
            <WebcamStreamCapture
              isRecording={isRecording}
              onSaveRecord={savingVideo}
            />
            {isWebcamPopupOpen && (
              <button
                className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-rtw text-white px-4 py-2 rounded-lg shadow-lg hover:bg-hoverrtw transition-all duration-300"
                onClick={handleStartInterview}
              >
                Start Interview
              </button>
            )}
          </div>

          {!isWebcamPopupOpen && (
            <div className="w-full md:w-1/2 md:z-50 absolute 3xl:bottom-5 xs:bottom-0 3xl:ml-[25%] mt-80">
              {!isWebcamPopupOpen && (
                <div className="flex justify-between items-center bg-white py-2 xs:py-0 xs:text-lg 3xl:top-0 rounded-tl-2xl rounded-tr-2xl px-5 mt-[75%] ">
                  <div>
                    {interview && currentQuestionTime && (
                      <Timer
                        initialTime={currentQuestionTime}
                        title={"Question Time"}
                        start={isRecording}
                        next={goToNextQuestion}
                        reset={timerReset}
                      />
                    )}
                  </div>
                  <div>
                    <Timer
                      initialTime={interviewTime}
                      title={"Total Time"}
                      start={isRecording}
                    />
                  </div>
                </div>
              )}

              {!isWebcamPopupOpen && (
                <div className="w-full bg-gray-800 shadow-lg top-0 bg-white">
                  <div
                    className="bg-rtw h-1 transition-all duration-500 absolute"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              <div className="w-full">
                {interview && (
                  <QuestionCounter
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    next={goToNextQuestion}
                    finish={handleEndInterview}
                    skippable={interview?.canSkip}
                    showAtOnce={interview?.showAtOnce}
                  />
                )}
              </div>
            </div>
          )}

          {isApplicationFormPopupOpen && interview && (
            <ApplicationFormPopup
              onClose={handleCloseApplicationFormPopup}
              id={interview._id}
              setApplicationId={setApplicationId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InterviewPage;
