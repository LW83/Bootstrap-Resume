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

function fetchGitHubInformation(event) {

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
        $.getJSON(`https://api.github.com/users/${username}`)
    ).then(
        function(response) {
            var userData = response; /* First argument which is response from JSON method */
            $("#gh-user-data").html(userInformationHTML(userData)); /* Select div and set HTML to results of another function */
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2>No info found for user ${username}</h2>`);
            } else { /* If not a 404 error */
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}
