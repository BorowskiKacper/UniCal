const UploadImage = ({ onChange }) => {
  return (
    <>
      <label htmlFor="file-upload">
        <input
          type="file"
          id="file-upload"
          className="file:bg-blue-500 file:text-white file:border-none file:p-2 file:rounded-md file:cursor-pointer"
          accept="image/jpeg, image/png, image/webp"
          onChange={(event) => onChange(event.target.files[0])}
        />
      </label>
    </>
  );
};

export default UploadImage;
