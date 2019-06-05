(function(anchorp){

    
    function printSearchBox(anchorp){

        mainBlueprint = `

            <form class="formContainer" onsubmit="return false">
                <input type="text" class="searchInput" placeholder="Search username..." autocomplete="false" autofocus />
                <button type="button" id="searchButton">Search</button>
            </form>
            <section class="userInfoContainer">
            </section>
        `;

        anchorp.innerHTML = mainBlueprint;

        document.querySelector(".searchInput").onkeypress = (event) => {

            
            if(event.keyCode == 13){
                
                getUser();
            };
        };

        document.getElementById('searchButton').onclick = function(){

            getUser();
        };
    };

    function getUser(){

            let userInfoAnchor = document.querySelector(".userInfoContainer");

                                                                        //request retrieving info from server          

            let request = new XMLHttpRequest();
                                                                        //gets search parameter (username)
            let username = document.querySelector('.searchInput').value;

            request.open('GET', 'https://api.github.com/users/' + username);

            request.onload = function() {

                let data = JSON.parse(request.responseText);

                                                    //in case user doesn't exist, server will answer with message obj
                if(data.message){
            
                   userInfoAnchor.innerHTML = `
                   
                        <span class="userDontExist">Does not exist</span>`;

                }else if(data){
                                                //checks if user has public repos
                    if(data.public_repos){
                                                //if so, it calls getUserRepos to get repos & print results

                       getUserRepos(userInfoAnchor, username, data);

                    }else if(data && !data.public_repos){

                                                //otherwise it calls printUserInfo to print directly results

                        printUserInfo(userInfoAnchor, data);

                    }else{

                        console.log('Unknown error');
                    };

                }else{

                    console.log('Unknown error');
                };
                
            };

            request.send();

    };


    function getUserRepos(anchorp, username, data){

                                                //request retrieving user repositories
        let request = new XMLHttpRequest();


        request.open('GET', 'https://api.github.com/users/' + username +'/repos');

        request.onload = () => {

            let userRepos = JSON.parse(request.responseText);
            
            printUserInfo(anchorp, data, userRepos);
        };

        request.send();


    };

    function printUserInfo(userInfoAnchor, data, userRepos){

        let repoList = "";
                                    //if user has repos, this will print them
        if (userRepos){
            
            for(let aRepo of userRepos){
                            
                aRepoItem = `

                    <span class="repoItemName">${aRepo.name}</span>

                    <div class="repoItemDetails">
                        <a class="repoLink" ${aRepo.stargazers_count? `href="https://github.com/${aRepo.owner.login}/${aRepo.name}/stargazers" target="_blank"` : ''}>
                            <svg height="16" viewBox="0 0 14 16" version="1.1" width="14" role="img">
                                <path fill-rule="evenodd" d=
                                "M14 6l-4.9-.64L7 1 4.9 5.36
                                0 6l3.6 3.26L2.67 14 7
                                11.67 11.33 14l-.93-4.74L14 6z">
                                </path>
                            </svg>
                            <span>${aRepo.stargazers_count}</span>
                        </a>

                        <a class="repoLink" ${aRepo.forks? `href="https://github.com/${aRepo.owner.login}/${aRepo.name}/network/members" target="_blank"` : ''}>
                            <svg  viewBox="0 0 10 16" version="1.1" width="10" role="img">
                                <path fill-rule="evenodd" d=
                                "M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993
                                0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993
                                0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993
                                0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65
                                0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2
                                0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66
                                0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z">
                                </path>
                            </svg>
                            <span>${aRepo.forks}</span>
                        </a>
                    </div>
                `;
                repoList += `<li class="repoItem">${aRepoItem}</li>`

            };

        };

        userInfoBlueprint = `

            <div class="userPersonalData">
                <figure class="avatarContainer">
                    <img class="userAvatar" src="${data.avatar_url}" />
                </figure>
                <div class="userDetails"
                    <span class="userLogin"><i>@${data.login}</i></span>
                    <h1 class="userName">${data.name}</h1>
                    ${data.bio ? '<span class"userBio"></span>' : ''}
                </div>
            </div>
            ${userRepos ? '<h3 style="text-align: left">Repositories</h3>' : ''}
            <ul class="repoList">
                ${repoList}
            </ul>
        `;


        userInfoAnchor.innerHTML = userInfoBlueprint;

    };
                                    //initialise SPA
    printSearchBox(anchorp);


})(document.getElementById('anchorp'))