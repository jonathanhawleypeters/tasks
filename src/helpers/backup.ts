import { historyRows } from "./database";
import { dateForDisplay, timeForDisplay } from "./dates";
import { ActionType, type Action } from "./types";

const actionRow = (action: Action):string => {
  switch(action.type) {
    // schedule is unhandled here
    case ActionType.add:
    case ActionType.update:
      return `${action.type}|${action.id}|${action.timestamp}|${action.description}`;
    default:
      return `${action.type}|${action.id}|${action.timestamp}|`;
  }
}

const download = (text: string) => {
  // from ChatGPT
  const blob = new Blob([text], { type: "text/plain" });

  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set the link's href attribute to the URL
  link.href = url;

  const now = new Date();

  // Set the link's download attribute to the desired filename
  link.download = `Tasks backup - ${dateForDisplay(now)} ${timeForDisplay(now)}`;

  // Click the link to trigger the download
  link.click();

  // Clean up by revoking the URL object
  URL.revokeObjectURL(url);

  link.remove();
};

export const downloadHistory = () => historyRows((rows: Action[]) => {
  download(`${rows.map(actionRow).join('\n')}\n`);
});
