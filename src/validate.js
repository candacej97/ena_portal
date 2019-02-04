
function validateAnnouncementFields(...args){    
    const {name, location, date, promoRequest: promoRequest, promoMaterial: promoMaterial} = args[0];
    const errors = { count: 0 };

    if (!name) {
        errors.name = "You must include a name for the event.";
        errors.count++;
    }
    if (!location) {
        errors.location = "You must include a location for the event.";
        errors.count++;
    }
    if (!date) {
        errors.date = "You must include a date for the event.";
        errors.count++;
    }
    if (promoMaterial && !promoRequest) {
        errors.promo_request = "If you include promotion material and do not request promotional aide, promotional aide will not be provided.";
        errors.count++;
    }

    return errors;
}

module.exports = {
    validateAnnouncementFields: validateAnnouncementFields,
};