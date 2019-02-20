chrome.bookmarks.search(/''/, res => {
    bookmarks = res.filter(e => {
        return e.url
    })
})

let bookmarks;

chrome.runtime.onMessage.addListener((message, sender, reply) => {
    // console.log(message, sender, reply)
    if (message.key == "bookmarks") reply(bookmarks);
    else if (message.key == "newtab") window.open("https://google.com");
});