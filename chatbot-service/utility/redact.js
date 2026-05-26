function redact(text = ""){
    return text

    .replace(/\b\S+@\S+\.\S+\b/g, "[EMAIL]")
    .replace(/\+?\d[\d\s\-()]{7,15}\d/g, "[PHONE]")
}

module.exports = {
    redact
}