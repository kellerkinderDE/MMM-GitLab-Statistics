Module.register("MMM-GitLab-Statistics", {
    defaults: {
        url: "",
        token: "",
        intervalTime: 10 * 60 * 1000
    },

    requiresVersion: "2.1.0", // Required version of MagicMirror

    getTranslations: function() {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        };
    },

    getStyles: function() {
        return [
            'style.css'
        ];
    },

    start: function() {
        var self = this;

        console.log("Start GitLab Statistics");

        self.latestActivity = null;

        self.getData();

        // Update every 10 minutes
        setInterval(function() {
            self.getData();
        }, self.config.intervalTime);
    },

    /*
     * getData
     * function example return data and show it in the module wrapper
     * get a URL request
     *
     */
    getData: function() {
        var self = this,
            params = {
                statistics: true,
                private_token: self.config.token,
                per_page: 100,
                order_by: 'last_activity_at',
            },
            query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&'),
            dataRequest = new XMLHttpRequest();

        dataRequest.open("GET", self.config.url + "/projects?" + query, true);
        dataRequest.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }

            if (this.status === 200) {
                self.processResponse(this.response);
                self.updateDom();
            }
        };
        dataRequest.send();
    },

    processResponse: function(response) {
        var self = this,
            jsonResponse = JSON.parse(response),
            today = new Date().setHours(0,0,0,0),
            result = [],
            i = 0,
            currentProject = jsonResponse[i],
            params = {
                since: new Date(today).toISOString(),
                private_token: self.config.token,
                with_stats: true,
                all: true
            },
            query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');

        while (Date.parse(currentProject.last_activity_at) > today) {
            var dataRequest = new XMLHttpRequest();

            dataRequest.open("GET", self.config.url + "/projects/" + currentProject.id + "/repository/commits?" + query, true);
            dataRequest.onreadystatechange = (function(index) {
                return function() {
                    if (this.readyState !== 4) {
                        return;
                    }

                    if (this.status === 200) {
                        console.log(self.latestActivity[index]);
                        self.latestActivity[index].commits = JSON.parse(this.response);
                        self.updateDom();
                    }
                }
            })(i);

            dataRequest.send();

            result.push(currentProject);
            currentProject = jsonResponse[++i];
        }

        console.log(result);

        self.latestActivity = result;
    },

    getDom: function(){
        var self = this,
            wrapper = document.createElement("div");

        wrapper.append(self.getLatestActivityDom());

        return wrapper;
    },

    getLatestActivityDom: function() {
        var self = this,
            wrapper = document.createElement("div"),
            list = document.createElement("ul"),
            commitStats, commitString, listItem;

        if (self.latestActivity === null) {
            return wrapper;
        }

        list.className = 'latest-activity';

        wrapper.innerHTML = "<p class='bright'>" + this.translate('title') + "</p>";

        self.latestActivity.forEach(function(project) {
            commitStats = self.getCommitAdditionsAndDeletions(project);
            commitString = ` (+${commitStats.additions} -${commitStats.deletions})`;

            listItem = document.createElement("li");
            listItem.textContent = project.path_with_namespace + commitString;

            list.appendChild(listItem);
        });

        wrapper.appendChild(list);

        return wrapper;
    },

    getCommitAdditionsAndDeletions: function(project) {
        var self = this,
            result = {
                additions: 0,
                deletions: 0
            };

        if (!project.commits) {
            return result;
        }

        project.commits.forEach(function(commit) {
            result.additions += commit.stats.additions;
            result.deletions += commit.stats.deletions;
        });

        return result;
    },
});