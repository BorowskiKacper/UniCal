import { useState } from "react";
import RadioButton from "./RadioButton";
import UploadImage from "./UploadImage";
import UploadText from "./UploadText";
import SubmitButton from "../SubmitButton";

const UploadContainer = ({ fetchEvents }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");
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
      <div className="w-full max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
        <header className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 dark:text-zinc-100">
            Upload Your Schedule
          </h2>
          <p className="text-gray-500 text-sm md:text-base dark:text-zinc-400">
            Upload an image or paste text to get started.
          </p>
        </header>

        {fileName && useImage && (
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 flex items-center text-sm transition-all dark:bg-zinc-900 dark:border-zinc-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-500 dark:text-zinc-400"
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
            <span className="truncate text-gray-800 dark:text-zinc-100">
              {fileName}
            </span>
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
