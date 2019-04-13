module.exports = {
    days: (date) => {
        var timestamp = new Date(Date.now());
        var day = Math.round((Date.parse(timestamp) - Date.parse(date)) / (1000 * 60 * 60 * 24))
        return day
    },

    hours: (date) => {
        var timestamp = new Date(Date.now());
        var day = Math.abs(Math.round((Date.parse(timestamp) - Date.parse(date)) / (1000 * 60 * 60)) - 24)
        return day
    }
}