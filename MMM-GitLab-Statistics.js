Module.register("MMM-GitLab-Statistics", {
    defaults: {
        url: "",
        token: ""
    },

    requiresVersion: "2.1.0", // Required version of MagicMirror

    start: function() {
        var self = this;

        self.getData();
    },

    /*
     * getData
     * function example return data and show it in the module wrapper
     * get a URL request
     *
     */
    getData: function() {
        var self = this;

        var dataRequest = new XMLHttpRequest();
        dataRequest.open("GET", self.config.url, true);
        dataRequest.onreadystatechange = function() {
            Log.info(this.readyState);
            Log.info(this.status);
            Log.info(this.response);
        };
        dataRequest.send();
    },

});