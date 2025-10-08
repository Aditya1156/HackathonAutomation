/**
 * Fetches full user data from the GitHub API.
 * In a real application, these calls should be proxied through a backend service for security and to manage API keys.
 * @param username The GitHub username to look up.
 * @returns An object with the user's name, login, and avatar_url, or null if not found.
 */
export const fetchGithubUser = async (username: string): Promise<{ name: string | null; login: string; avatar_url: string } | null> => {
  if (!username.trim()) {
    return null;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.ok) {
      const data = await response.json();
      return {
        name: data.name, // Can be null
        login: data.login,
        avatar_url: data.avatar_url,
      };
    }
    return null; // User not found
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    // Propagate a specific error message to the UI
    throw new Error("Failed to connect to GitHub. Please try again later.");
  }
};

/**
 * Searches for GitHub users based on a query.
 * @param query The search term.
 * @returns An array of user objects. Note: to conserve API calls, the 'name' field is always returned as null. The full profile should be fetched separately.
 */
export const searchGithubUsers = async (query: string): Promise<{ login: string; avatar_url: string; name: string | null }[]> => {
  if (query.length < 2) {
    return [];
  }

  try {
    const searchResponse = await fetch(`https://api.github.com/search/users?q=${query}&per_page=5`);
    if (!searchResponse.ok) {
        if (searchResponse.status === 403) {
            console.warn("GitHub API rate limit exceeded.");
            throw new Error("GitHub API rate limit exceeded. Please wait a moment and try again.");
        }
        throw new Error(`GitHub API responded with ${searchResponse.status}`);
    }
    const searchData = await searchResponse.json();
    
    // The search API provides basic user info (login, avatar_url) but not the full name.
    // To avoid hitting the GitHub API rate limit, we are NOT fetching the full profile for each search result here.
    // The UI will fetch the full name only when a user is selected or the input is blurred.
    return searchData.items.map((user: { login: string; avatar_url: string; }) => ({
        login: user.login,
        avatar_url: user.avatar_url,
        name: null, // The 'name' is intentionally null to be fetched later.
    }));
      
  } catch (error) {
    console.error("Error searching GitHub users:", error);
    // Re-throw to be caught in the component
    throw error;
  }
};