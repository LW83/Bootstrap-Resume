function userInformationHTML(user) { /* User is the object that is returned from GitHib API - has many methods */
    return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} Following: ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

function repoInformationHTML(repos) { /* Repos as argument - from GitHub API */
    if (repos.length == 0) { /* GitHub returns object as an array so can use array method on it e.g. length */
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    var listItemsHTML = repos.map(function(repo) { /* Map method works like a for each but it returns an array with the results */
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
    $("#gh-user-data").html(""); /* Clears field */
    $("#gh-repo-data").html(""); /* Clears field */

    var username = $("#gh-username").val(); /* Username value using jQuery */
    if (!username) { /* If not username i.e. if field is left empty */
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return; /* Stops going to GitHub API if field is empty */
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when( /* Creating a promise - when method takes a function as first argument */
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];  /* First argument which is response from JSON method */
            var repoData = secondResponse[0]; /* Need to include index for response when multiple calls */
            $("#gh-user-data").html(userInformationHTML(userData)); /* Select div and set HTML to results of another function */
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2>No info found for user ${username}</h2>`);
            } else if (errorResponse.status === 403) { /* API throttling - limit on how many requests sent to GitHub */
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else { /* If not a 404 error */
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}

$(document).ready(fetchGitHubInformation); /* Automatically loads Octocat profile when page is loaded */
