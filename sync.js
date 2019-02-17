const channel = new BroadcastChannel('extensor');
let bookmarks;
channel.onmessage = e => {
    let msg = e.data;
    if (msg.type == "open") {
        open(msg.val);
    }
    console.log(e.data)
};
console.log(channel);

chrome.runtime.sendMessage({
    key: "bookmarks"
}, response => {
    bookmarks = response;
    // console.log(bookmarks)
});

// chrome.runtime.onMessage.addListener((message, sender, reply) => {
//     console.log(message, sender, reply)
// });