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

const tableHeader = "action type | id | timestamp | description"

const backupHeader = `This is a backup (version 1) file for a Tasks app

It can be used at https://tasks.pages.dev/ by going to History and
using the "restore backup" option.

The contents are a list of actions taken to enter, modify and complete tasks.

There are five kinds of actions, each represented in this file as a single letter:
A add a task
C mark a task completed
I mark a completed task incomplete
U update the description text
D delete a task

There are timestamps that look something like this 1679629908719.
They represent a date and time as a number of milliseconds since 1970, UTC.

Task ids are the timestamp from when a task was first added.
This means every add action should have the same value for id and timestamp.
Updates to a task have the same id and a later timestamp.

Only add and update actions have description text.

${tableHeader}
`

export const downloadHistory = () => historyRows((rows: Action[]) => {
  download(`${backupHeader}\n${rows.map(actionRow).join('\n')}\n`);
});
