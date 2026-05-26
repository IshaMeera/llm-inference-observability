const session = {};

function getHistory(sessionId){
    return session[sessionId] || [];
}

function saveMessage(sessionId, role, content){
    if(!session[sessionId]){
        session[sessionId] = [];
    }

    session[sessionId].push({ sessionId, role, content });
    return session[sessionId].slice(-4);
}

module.exports = {
    getHistory,
    saveMessage
}