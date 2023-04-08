<div id="about" class="section">
  <p>Tasks is a mock-up, based a few ideas</p>
  
  <ol>
    <li>people should own their data in practice</li>
    <li>application features that can, should work offline</li>
    <li>using simple tools like this one should not require registering</li>
  </ol>
  
  <p>To reflect this, Tasks works differently from most apps and websites</p>
  
  <ol>
    <li>there is no sign up process, username or password</li>
    <li>data is stored locally and synced only to the user's other devices, when they decide. The sync feature requires a network connection and WebRTC support.</li>
    <li>the application works offline, including backing up and restoring data.</li>
  </ol>
  
  <p>The first two items are tradeoffs:</p>
  
  <ol>
    <li>Lack of username and password means anybody who walks up can see and edit tasks</li>
    <li>The manual syncing is far less convenient than automatically syncing through a server that stores a copy.</li>
  </ol>
  
  <h2>How it works</h2>
  
  <p>In addition to the core ideas, Tasks was born of the desire to learn about:</p>
  
  <ol>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">PWAs</a>: a group of technologies that can help websites work offline</li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/indexedDB">indexedDB</a>: a database widely supported in web browsers</li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Glossary/WebRTC">WebRTC</a>: a P2P technology that allows direct connections between two devices</li>
  </ol>
  
  <p>The "sync only when you choose" feature also requires a way to reconcile actions, like completing or editing a task, taken on separate devices during overlapping time periods. To solve this, Tasks takes a simplified, <a href="https://crdt.tech/">CRDT</a> (Conflict-free Replicated Data Type) -inspired approach.</p>
  
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
  
  <!-- describe how actions are used for syncing and rebuilding state -->
</div>
