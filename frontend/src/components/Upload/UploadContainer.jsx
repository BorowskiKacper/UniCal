import { useState, useEffect } from "react";
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

  const handleSubmit = () => {
    if (useImage) {
      if (!selectedImage) {
        alert("Please select an image before submitting.");
        return;
      }
      fetchEvents({ isText: false, payload: selectedImage });
    } else {
      fetchEvents({ isText: true, payload: text });
    }

    console.log(selectedImage);
  };

  useEffect(() => {
    if (selectedImage) {
      const type = selectedImage.type;
      if (
        !(
          type === "image/jpeg" ||
          type === "image/png" ||
          type === "image/webp"
        )
      ) {
        setSelectedImage(null);
        alert("Invalid file type. Only PNG, JPEG, and WEBP are allowed.");
      }
    }
  }, [selectedImage]);

  let fileName;
  if (selectedImage) {
    fileName = selectedImage.name;
  }

  return (
    <div className="flex flex-col items-center justify-center w-15/16 h-full m-5">
      <div>{fileName}</div>
      <RadioButton
        options={["image", "text"]}
        selectedOption={useImage ? "image" : "text"}
        onChange={(value) => setUseImage(value === "image")}
      />
      {useImage ? (
        <UploadImage onChange={(file) => setSelectedImage(file)} />
      ) : (
        <UploadText text={text} onChange={(text) => setText(text)} />
      )}
      <SubmitButton
        text={"Generate"}
        onClick={handleSubmit}
        isDisabled={useImage ? selectedImage === null : text === ""}
      />
    </div>
  );
};

export default UploadContainer;
