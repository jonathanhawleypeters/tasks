import { writable } from "svelte/store";

const selectedViewStore = writable('');

const defaultView = "#current-tasks";

const removeHash = () => { 
  history.pushState("", document.title, window.location.pathname + window.location.search);
}

const updateLocation = (hash: string) => {
  if (hash === defaultView) {
    const id = hash.slice(1);
    removeHash();
    document.getElementById(id)?.scrollIntoView();
    return;
  }

  location.hash = hash;
}

const selectedView = {
  subscribe: selectedViewStore.subscribe,

  update: (hash: string) => {
    selectedViewStore.update(() => hash);

    updateLocation(hash);
  }
};

export default selectedView;