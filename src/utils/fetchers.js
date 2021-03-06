const server_domain = process.env.VUE_APP_SERVER_DOMAIN;
const version_number = process.env.VUE_APP_VERSION_NUMBER;

export const validated = (feedURL) => {
  // validate URL
  if (feedURL.length > 0) {
    if (validURL(feedURL)) {
      return true;
    } else {
      console.log(feedURL);
      alert("Enter valid URL");
      return false;
    }
  }
  alert("Enter URL");
  return false;
};

export const validURL = (feedURL) => {
  // validate URL
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + 
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + 
    "((\\d{1,3}\\.){3}\\d{1,3}))" +
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
    "(\\?[;&a-z\\d%_.~+=-]*)?" + 
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(feedURL);
};

const notifyAdd = (feedURL) => {
  // notify user of adding URL
  alert("Added " + feedURL + " to daily news feed");
  window.location.reload();
};

export const addURL = (feedURL) => {
  // add URL to localstorage after validation
  console.log(feedURL);
  if (typeof localStorage.getItem("feedURLs") == "undefined") {
    console.log(feedURL + " set");
    localStorage.setItem("feedURLs", JSON.stringify([feedURL]));
    notifyAdd(feedURL);
  } else {
    var currentURLs = JSON.parse(localStorage.getItem("feedURLs"));
    console.log(currentURLs);
    if (currentURLs == null) {
      localStorage.setItem("feedURLs", JSON.stringify([feedURL]));
      notifyAdd(feedURL);
    } else {
      if (currentURLs.includes(feedURL)) {
        alert("Already added to daily news feed");
      } else {
        if (validated(feedURL)) {
          currentURLs.push(feedURL);
          localStorage.setItem("feedURLs", JSON.stringify(currentURLs));
          notifyAdd(feedURL);
        }
      }
    }
  }
};

export const getFeedURLs = () => {
  // parse and return list of feedURLs from localstorage
  return JSON.parse(localStorage.getItem("feedURLs"));
};

export const fetchRSSFeed = (feedURL) => {
  // POST request with feedURL query
  // Server response with RSS feed to given feedURL

  return fetch(`${server_domain}/v${version_number}/rss-feed/`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedURL }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
};

export const fetchAggregatedRSSFeed = (feedURLs) => {
  // GET request with stored feedURLs
  // Server response with aggregated RSS feed
  
  return fetch(`${server_domain}/v${version_number}/aggregate-feed/`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedURLs }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
};
