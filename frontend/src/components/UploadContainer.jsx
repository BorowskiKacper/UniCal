import { useState } from "react";

const UploadContainer = ({ fetchEvents }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState(
    "Foundations of Speech Communication SPCH 11100 Shepard Hall Rm S-276 Tue/Thurs 2pm-3:15pm; Cross-Cultural Perspectives ANTH 20100 NAC Rm 6/213 Mon/Wed 12:30 to 1:45pm; Introduction to Computing for Majors CSC 10300 Marshak Rm MR3 Tue/Thurs 11 to 11:50am and NAC Rm 7/118 Fri 11 to 12:40pm; Elements of Linear Algebra MATH 34600 NAC Rm 5/110 Tue/Thurs 9:30am - 10:45am; Discrete Mathematical Structures 1 CSC 10400 Shepard Hall Rm S-205 Tue/Thurs 4 to 5:40pm and NAC Rm 7/306 Fri 1 to 2:40pm"
  );

  const handleSubmit = () => {
    fetchEvents(text);
  };

  return (
    <div>
      <label htmlFor="paragraph">Enter your schedule here</label>
      <textarea
        id="paragraph"
        value={text}
        onChange={(event) => setText(event.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default UploadContainer;
