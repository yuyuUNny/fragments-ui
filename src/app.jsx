// import { signIn, getUser, signOut } from './auth.js';
// import { getUserFragments } from './api.js';

// async function init() {
//   console.log('Initializing app...');

//   const userSection = document.querySelector('#user');
//   const loginBtn = document.querySelector('#login');

//   const user = await getUser();
//   if (user) {
//     userSection.innerHTML = `
//       <p>Welcome, ${user.username}!</p>
//       <button id="logout">Logout</button>
//     `;
//     const logoutBtn = document.querySelector('#logout');
//     logoutBtn.addEventListener('click', async () => {
//       await signOut();
//     });
//     try {
//       const fragments = await getUserFragments(user);
//       console.log('User fragments:', fragments);
//     } catch (error) {
//       console.error('Failed to get fragments:', error);
//     }
//   } else {
//     loginBtn.addEventListener('click', signIn);
//   }
// }

// addEventListener('DOMContentLoaded', init);

// App.jsx
import React, { useState, useEffect } from 'react';
import { signIn, getUser, signOut } from './auth.js';
import { getUserFragments } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const u = await getUser();
        if (u) {
          setUser(u);
          try {
            const f = await getUserFragments(u);
            if (Array.isArray(f)) {
              setFragments(f);
            } else {
              console.warn('Fragments is not an array:', f);
              setFragments([]);
            }
          } catch (err) {
            console.error('Failed to fetch fragments:', err);
            setFragments([]);
          }
        }
      } catch (err) {
        console.error('Failed to get user:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <p>Please log in</p>
        <button onClick={signIn}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {user.username ?? 'User'}!</p>
      <button onClick={signOut}>Logout</button>

      <h3>Your Fragments</h3>
      {fragments.length === 0 ? (
        <p>No fragments found</p>
      ) : (
        <ul>
          {fragments.map((frag, idx) => (
            <li key={frag.id ?? frag.fragmentId ?? idx}>
              {typeof frag === 'object' ? JSON.stringify(frag) : String(frag)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

