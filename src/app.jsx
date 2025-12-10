import { useState, useEffect } from 'react';
import { signIn, getUser, signOut } from './auth.js';
import { getUserFragments, createFragment } from './api.js';

export default function App () {
  const [user, setUser] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Test POST to the fragments API
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('text/plain');
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState(null);

  useEffect(() => {
    async function init () {
      setLoading(true);
      try {
        const u = await getUser();
        if (u) {
          setUser(u);
          try {
            const f = await getUserFragments(u);
            if (f?.status === 'ok' && Array.isArray(f.fragments)) {
              setFragments(f.fragments);
            } else {
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

  // Test POST to fragments API
  async function handleCreateFragment (e) {
    e.preventDefault();
    setCreating(true);
    setCreateResult(null);

    try {
      const result = await createFragment(user, content, contentType);
      setCreateResult({
        success: true,
        location: result.location,
        fragment: result.fragment
      });

      // Update fragments showing
      setFragments(prev => [...prev, result.fragment]);
      // Clear form
      setContent('');
    } catch (err) {
      console.error('Failed to create fragment:', err);
      setCreateResult({
        success: false,
        error: err.message
      });
    } finally {
      setCreating(false);
    }
  }

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
      <title>Fragments UI v0.11.2 - Advanced</title>
      <p>Welcome, {user.username ?? 'User'}!</p>
      <button onClick={signOut}>Logout</button>

      <h3>Your Fragments</h3>
      {
        fragments.length === 0
          ? (
              <p>
                No fragments found
              </p>
            )
          : (
              <ul>
                {fragments.map((frag, idx) => (
                  <li key={frag.id ?? frag.fragmentId ?? idx}>
                    {typeof frag === 'object' ? JSON.stringify(frag) : String(frag)}
                  </li>
                ))}
              </ul>
            )
      }
      <div>
        <h3>Create New Fragment</h3>
        <form onSubmit={handleCreateFragment}>
          <label htmlFor="contentType">Content Type:</label>
          <select
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="text/plain">text/plain</option>
              <option value="text/html">text/html</option>
              <option value="text/markdown">text/markdown</option>
              <option value="application/json">application/json</option>
            </select>
          <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter fragment content here"
              required
            />
          <button
            type="submit"
            disabled={creating}
          >
            Create Fragment
          </button>
        </form>
      </div>
    </div>
  );
}
