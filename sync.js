const channel = new BroadcastChannel('extensor');
channel.onmessage = e => {
    let msg = e.data;
    if (msg.type == "open") {
        open(msg.val);
    }
    console.log(e.data)
};
console.log(channel);