import PopupForm from "./PopupForm";

const EventPopup = ({ activeEventId, activeEvent, setEventProperty }) => {
  return (
    <div className="flex flex-col border-y-1 border-l-2 rounded-l-3xl w-full h-full overflow-hidden bg-indigo-50">
      {activeEvent && (
        <div className="m-2 text-center text-2xl">
          <PopupForm
            activeEventId={activeEventId}
            activeEvent={activeEvent}
            setEventProperty={setEventProperty}
          />
        </div>
      )}
    </div>
  );
};

export default EventPopup;
