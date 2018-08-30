Module.register("MMM-GitLab-Statistics", {
    defaults: {
        url: "",
        token: ""
    },

    requiresVersion: "2.1.0", // Required version of MagicMirror

    start: function() {
        var self = this;

        console.log("Start GitLab Statistics");

        self.response = null;

        self.getData();
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
            currentProject = jsonResponse[i];

        console.log(response);
        console.log(currentProject);
        console.log(Date.parse(currentProject.latest_activity_at));
        console.log(today);
        console.log(Date.parse(currentProject.latest_activity_at) > today);

        while (Date.parse(currentProject.latest_activity_at) > today) {
            result.push(currentProject);
            currentProject = jsonResponse[++i];
        }

        console.log(result);
    },

    getDom: function(){
        var self = this,
            wrapper = document.createElement("div");

        wrapper.append(self.getLatestActivityDom());

        return wrapper;
    },

    getLatestActivityDom: function() {
        var self = this,
            wrapper = document.createElement("div");

        if (self.response === null) {
            return wrapper;
        }

        wrapper.innerHTML = "<h1>Latest activities</h1><ul>";

        self.response.forEach(function(project) {
            wrapper.innerHTML += "<li>" + project.path_with_namespace + "</li>";
        });

        wrapper.innerHTML += "</ul>";

        return wrapper;
    },

});