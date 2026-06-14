import { useMemo } from "react";
import { Calendar, ChevronRight, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Step1Props {
  startDate: string;
  endDate: string;
  setStartDate: (d: string) => void;
  setEndDate: (d: string) => void;
  isValid: boolean;
  onNext: () => void;
}

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

function formatDateToString(date: Date | null): string {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseStringToDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return date;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);

  return result;
}

function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}

function getDiffDays(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;

  const startTime = start.getTime();
  const endTime = end.getTime();

  return Math.round((endTime - startTime) / ONE_DAY_MS);
}

export function BookingStep1Date({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  isValid,
  onNext,
}: Step1Props) {
  const today = useMemo(() => getToday(), []);

  const parsedStartDate = useMemo(
    () => parseStringToDate(startDate),
    [startDate]
  );

  const parsedEndDate = useMemo(
    () => parseStringToDate(endDate),
    [endDate]
  );

  const minEndDate = parsedStartDate ? addDays(parsedStartDate, 1) : today;

  const durationDays = getDiffDays(parsedStartDate, parsedEndDate);

  const dateError = (() => {
    if (!startDate) {
      return "Tanggal mulai wajib dipilih.";
    }

    if (!endDate) {
      return "Tanggal selesai wajib dipilih.";
    }

    if (!parsedStartDate || !parsedEndDate) {
      return "Format tanggal tidak valid.";
    }

    if (parsedStartDate < today) {
      return "Tanggal mulai tidak boleh sebelum hari ini.";
    }

    if (parsedEndDate <= parsedStartDate) {
      return "Tanggal selesai harus setelah tanggal mulai.";
    }

    return "";
  })();

  const localValid = !dateError && isValid;

  const handleStartDateChange = (date: Date | null) => {
    const newStartDate = formatDateToString(date);
    setStartDate(newStartDate);

    if (!date) {
      setEndDate("");
      return;
    }

    const normalizedStart = new Date(date);
    normalizedStart.setHours(0, 0, 0, 0);

    if (parsedEndDate && parsedEndDate <= normalizedStart) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) {
      setEndDate("");
      return;
    }

    const normalizedEnd = new Date(date);
    normalizedEnd.setHours(0, 0, 0, 0);

    if (parsedStartDate && normalizedEnd <= parsedStartDate) {
      alert("Tanggal selesai harus setelah tanggal mulai.");
      setEndDate("");
      return;
    }

    setEndDate(formatDateToString(normalizedEnd));
  };

  const handleNext = () => {
    if (!localValid) {
      alert(dateError || "Tanggal booking belum valid.");
      return;
    }

    onNext();
  };

  return (
    <div className="p-4 sm:p-6 border-[3px] border-foreground bg-muted/20 rounded-none">
      <h2 className="text-lg sm:text-2xl font-black uppercase italic mb-4 sm:mb-6 flex items-center gap-3 tracking-tighter">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
        SELECT TIMEFRAME
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 font-mono datepicker-brutalist-style">
        {/* START DATE PICKER */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="font-mono text-[9px] sm:text-[10px] font-black uppercase text-foreground">
            START DATE (PICKUP)
          </label>

          <DatePicker
            selected={parsedStartDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={parsedStartDate || undefined}
            endDate={parsedEndDate || undefined}
            minDate={today}
            dateFormat="dd / MM / yyyy"
            placeholderText="DD / MM / YYYY"
            isClearable
            className={`p-2 sm:p-3 bg-background font-mono text-xs sm:text-sm font-bold border-[3px] outline-none uppercase shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all rounded-none w-full text-left cursor-pointer ${
              !startDate && dateError
                ? "border-red-500"
                : "border-foreground"
            }`}
          />
        </div>

        {/* END DATE PICKER */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label className="font-mono text-[9px] sm:text-[10px] font-black uppercase text-foreground">
            END DATE (RETURN)
          </label>

          <DatePicker
            selected={parsedEndDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={parsedStartDate || undefined}
            endDate={parsedEndDate || undefined}
            minDate={minEndDate}
            dateFormat="dd / MM / yyyy"
            placeholderText="DD / MM / YYYY"
            isClearable
            disabled={!parsedStartDate}
            className={`p-2 sm:p-3 bg-background font-mono text-xs sm:text-sm font-bold border-[3px] outline-none uppercase shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all rounded-none w-full text-left ${
              !parsedStartDate
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer"
            } ${
              endDate && parsedEndDate && parsedStartDate && parsedEndDate <= parsedStartDate
                ? "border-red-500"
                : "border-foreground"
            }`}
          />
        </div>
      </div>

      {dateError ? (
        <div className="mt-4 flex items-start gap-2 border-2 border-red-500 bg-red-100 p-3 text-xs font-black uppercase text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{dateError}</span>
        </div>
      ) : (
        <div className="mt-4 border-2 border-foreground/20 bg-white p-3 text-xs font-black uppercase text-foreground/70">
          Durasi rental: {durationDays} hari
        </div>
      )}

      <style>{`
        .datepicker-brutalist-style .react-datepicker-wrapper {
          width: 100%;
        }

        .datepicker-brutalist-style .react-datepicker {
          background-color: #121212 !important;
          border: 3px solid #000000 !important;
          border-radius: 0px !important;
          font-family: monospace !important;
          color: #ffffff !important;
          box-shadow: 4px 4px 0px 0px #000000;
        }

        .datepicker-brutalist-style .react-datepicker__header {
          background-color: #1a1a1a !important;
          border-bottom: 2px solid #000000 !important;
          border-radius: 0px !important;
        }

        .datepicker-brutalist-style .react-datepicker__current-month,
        .datepicker-brutalist-style .react-datepicker__day-name {
          color: #ffffff !important;
          font-weight: 900 !important;
          text-transform: uppercase;
        }

        .datepicker-brutalist-style .react-datepicker__day {
          color: #a0a0a0 !important;
          font-weight: bold !important;
        }

        .datepicker-brutalist-style .react-datepicker__day:hover {
          background-color: #facc15 !important;
          color: #000000 !important;
          border-radius: 0px !important;
        }

        .datepicker-brutalist-style .react-datepicker__day--selected,
        .datepicker-brutalist-style .react-datepicker__day--in-range {
          background-color: #facc15 !important;
          color: #000000 !important;
          border-radius: 0px !important;
        }

        .datepicker-brutalist-style .react-datepicker__day--disabled {
          color: #333333 !important;
          text-decoration: line-through;
        }

        .datepicker-brutalist-style .react-datepicker__close-icon::after {
          background-color: #000000 !important;
          color: #ffffff !important;
          font-weight: 900 !important;
        }
      `}</style>

      <button
        type="button"
        disabled={!localValid}
        onClick={handleNext}
        className={`mt-4 sm:mt-6 w-full py-3 sm:py-4 font-black uppercase italic text-lg sm:text-xl border-[3px] border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all rounded-none ${
          localValid
            ? "bg-foreground text-background hover:bg-secondary hover:text-foreground cursor-pointer"
            : "bg-muted text-foreground/30 cursor-not-allowed"
        }`}
      >
        NEXT STEP
        <ChevronRight className="inline ml-1 w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}