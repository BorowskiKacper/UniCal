const UploadImage = ({ onChange }) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          accept="image/jpeg, image/png, image/webp"
          onChange={(event) => onChange(event.target.files[0])}
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 md:h-40 
                     border-2 border-dashed border-slate-600 rounded-xl cursor-pointer 
                     bg-slate-700/30 hover:bg-slate-700/50 hover:border-blue-500/50
                     transition-all duration-300 ease-in-out group"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-slate-400 group-hover:text-blue-400 transition-all duration-300 hover:scale-103"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
              PNG, JPG/JPEG, or WEBP (MAX. 10MB)
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UploadImage;
