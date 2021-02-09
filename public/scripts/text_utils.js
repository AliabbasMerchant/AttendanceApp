$(document).ready(function () {
    $('.date').each(function (_index, _element) {
        var text = $(this).text();
        if (text) {
            var date = new Date((new Date(text)).setUTCHours(0,0,0,0));
            var stringDate =
                String(date.getDate()).padStart(2, '0') + '/' +
                String(date.getMonth() + 1).padStart(2, '0') + '/' +
                // String(date.getFullYear()).slice(2);
                String(date.getFullYear());
            $(this).text(stringDate);
        } else {
            $(this).text('-');
        }
    });
    $('.phone_number').each(function (_index, _element) {
        var text = $(this).text();
        if (text) {
            var numbers = text.split(',');
            var numberHTMLs = [];
            numbers.forEach(number => {
                number = number.trim();
                numberHTMLs.push('<a href="tel:' + number + '">' + number + '</a>');
            });
            $(this).html(numberHTMLs.join(', '));
        } else {
            $(this).text('-');
        }
    });
});
