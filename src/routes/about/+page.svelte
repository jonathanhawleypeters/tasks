<p><a href="/">home</a></p>

<h1>About Tasks</h1>

<p>Tasks is a mock-up, based a few ideas</p>

<ol>
  <li>people should own their data</li>
  <li>applications should work offline</li>
  <li>using simple tools like this one should not require registering with an organization, or entering contractual agreements</li>
</ol>

<p>To reflect this, Tasks works differently from most apps and websites</p>

<ol>
  <li>there is no sign up process, username or password</li>
  <li>data is stored locally and synced only when the user decides, by making a short-lived network connection between two devices</li>
  <li>the application works offline</li>
</ol>

<p>The first two items are tradeoffs:</p>

<ol>
  <li><p>Nobody has to log in to use the application, and the data is not encrypted at rest. In those senses, the app isn't very secure. But also, data isn't aggregated in one place where it is more likely to be sold or stolen in bulk.</p></li>
  <li><p>The manual syncing trades control for convenience.</p></li>
</ol>

<h2>How it works</h2>

<p>In addition to the core ideas, Tasks was born of the desire to learn about:</p>

<ol>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">PWAs</a>: a group of technologies that can help websites work offline</li>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/indexedDB">indexedDB</a>: a database widely supported in web browsers</li>
  <li><a href="https://developer.mozilla.org/en-US/docs/Glossary/WebRTC">WebRTC</a>: a P2P technology that allows direct connections between two devices</li>
</ol>

<p>The "sync only when you choose" feature also requires a way to reconcile actions, like completing or editing a task, taken on separate devices during overlapping time periods. To solve this, Tasks takes a simplified, <a href="https://crdt.tech/">CRDT</a> (Conflict-free Replicated Data Type) -inspired approach.</p>

<br />
<br />

<!-- describe how actions are used for syncing and rebuilding state -->
