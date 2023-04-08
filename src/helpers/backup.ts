import { historyRows, mergeExternalActions } from "./database";
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
using the "restore backups" option.

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

`;

export const downloadHistory = () => historyRows((rows: Action[]) => {
  download(`${backupHeader}${rows.map(actionRow).join('\n')}\n`);
});

export const backupTextValid = (text: string): boolean => {
  const validVersion = /\(version 1\)/.test(text);
  
  const containsTableHeader = text.includes(tableHeader);

  if (!validVersion || !containsTableHeader) return false;

  return true;
}

const isAddOrUpdate = (a: string) => a === ActionType.add || a === ActionType.update;

export const actionsFromBackup = (text: string): Action[] => {
  const [
    /* backup header */,
    actionLines,
  ] = text.split(tableHeader);

  return actionLines.trim()
    .split('\n')
    .map(line => line.split('|', 4))
    .map(([action, identifier, actiontime, description]) => {
      const type = action as ActionType;
      const id = Number(identifier);
      const timestamp = Number(actiontime);

      return isAddOrUpdate(type)
        ? { type: type as ActionType, id, timestamp, description }
        : { type: type as ActionType, id, timestamp }
  })
}

export const mergeBackupFileActions = (files: FileList) => {
  Promise.all<Action[]>(
    Array.from(files).map(file => {
      const reader = new FileReader();

      reader.readAsText(file);

      return new Promise<Action[]>((resolve, reject) => {
        reader.onload = function() {
          const contents = reader.result;

          if (!(typeof contents === 'string')) return;

          if (!backupTextValid(contents)) {
            console.error(`${file.name} is not a valid tasks backup file`);
            return;
          }

          console.log(`${file.name} is a valid Tasks backup file`)

          resolve(actionsFromBackup(contents));
        };

        reader.onerror = (event) => {
          reject(event);
        }

      })

    })
  ).then(lists => mergeExternalActions(lists.flat()));
}
