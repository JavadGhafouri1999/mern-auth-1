// navigationEvents.ts
import mitt from "mitt";
export const navEvents = mitt<{ authError: void }>();
