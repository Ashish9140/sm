(function () {
    fetch(`https://api.ipregistry.co/?key=6eyjz6ms4w8s1ef7`).then((response) => response.json())
        .then((data) => {
            user.ip = data.ip;
            user.iptype = data.type;
            user.name = data.user_agent.name;
            user.type = data.user_agent.type;
            user.version = data.user_agent.version;
            user.device = data.user_agent.device;
            user.os.name = data.user_agent.os.name;
            user.os.type = data.user_agent.os.type;

        })

    let date = new Date();
    console.log(typeof (date), date);

})();