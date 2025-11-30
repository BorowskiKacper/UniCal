import { useCallback, useEffect } from "react";
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

  // Handle clipboard paste
  const handlePaste = useCallback(
    async (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          event.preventDefault();

          const file = item.getAsFile();
          if (!file) continue;

          // Use react-dropzone's built-in validation by simulating a drop
          onDrop([file], []);
          break; // Only handle the first image
        }
      }
    },
    [onDrop]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  const getDropzoneClassName = () => {
    let baseClasses =
      "flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out group";

    if (isDragReject) {
      return `${baseClasses} border-red-500 bg-red-500/10 hover:bg-red-500/20`;
    } else if (isDragAccept || isDragActive) {
      return `${baseClasses} border-[#FFC107] bg-[#FFC107]/10 hover:bg-[#FFC107]/20 dark:border-[#34D399] dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20`;
    } else {
      return `${baseClasses} border-[#DEE2E6] bg-[#F8F9FA] hover:bg-gray-100 dark:border-[#3F3F46] dark:bg-[#18181B] dark:hover:bg-[#27272A]`;
    }
  };

  const getIconClassName = () => {
    if (isDragReject) {
      return "w-8 h-8 mb-4 text-red-400 transition-all duration-300";
    } else if (isDragAccept || isDragActive) {
      return "w-8 h-8 mb-4 text-[#FFC107] dark:text-[#34D399] transition-all duration-300 scale-110";
    } else {
      return "w-8 h-8 mb-4 text-[#ADB5BD] group-hover:text-[#495057] dark:text-[#52525B] dark:group-hover:text-[#A1A1AA] transition-all duration-300";
    }
  };

  const getTextClassName = () => {
    if (isDragReject) {
      return "mb-2 text-sm text-red-500 transition-colors duration-300";
    } else if (isDragAccept || isDragActive) {
      return "mb-2 text-sm text-[#495057] dark:text-[#F4F4F5] transition-colors duration-300";
    } else {
      return "mb-2 text-sm text-[#495057] dark:text-[#F4F4F5] transition-colors duration-300";
    }
  };

  const getSubTextClassName = () => {
    if (isDragReject) {
      return "text-xs text-red-500 transition-colors duration-300";
    } else if (isDragAccept || isDragActive) {
      return "text-xs text-[#6C757D] dark:text-[#A1A1AA] transition-colors duration-300";
    } else {
      return "text-xs text-[#6C757D] dark:text-[#A1A1AA] transition-colors duration-300";
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
          <span className="font-semibold">Click to upload</span>, drag and drop,
          or paste
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
