$(document).ready(function () {

    const queryString = window.location.search;
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(queryString);

    // Calcuate from URL
    if (urlParams.get('fig1')) {
        const fig1 = urlParams.get('fig1')
        const fig2 = urlParams.get('fig2')
        $(".fig-1:input").val(fig1)
        $(".fig-2:input").val(fig2)
        calculate(fig1, fig2, path);
    }

    // Calculate from Button
    $("form").submit(function (e) {
        e.preventDefault();
        gtag("event", "calculate");
        const fig1 = $(".fig-1:input").val()
        const fig2 = $(".fig-2:input").val()
        calculate(fig1, fig2, path);
    });

    // Copy Link
    $(".copy-btn").click(function () {
        const copyText = $(".copy-btn").attr("data-copy-link");
        navigator.clipboard.writeText(copyText);
        $(".copy-btn").text("Copied!");
        setTimeout(function () { $(".copy-btn").html("<i class='bi bi-clipboard'></i> Copy calculation link"); }, 2000);
    });

    // Calculate Function
    function calculate(fig1, fig2, path) {
        const result = (fig1 / fig2) * 100
        $(".copy-btn").attr("data-copy-link", "https://growthcalculators.com" + path + "?fig1=" + fig1 + "&fig2=" + fig2)
        $(".empty-box").remove()
        $(".result-box").show()
        $(".result").text(result.toFixed(2) + "%")
    }

});
