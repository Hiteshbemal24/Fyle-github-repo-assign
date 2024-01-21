const perPageOptions = [10, 20, 50, 100];
let currentPage = 1;
let repositoriesPerPage = 10;

function fetchRepositories() {
    const username = document.getElementById('username').value;
    const apiUrlUser = `https://api.github.com/users/${username}`;
    const apiUrlRepos = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${repositoriesPerPage}`;

    document.getElementById('loader').style.display = 'block';
    document.getElementById('repositories').innerHTML = '';
    document.getElementById('user-profile').innerHTML = '';

    // Fetch user data
    fetch(apiUrlUser)
    .then(response => {
        if (!response.ok) {
            throw new Error('User not found');
        }
        return response.json();
    })
    .then(userData => {
        displayUserProfile(userData);
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Please enter a valid username.');
    });


    // Fetch repositories
    fetch(apiUrlRepos)
        .then(response => response.json())
        .then(data => {
            displayRepositories(data);
            displayPagination(data.length);
        })
        .catch(error => console.error('Error fetching repositories:', error))
        .finally(() => document.getElementById('loader').style.display = 'none');
}
    //display profile
function displayUserProfile(userData) {
    const userProfileContainer = document.getElementById('user-profile');

    userProfileContainer.innerHTML = `
    <div class="header">
    <div class="profile-header">
            <img src="${userData.avatar_url}" alt="Profile Picture">
            <a href="${userData.html_url}" target="_blank" class="github-link">GitHub</a>
        </div>
        <div class="profile-details">
            <h1>${userData.name}</h1>
            <p class="bio">${userData.bio || 'Bio goes here'}</p>
            <p class="location">Location: ${userData.location || 'N/A'}</p>
            <p class="twitter"><a href="${userData.twitter || '#'}" target="_blank">Twitter</a></p>
        </div>
    </div>
        
    `;
}
        function displayRepositories(repositories) {
            const repositoriesContainer = document.getElementById('repositories');

            repositories.forEach(repo => {
                const repositoryDiv = document.createElement('div');
                repositoryDiv.classList.add('repository');

                repositoryDiv.innerHTML = `
                    <h2>${repo.name}</h2>
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="topics">${repo.topics ? 'Topics: ' + repo.topics.join(', ') : 'No topics available.'}</div>
                `;

                repositoriesContainer.appendChild(repositoryDiv);
            });
        }

        function displayPagination(totalRepositories) {
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';

            const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);

            const perPageSelect = document.createElement('select');
            perPageOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.text = option;
                perPageSelect.appendChild(optionElement);
            });
            perPageSelect.value = repositoriesPerPage;
            perPageSelect.addEventListener('change', () => {
                repositoriesPerPage = parseInt(perPageSelect.value, 10);
                currentPage = 1;
                fetchRepositories();
            });

            const pageNumbers = document.createElement('div');
            for (let i = 1; i <= totalPages; i++) {
                const pageNumber = document.createElement('span');
                pageNumber.textContent = i;
                pageNumber.addEventListener('click', () => {
                    currentPage = i;
                    fetchRepositories();
                });
                pageNumbers.appendChild(pageNumber);
            }

            paginationContainer.appendChild(document.createTextNode('Items per page: '));
            paginationContainer.appendChild(perPageSelect);
            paginationContainer.appendChild(document.createTextNode(' | Page: '));
            paginationContainer.appendChild(pageNumbers);
        }