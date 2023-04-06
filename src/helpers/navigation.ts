import selectedView from './selectedView';

export const initialize = () => {
  selectedView.update(location.hash);
  window.addEventListener('hashchange', () => {
    const id = (location.hash || "#current-tasks").slice(1);

    document.getElementById(id)?.scrollIntoView();
  });
  // this is stupid, but svelte is broken, so...
  // https://github.com/sveltejs/kit/issues/4216#issuecomment-1067754638
  document.getElementById(location.hash.slice(1))?.scrollIntoView();

  // move intersection stuff into a helper
  function onIntersectionChange(sections: IntersectionObserverEntry[]) {
    sections.forEach(section => {
      if (section.isIntersecting) {
        selectedView.update(`#${section.target.id}`);
      }
    })
  }

  const observer = new IntersectionObserver(onIntersectionChange, {
    root: document.querySelector('.sectionsContainer'),   // default is the viewport
    threshold: .49 // percentage of target's visible area. Triggers "onIntersection"
  })

  for (const section of document.querySelectorAll('.section')) {
    observer.observe(section);
  }      

  return () => observer.disconnect();
}