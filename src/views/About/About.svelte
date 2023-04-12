<script>
	import Licenses from "./Licenses.svelte";

</script>
<div id="about" class="section">
  <p>Tasks is a proof-of-concept. Data stays on the user's device(s).</p>

  <h2>Features</h2>

  <ol>
    <li>enter, edit, complete, un-complete, and delete tasks</li>
    <li>rich history includes all edits with timestamps</li>
    <li>works offline</li>
    <li>text file backups</li>
    <li>syncing between two devices</li>
    <li>no login or sign up</li>
  </ol>

  <h2>Limitations</h2>
    
  <ol>
    <li>no login means no logging out or password protecting tasks</li>
    <li>to sync tasks over a network, both devices must be online at the same time</li>
    <li>because Tasks is a proof-of-concept, the task management features are minimal</li>
    <li>deleting data requires use of browser settings or indexedDB via the developer tools console</li>
    <li>the UI is not optimized to display large amounts of data</li>
    <li>no indication of success or failure when restoring from backup</li>
  </ol>
  
  <h2>How it works</h2>
  
  <p>Each instance of Tasks works in isolation–a distributed architecture. To resolve changes made in separate instances, Tasks implements a <a href="https://crdt.tech/">CRDT</a> (Conflict-free Replicated Data Type).</p>
  
  <h2>Technologies</h2>

  <p>The application uses the following technologies:</p>

  <ol>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">PWAs</a>: a group of technologies that can help websites work offline</li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/indexedDB">indexedDB</a>: a database widely supported in web browsers</li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Glossary/WebRTC">WebRTC</a>: a P2P technology that allows connections between in-browser applications</li>
    <li><a href="https://kit.svelte.dev/">SvelteKit</a>: a framework for developing web applications with Svelte</li>
  </ol>

  <h2>GitHub</h2>

  <p>
    <a href="https://github.com/jonathanhawleypeters/tasks">Code</a>
    <a href="https://github.com/jonathanhawleypeters/tasks/issues">Issues</a>
    <a href="https://github.com/jonathanhawleypeters/tasks/pulls">Pull requests</a>
  </p>
    
  <h2>License</h2>

  <div id="license">
    <p>Copyright (c) 2023 Jonathan Hawley-Peters</p>

    <p>Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:</p>

    <p>The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.</p>

    <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.</p>
  </div>

  <details>
    <summary>
      <h2>Licenses</h2>
      <p>(MIT OR CC0-1.0), 0BSD, Apache, Apache-2.0, BSD, BSD-2-Clause, BSD-3-Clause, GPL, ISC, MIT, Python-2.0</p>
      <p>automatically generated via <code>npx nlf</code> (MIT)</p>
    </summary>
    <Licenses />
  </details>
</div>

<style>
  details h2 {
    display: inline-block;
  }
  summary > p, #license > p {
    font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
  }
</style>
