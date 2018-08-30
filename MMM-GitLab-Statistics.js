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
                per_page: 5,
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
                self.response = JSON.parse(this.response);
                self.updateDom();
            }
        };
        dataRequest.send();
    },

    getDom: function(){
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