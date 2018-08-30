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
            console.log(this);
            self.response = this.response;
        };
        dataRequest.send();
    },

    getDom: function(){
        var self = this;

        var wrapper = document.createElement("div"),
            response = document.createElement("div"),
            demo = document.createElement("div");

        response.innerHTML = self.response;
        demo.innerHTML = 'Hallo!';

        wrapper.append(demo);
        wrapper.append(response);

        return wrapper;
    },

});