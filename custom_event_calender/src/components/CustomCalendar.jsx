import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import WeekdaysView from "./WeekdaysView";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Cross2Icon } from "@radix-ui/react-icons";

const localizer = dayjsLocalizer(dayjs);

const NewEventDialog = ({ event, open, setOpen, addEvent }) => {
  const [title, setTitle] = useState("No Title");
  const [startTime, setStartTime] = useState(
    event?.start?.toTimeString().substring(0, 5)
  );
  const [endTime, setEndTime] = useState(
    event?.end?.toTimeString().substring(0, 5)
  );

  const handleSave = () => {
    const start = new dayjs(event.start)
      .set("hour", startTime.substring(0, 2))
      .toDate();
    const end = new dayjs(event.end)
      .set("hour", endTime.substring(0, 2))
      .toDate();

    addEvent({ title, start, end });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="dialog-content"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title>Create Event</Dialog.Title>
          <Dialog.Description className="dialog-details">
            <div className="dialog-item">
              <p>Event Title</p>
              <input
                type="text"
                name="title"
                id="title"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="dialog-item">
              <p>Start Time</p>
              <input
                aria-label="Time"
                type="time"
                className="input-field"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="dialog-item">
              <p>End Time</p>
              <input
                aria-label="Time"
                type="time"
                className="input-field"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <button className="save" onClick={handleSave}>
              Save
            </button>
          </Dialog.Description>
          <Dialog.Close asChild className="close-button">
            <button>
              <Cross2Icon color="#000" height="24" width="24" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

NewEventDialog.propTypes = {
  event: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  addEvent: PropTypes.func,
};

function CustomCalendar() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState();

  useEffect(() => {
    if (!open) setNewEvent(null);
  }, [open]);

  const addEvent = (newEvent) => {
    setEvents((prev) => [
      ...prev,
      {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
      },
    ]);
    setNewEvent(null);
    setOpen(false);
  };

  const handleSelectSlot = (e) => {
    setNewEvent(e);
    setOpen(true);
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={{ day: true, week: true, weekdays: WeekdaysView }}
        defaultView="weekdays"
        messages={{ weekdays: "Weekdays" }}
        onSelectSlot={handleSelectSlot}
        selectable={true}
      />

      {newEvent ? (
        <NewEventDialog
          event={newEvent}
          open={open}
          setOpen={setOpen}
          addEvent={addEvent}
        />
      ) : null}
    </div>
  );
}

export default CustomCalendar;
