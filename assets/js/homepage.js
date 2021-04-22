var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

// to be executed upon a form submission browser event.
var formSubmitHandler = function(event) {
    event.preventDefault();
    //  Get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    }else {
        alert("Please enter a Github uername");
    }
    console.log(event);   
};

var buttonClickHandler = function (event) {
    // gets the language attribute from the button clicked
    var language = event.target.getAttribute("data-language");
    
    if (language) {
        getFeaturedRepos(language);

        // Clear Old Content
        repoContainerEl.textContent = "";
    }
}

var getUserRepos = function(user) {
    // format the github api url
var apiUrl = "https://api.github.com/users/" + user + "/repos";
// Variables to store a referebce to the form

// make a request to the url
fetch(apiUrl)
    .then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {
            displayRepos(data, user);
        });
    }else {
        alert("Error: " + response.statusText); 
    }
})
.catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method 
    alert("Unable to connect to GitHub");
});
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
            // console.log(response);
        }else {
            alert('Error: Github User Not Found');
        }
    });
};

var displayRepos = function(repos, searchTerm) {
    // Check if api returned any repos
    if(repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    console.log(repos);
    console.log(searchTerm);
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop for repos 
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //  Create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        
        // Create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        
        //  Append to container 
        repoEl.appendChild(titleEl);

        // create a status element
var statusEl = document.createElement("span");
statusEl.classList = "flex-row align-center";

// check if current repo has issues or not
if (repos[i].open_issues_count > 0) {
  statusEl.innerHTML =
    "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
} else {
  statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
}

// append to container
repoEl.appendChild(statusEl);

        // Append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }
}

// Event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);

languageButtonsEl.addEventListener("click", buttonClickHandler);