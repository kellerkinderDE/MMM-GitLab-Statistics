Module.register("MMM-GitLab-Statistics", {
    defaults: {
        url: "",
        token: ""
    },

    requiresVersion: "2.1.0", // Required version of MagicMirror

    init: function() {
        Log.info("Haaaaaalllllllooooooooo");
        console.log("Foo Init");
    },

    start: function() {
        var self = this;

        console.log("Start GitLab Statistics");

        Log.info("Starting");

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
        var self = this;

        Log.info(self.config);

        var dataRequest = new XMLHttpRequest();
        dataRequest.open("GET", self.config.url, true);
        dataRequest.onreadystatechange = function() {
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