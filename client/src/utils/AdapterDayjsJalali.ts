import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import jalaliPlugin from "@zoomit/dayjs-jalali-plugin";
import "dayjs/locale/fa";

// Enable Jalali globally
dayjs.extend(jalaliPlugin);
dayjs.locale("fa");
dayjs.calendar("jalali");

export class AdapterDayjsJalali extends AdapterDayjs {
	// Override methods if needed, but for most cases
	// just extending AdapterDayjs works because dayjs is already patched
}
