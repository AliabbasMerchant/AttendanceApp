$(document).ready(function () {
    $('.date').each(function (_index, _element) {
        var text = $(this).text();
        if (text) {
            var date = new Date();
            var stringDate =
                String(date.getDate()) + "/" +
                String(date.getMonth() + 1).padStart(2, '0') + "/" +
                String(date.getFullYear()).padStart(2, '0');
            $(this).text(stringDate);
        }
    });
});
