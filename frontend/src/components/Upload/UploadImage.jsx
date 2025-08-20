import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const UploadImage = ({ onChange }) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      }

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((error) => error.code === "file-too-large")) {
          alert("File is too large. Maximum size is 10MB.");
        } else if (
          rejection.errors.some((error) => error.code === "file-invalid-type")
        ) {
          alert("Invalid file type. Only PNG, JPEG, and WEBP are allowed.");
        } else {
          alert("File upload failed. Please try again.");
        }
      }
    },
    [onChange]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const getDropzoneClassName = () => {
    let baseClasses =
      "flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out group";

    if (isDragReject) {
      return `${baseClasses} border-red-500 bg-red-500/10 hover:bg-red-500/20`;
    } else if (isDragAccept || isDragActive) {
      return `${baseClasses} border-blue-500 bg-blue-500/10 hover:bg-blue-500/20`;
    } else {
      return `${baseClasses} border-slate-600 bg-slate-700/30 hover:bg-slate-700/50 hover:border-blue-500/50`;
    }
  };

  const getIconClassName = () => {
    if (isDragReject) {
      return "w-8 h-8 mb-4 text-red-400 transition-all duration-300";
    } else if (isDragAccept || isDragActive) {
      return "w-8 h-8 mb-4 text-blue-400 transition-all duration-300 scale-110";
    } else {
      return "w-8 h-8 mb-4 text-slate-400 group-hover:text-blue-400 transition-all duration-300 hover:scale-103";
    }
  };

  const getTextClassName = () => {
    if (isDragReject) {
      return "mb-2 text-sm text-red-300 transition-colors duration-300";
    } else if (isDragAccept || isDragActive) {
      return "mb-2 text-sm text-blue-300 transition-colors duration-300";
    } else {
      return "mb-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300";
    }
  };

  const getSubTextClassName = () => {
    if (isDragReject) {
      return "text-xs text-red-400 transition-colors duration-300";
    } else if (isDragAccept || isDragActive) {
      return "text-xs text-blue-400 transition-colors duration-300";
    } else {
      return "text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300";
    }
  };

  const getDropText = () => {
    if (isDragReject) {
      return "Invalid file type or size";
    } else if (isDragActive) {
      return "Drop the image here";
    } else {
      return (
        <>
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div {...getRootProps({ className: getDropzoneClassName() })}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className={getIconClassName()}
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
            <p className={getTextClassName()}>{getDropText()}</p>
            <p className={getSubTextClassName()}>
              PNG, JPG/JPEG, or WEBP (MAX. 10MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
