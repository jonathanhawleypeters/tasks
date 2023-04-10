<div id="about" class="section">
  <p>Tasks is a proof-of-concept. It is built so that data stays on the user's device(s) and in their control.</p>

  <h2>Features</h2>

  <ol>
    <li>works offline</li>
    <li>text file backups</li>
    <li>syncing between two devices</li>
    <li>no login or sign up</li>
  </ol>

  <h2>Limitations</h2>
    
  <ol>
    <li>no login means no logging out or password protecting tasks</li>
    <li>to sync tasks over a network, both devices must be online at the same time, because tasks aren't saved anywhere else.</li>
    <li>because Tasks is a proof-of-concept, it is brutally minimalist which means no scheduling, catergorization, labelling, re-ordering, snoozing, sharing or grouping of tasks. Partly, this is because such features would make implementing a CRDT more complicated</li>
    <li>presently, deleting data requires either 1) deleting all data via site settings in the browser or 2) opening developer tools and fiddling with indexedDB for more fine-grained control</li>
  </ol>
  
  <h2>How it works</h2>
  
  <p>The achitecture is distributed–each instance of Tasks works in isolation. To resolve changes made in separate instances, Tasks implements a <a href="https://crdt.tech/">CRDT</a> (Conflict-free Replicated Data Type).</p>
  
  <h2>Technologies</h2>

  <p>The application uses the following technologies:</p>

  <ol>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">PWAs</a>: a group of technologies that can help websites work offline</li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/indexedDB">indexedDB</a>: a database widely supported in web browsers</li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Glossary/WebRTC">WebRTC</a>: a P2P technology that allows direct connections between two devices</li>
    <li><a href="https://kit.svelte.dev/">SvelteKit</a>: a framework for developing web applications with Svelte</li>
  </ol>
    
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
</div>
