import { useState } from "react";
import RadioButton from "./RadioButton";
import UploadImage from "./UploadImage";
import UploadText from "./UploadText";
import SubmitButton from "../SubmitButton";

const UploadContainer = ({ fetchEvents }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState(
    "Foundations of Speech Communication SPCH 11100 Shepard Hall Rm S-276 Tue/Thurs 2pm-3:15pm; Cross-Cultural Perspectives ANTH 20100 NAC Rm 6/213 Mon/Wed 12:30 to 1:45pm; Introduction to Computing for Majors CSC 10300 Marshak Rm MR3 Tue/Thurs 11 to 11:50am and NAC Rm 7/118 Fri 11 to 12:40pm; Elements of Linear Algebra MATH 34600 NAC Rm 5/110 Tue/Thurs 9:30am - 10:45am; Discrete Mathematical Structures 1 CSC 10400 Shepard Hall Rm S-205 Tue/Thurs 4 to 5:40pm and NAC Rm 7/306 Fri 1 to 2:40pm"
  );
  const [useImage, setUseImage] = useState(true);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  const handleSubmit = async () => {
    if (isLoadingCalendar) return;

    if (useImage) {
      if (!selectedImage) {
        alert("Please select an image before submitting.");
        return;
      }
    }

    setIsLoadingCalendar(true);

    try {
      await fetchEvents({
        isText: !useImage,
        payload: useImage ? selectedImage : text,
      });
    } catch (error) {
      console.error("Error getting Calendar Events", error);
      alert(
        "An error has occured while generating your Calendar. Please try again."
      );
    } finally {
      setIsLoadingCalendar(false);
    }

    console.log(selectedImage);
  };

  let fileName;
  if (selectedImage) {
    fileName = selectedImage.name;
  }

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl">
        <header className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Upload Your Schedule
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Upload an image of your schedule or paste the text directly
          </p>
        </header>

        {fileName && useImage && (
          <div className="mb-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-slate-300 text-sm font-medium truncate">
                {fileName}
              </span>
            </div>
          </div>
        )}

        <RadioButton
          options={["image", "text"]}
          selectedOption={useImage ? "image" : "text"}
          onChange={(value) => setUseImage(value === "image")}
        />

        <div className="mb-8">
          {useImage ? (
            <UploadImage onChange={(file) => setSelectedImage(file)} />
          ) : (
            <UploadText text={text} onChange={(text) => setText(text)} />
          )}
        </div>

        <div className="flex justify-center">
          <SubmitButton
            text={"Generate Calendar"}
            onClick={handleSubmit}
            isDisabled={useImage ? selectedImage === null : text === ""}
            isLoading={isLoadingCalendar}
          />
        </div>
      </div>
    </section>
  );
};

export default UploadContainer;
