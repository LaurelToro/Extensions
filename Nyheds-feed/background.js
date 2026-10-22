browser.runtime.onMessage.addListener((request) => {
    if (request.action === "fetchNews") {
        return fetch("https://www.dr.dk/nyheder/service/feeds/senestenyt")
            .then(response => {
                if (!response.ok) throw new Error("DR svarede med status " + response.status);
                return response.text();
            })
            .then(xmlText => ({ success: true, data: xmlText }))
            .catch(error => ({ success: false, error: error.message }));
    }
});
