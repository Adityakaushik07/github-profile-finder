function fetchGitHubData(username) {
  const error = document.getElementById("error");
  const profile = document.getElementById("profile-container");
  const repoList = document.getElementById("repoList");

  // Clear previous data
  error.classList.add("hidden");
  profile.classList.add("hidden");
  repoList.innerHTML = "";

  fetch(`https://api.github.com/users/${username}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Not Found") {
        error.classList.remove("hidden");
        return;
      }

      // Basic Info
      document.getElementById("profilePic").src = data.avatar_url;
      document.getElementById("username").innerText = data.name || data.login;
      document.getElementById("bio").innerText =
        data.bio || "No bio available.";
      document.getElementById(
        "repo"
      ).innerText = `📦 Public Repos: ${data.public_repos}`;
      document.getElementById(
        "followers"
      ).innerText = `👥 Followers: ${data.followers}`;
      document.getElementById(
        "followings"
      ).innerText = `🔁 Following: ${data.following}`;

      // New Fields
      document.getElementById("location").querySelector("span").innerText =
        data.location || "Not Available";

      document.getElementById("company").querySelector("span").innerText =
        data.company || "Not Available";

      const blog = data.blog ? data.blog : "#";
      const blogText = data.blog ? data.blog : "Not Available";
      document.getElementById("website").querySelector("a").href = blog;
      document.getElementById("website").querySelector("a").innerText =
        blogText;

      const twitter = data.twitter_username
        ? `https://twitter.com/${data.twitter_username}`
        : "#";
      const twitterText = data.twitter_username || "Not Available";
      document.getElementById("twitter").querySelector("a").href = twitter;
      document.getElementById("twitter").querySelector("a").innerText =
        twitterText;

      const joinedDate = new Date(data.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      document.getElementById("joined").querySelector("span").innerText =
        joinedDate;

      profile.classList.remove("hidden");

      // Fetch recent repos
      return fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
      );
    })
    .then((res) => res?.json())
    .then((repos) => {
      if (!repos) return;
      const repoHTML = repos
        .map(
          (repo) => `
          <a href="${
            repo.html_url
          }" target="_blank" class="block bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition border border-gray-600">
            <span class="text-white font-semibold">📌 ${repo.name}</span><br />
            <span class="text-gray-400 text-xs">${
              repo.description || "No description"
            }</span>
          </a>`
        )
        .join("");
      repoList.innerHTML = repoHTML;
    })
    .catch((err) => {
      error.classList.remove("hidden");
      console.error("Error:", err);
    });
}

document.querySelector("#search-Btn").addEventListener("click", () => {
  const username = document.querySelector("#search-bar").value.trim();
  if (username) {
    fetchGitHubData(username);
  } else {
    alert("⚠️ Please enter a GitHub username.");
  }
});
