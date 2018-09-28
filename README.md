# MMM-GitLab-Statistics

This is a module for [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Shows all projects with current activity and their commit additions and deletions.

## Usage
Clone this repository into your `modules` directory and add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-GitLab-Statistics',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `url`            | *Required* URL to your GitLab instance
| `token`          | *Required* API Token for your GitLab Instance
| `intervalTime`   | *Optional* Update statistics after interval <br><br>**Type:** `int`(milliseconds) <br>Default 600000 milliseconds (10 minutes)